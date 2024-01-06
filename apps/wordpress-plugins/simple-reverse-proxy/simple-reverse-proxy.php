<?php
/*
 * Plugin Name: Simple reverse proxy
 * Description: Reverse proxy for API for removing CORS problems from direct call of external API
 * Author: jobes
 * Author URI: https://www.stork-nav.app/contact/
 * License: GNU General Public License v3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Version: 0.0.1
 * Text Domain: jsrp
*/
require_once(ABSPATH . 'wp-admin/includes/plugin.php');

function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
}

function mapped_implode($glue, $array, $symbol = '=') {
    return implode($glue, array_map(
            function($k, $v) use($symbol) { 
                return $k . $symbol . $v;
            }, 
            array_keys($array), 
            array_values($array)
            )
        );
}

function jsrp_menu() {
  add_options_page(
    esc_attr__( 'Simple reverse proxy settings', 'jsrp-simple-reverse-proxy-settings' ),
    esc_attr__( 'Simple reverse proxy', 'srp-simple-reverse-proxy' ),
    'manage_options',
    'jsrp',
    'jsrp_options_page'
  );
}

function jsrp_options_page() {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $result = [];
    for ($i = 0; $i < count($_POST['name']); $i++) {
      array_push($result, ["name" => $_POST['name'][$i], "url" => $_POST['url'][$i] ]);
    }
    update_option('jsrp_name_list', $result);
    echo "<div class=\"success\">Save successfull</div>";
  }
  

  $proxyList = get_option('jsrp_name_list', []);
  echo "<form id=\"proxyForm\" method=\"post\">";
  foreach ($proxyList as $record) {
    ?>
    <div class="input-group">
      <label>Proxy name:</label>
      <input type="text" name="name[]" required value="<?php echo $record['name'];?>">
      <label>URL:</label>
      <input type="text" name="url[]" required value="<?php echo $record['url'];?>">
      <button onclick="remove(event);" class="remove" type="button">Remove</button><br>
    </div>
    <?php
  }
  ?>
  <button onclick="addGroup(event);" id="add-proxy" class="add-button" type="button">Add proxy</button>
  <button class="save" type="submit">Save</button>
  </form>
  
  <script>
  function remove(event) {
    event.preventDefault();
    console.log(event);
    event.target.parentElement.remove();
  }
  function addGroup(event) {
    event.preventDefault();
    form = document.getElementById("proxyForm");
    
    group = document.createElement("div");
    group.classList.add('input-group');
    group.innerHTML=`
    <label>Proxy name:</label>
    <input type="text" name="name[]" required value="">
    <label>URL:</label>
    <input type="text" name="url[]" required value="">
    <button onclick="remove(event);" class="remove" type="button">Remove</button><br>
    `;
    
    
    form.insertBefore(group, document.getElementById('add-proxy'));
    
  }
  </script>
  <style>
  form {
    max-width: 600px;
  }
  .input-group {
    margin-top: 1rem;
  }
  .add-button {
    margin-top: 1rem;
    margin-left: 2rem;
  }
  .remove, .save {
    float: right;
    margin-top: 0.5rem;
  }
  .success {
    background: darkgreen;
    color: white;
    padding: 1rem;
    margin-left: -20px;
  }
  </style>
  
  <?php
}

function proxy_endpoint($request) {
  $name = $request['name'];
  $proxyList = get_option('jsrp_name_list', []);
  $found_key = array_search($name, array_column($proxyList, 'name'));

  if($found_key === false) {
    return new WP_Error( 'oops', esc_html__( 'Proxy API name not found', 'jsrp' ), array( 'status' => 404 ) );
  }
  $url = $proxyList[$found_key]['url'];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, mapped_implode('&', $_POST));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($ch);
  cors();
  echo $response;
  curl_close($ch);
  // return rest_ensure_response($proxyList[$found_key]['url']);
}

function register_routes() {
    // https://www.stork-nav.app/wp-json/jsrp/v1/named
    register_rest_route( 'jsrp/v1', '/named/(?P<name>[a-zA-Z0-9-]+)', array(
        'methods'  => WP_REST_Server::ALLMETHODS,
        'callback' => 'proxy_endpoint',
    ) );
}

add_action('admin_menu', 'jsrp_menu');
add_action('rest_api_init', 'register_routes' );
