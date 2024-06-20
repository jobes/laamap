import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Position } from '@turf/turf';
import Dexie, { Table } from 'dexie';
import { IDatabaseChange } from 'dexie-observable/api';
import DexieSyncable from 'dexie-syncable';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';

interface IServerSync {
  clientIdentity?: string;
  changes: IDatabaseChange[];
  currentRevision: any;
}

export interface IDbInterestPoint {
  id: string;
  name: string;
  icon: string;
  point: Position;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class DexieSyncService extends Dexie {
  private readonly http = inject(HttpClient);
  interestPoints!: Table<IDbInterestPoint, string>;
  private changeObserver = new Subject<{
    changes: IDatabaseChange[];
    tables: string[];
  }>();
  public changes$ = this.changeObserver.asObservable();

  constructor() {
    super('stork-navigation');
    const protocolName = 'dexie-wordpress';
    this.version(1).stores({
      interestPoints: '$$id, name', // name is index key for search
    });
    this.registerSyncProtocol(protocolName); // TODO sync only after login and after logout stop syncing
    this.syncable
      .connect(protocolName, environment.dexieWordpressSyncUrl, {
        authToken: 'theToken',
      })
      .catch((e) => console.log('sync could not be created', e));
  }

  private registerSyncProtocol(protocolName: string): void {
    const http = this.http;
    const pollInterval = 10000; // TODO make configurable
    const changeObserver = this.changeObserver;

    DexieSyncable.registerSyncProtocol(protocolName, {
      sync(
        context,
        url,
        options,
        baseRevision,
        syncedRevision,
        changes,
        partial,
        applyRemoteChanges,
        onChangesAccepted,
        onSuccess,
        onError,
      ) {
        const request = {
          clientIdentity: context['clientIdentity'] || null,
          baseRevision: baseRevision,
          partial: partial,
          changes: changes,
          syncedRevision: syncedRevision,
        };

        http
          .post<IServerSync>(url, request, {
            // headers: { authToken: options.authToken },
          })
          .subscribe({
            next: (data) => {
              if ('clientIdentity' in data) {
                context['clientIdentity'] = data.clientIdentity;
                context
                  .save()
                  .then(() => {
                    onChangesAccepted();
                    applyRemoteChanges(data.changes, data.currentRevision).then(
                      () => {
                        changeObserver.next({
                          changes: data.changes,
                          tables: data.changes.map((change) => change.table),
                        });
                      },
                    );
                    onSuccess({ again: pollInterval });
                  })
                  .catch((e) => {
                    onError(e, Infinity);
                  });
              } else {
                onChangesAccepted();
                applyRemoteChanges(data.changes, data.currentRevision).then(
                  () => {
                    changeObserver.next({
                      changes: data.changes,
                      tables: data.changes.map((change) => change.table),
                    });
                  },
                );
                onSuccess({ again: pollInterval });
              }
            },
            error: (error: HttpErrorResponse) => {
              onError(error.statusText, pollInterval);
            },
          });
      },
    });
  }
}
