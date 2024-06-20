<?php
/*
 * Plugin Name: Dexie database
 * Description: Database synchronization for Dexie indexDb javascript library
 * Author: jobes
 * Author URI: https://www.stork-nav.app/contact/
 * License: GNU General Public License v3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Version: 0.0.1
 * Text Domain: dexiedb
*/

require_once(ABSPATH . 'wp-admin/includes/plugin.php');

class Type {
    const ADD = 1;
    const EDIT = 2;
    const DELETE = 3;
}

$tableName=$wpdb->prefix."dexiedb_sync";

function sync_endpoint($request) {
    global $wpdb, $tableName;
    $userId = 'bobi';
    $clientIdentity = $request['clientIdentity'] ?? uniqid();
    $clientRevision = $request['baseRevision'] ?? 0;
    $clientChanges = $request['changes'];
    $changes = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$tableName} WHERE user= %s and revision > %d", [$userId, $clientRevision]));
    $revision = empty($changes) ? $clientRevision : max(array_column($changes, 'revision'));
    $updateRevision = false;

    $wpdb->query('START TRANSACTION');

    foreach ( $clientChanges as $item) {
        $collisionItem = array_filter($changes, function ($changeItem) use ($item) {
            return $changeItem->table_name === $item['table'] && $changeItem->item_key === $item['key'];
        })[0];
        if($item['type'] === Type::ADD) {
            $updateRevision = $updateRevision || addDataFromClient($userId, $item, $revision, $changes, $collisionItem);
        } else if($item['type'] === Type::EDIT) {
            $updateRevision = $updateRevision || updateDataFromClient($userId, $item, $revision, $changes, $collisionItem);
        } else if($item['type'] === Type::DELETE) {
            $updateRevision = $updateRevision || deleteDataFromClient($userId, $item, $revision, $changes, $collisionItem);
        }
    }
    $wpdb->query('COMMIT');

    if($updateRevision) {
        $revision+=1;
    }

    generateChangeAnswer($changes, $clientRevision, $revision, $clientIdentity);
}

function addDataFromClient($userId, $item, $revision, &$changes, $collisionItem) {
    global $wpdb, $tableName;

    if(!$collisionItem) {
        // client add and no conflict -> save to DB
        $wpdb->insert($tableName,
        [
            'user' => $userId, 
            'table_name' => $item['table'],
            'item_key' => $item['key'],
            'item_obj' => json_encode($item['obj']),
            'deleted' => 0,
            'revision' => $revision + 1,
            'creation_revision' => $revision + 1
        ]);
        return true;
    } else if($collisionItem->deleted != 0) {
        // client add and item deleted from last sync -> send delete from changes, do not save to db, this situation should never happen
        return false;
    } else {
        // client add and item edited from last sync -> send new and do not update DB - this should never happen
        array_walk($changes, function (&$changeItem) {
            if ($changeItem->table_name === $item['table'] && $changeItem->item_key === $item['key']) {
                $changeItem->creation_revision = $revision + 1; // this makes Type::ADD in  generateChangeAnswer
                $changeItem->obj = json_encode($item['obj']);
            }
        });
        return false;
    }
}

function updateDataFromClient($userId, $item, $revision, &$changes, $collisionItem) {
    global $wpdb, $tableName;
    $editDatabases = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$tableName} WHERE user = %s and table_name = %s and item_key = %s LIMIT 1", [$userId, $item['table'], $item['key']]));

    if(!$collisionItem) {
        // client edit and no conflict -> save to DB
        $wpdb->update($tableName,
            [
                'item_obj' =>  json_encode(array_merge((array)json_decode($editDatabases[0]->item_obj), $item['mods'])),
                'revision' => $revision + 1
            ],[
                'user' => $userId,
                'table_name' => $item['table'],
                'item_key' => $item['key'],
            ]);
        return true;
    } else if($collisionItem->deleted != 0) {
        // client edit and item deleted from last sync -> send removed
        return false;
    } else {
        // client edited and item edited from last sync -> use server version
        return false;
    }
    
}

function deleteDataFromClient($userId, $item, $revision, &$changes, $collisionItem) {
    global $wpdb, $tableName;

    if(!$collisionItem) {
        // client deleted and no conflict -> save to DB
        $wpdb->update($tableName,
            [
                'item_obj' => json_encode([]),
                'revision' => $revision + 1,
                'deleted' => 1,
            ],[
                'user' => $userId,
                'table_name' => $item['table'],
                'item_key' => $item['key'],
            ]);
        return true;
    } else {
        // remove from changes as client delete have higher priority
        foreach ($changes as $index => $changeItem) {
            if ($changeItem->id === $collisionItem->id) {
                unset($changes[$index]);
                break;
            }
        }

        if($collisionItem->deleted != 0) {
            // client deleted and item deleted from last sync -> nothing
            return false;
        } else {
            // client deleted and item edited from last sync -> update DB
            $wpdb->update($tableName,
                [
                    'item_obj' => json_encode([]),
                    'revision' => $revision + 1,
                    'deleted' => 1,
                ],[
                    'user' => $userId,
                    'table_name' => $item['table'],
                    'item_key' => $item['key'],
                ]);
            return true;
        }
    }
}

function generateChangeAnswer($changes, $clientRevision, $revision, $clientIdentity) {
    $dexieChanges = array_map(function($change) use ($clientRevision) {
        if($change->deleted != 0) {
            return [
                'type' => Type::DELETE,
                'table'=>$change->table_name,
                'key' => $change->item_key
            ];
        } else if(intval($change->creation_revision) > $clientRevision) {
            return [
                "type"=>Type::ADD,
                "table"=>$change->table_name,
                "key"=>$change->item_key,
                "obj"=> json_decode($change->item_obj)
            ];
        } else {
            return [
                "type"=>Type::EDIT,
                "table"=>$change->table_name,
                "key"=>$change->item_key,
                "mods"=> json_decode($change->item_obj)
            ];
        }
    }, $changes);

    header("Content-Type: application/json");
    echo json_encode([
        "changes" => $dexieChanges,
        "currentRevision" => $revision,
        "clientIdentity" => $clientIdentity
    ]);
}

function register_sync_route() {
   register_rest_route( 'dexiedb/v1', '/dexie-sync', array(
        'methods'  => WP_REST_Server::ALLMETHODS,
        'callback' => 'sync_endpoint',
    ) );
}

function dexiedb_create_db() {
    global $wpdb, $tableName;
    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'dexiedb_sync';

    $sql = "CREATE TABLE $table_name (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user varchar(255) NOT NULL,
        table_name varchar(255) NOT NULL,
        item_key varchar(255) NOT NULL,
        item_obj JSON,
        deleted TINYINT(1) NOT NULL DEFAULT 0,
        revision int(10) unsigned NOT NULL,
        creation_revision int(10) unsigned NOT NULL,
        KEY `userKey` (user),
        KEY `tableKey` (table_name),
        KEY `itemKey` (item_key),
        KEY `revisionKey` (revision)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

add_action('rest_api_init', 'register_sync_route' );
register_activation_hook( __FILE__, 'dexiedb_create_db' );

