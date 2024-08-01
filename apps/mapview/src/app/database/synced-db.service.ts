import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import Dexie, { Table } from 'dexie';
import { IDatabaseChange } from 'dexie-observable/api';
import DexieSyncable from 'dexie-syncable';
import { Position } from 'geojson';
import { LngLat } from 'maplibre-gl';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { account } from '../store/actions/init.actions';
import { generalSettingsActions } from '../store/actions/settings.actions';
import { generalFeature } from '../store/features/settings/general.feature';

interface IServerSync {
  clientIdentity?: string;
  changes: IDatabaseChange[];
  currentRevision: number;
}

export interface IDbInterestPoint {
  id: string;
  name: string;
  icon: string;
  point: Position;
  description?: string;
}

export interface IDbCustomRoute {
  id: string;
  points: { point: LngLat; name: string }[];
}

export interface IDbTrackingPoint {
  id?: string;
  trackStatsId: string;
  timestamp: number;
  data: GeolocationCoordinates;
}

export interface ITrackingRoute {
  id?: string;
  name: string;
  airplane: string;
  startTime: number; // unix timestamp
  flightTime: number; // seconds
}

@Injectable({ providedIn: 'root' })
export class DexieSyncService extends Dexie {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private protocolName = 'dexie-wordpress';

  interestPoints!: Table<IDbInterestPoint, string>;
  customRoutes!: Table<IDbCustomRoute, string>;
  trackingRoutes!: Table<ITrackingRoute, string>;
  trackingPoints!: Table<IDbTrackingPoint, string>;

  private changeObserver$ = new Subject<
    | {
        changes: IDatabaseChange[];
        tables: string[];
      }
    | { clear: true; tables: string[] }
  >();
  public changes$ = this.changeObserver$.asObservable();

  constructor() {
    super('stork-navigation');
    this.version(1).stores({
      interestPoints: '$$id, name', // name is index key for search
      customRoutes: '$$id', // we need just primary key
      trackingRoutes: '$$id, startTime', // for sorting by startTime
      trackingPoints: '$$id, trackStatsId',
    });
    this.registerSyncProtocol(this.protocolName);
    this.syncActionEnabling();
  }

  private syncActionEnabling(): void {
    const token = this.store.selectSignal(generalFeature.selectLoginToken)();
    if (token) {
      this.syncStart();
    }

    this.actions$.pipe(ofType(account.loggedIn)).subscribe((data) => {
      if (data.userChanged) {
        void this.syncEnd().then(() => this.syncStart());
      } else {
        this.syncStart();
      }
    });

    this.actions$.pipe(ofType(generalSettingsActions.logOut)).subscribe(() => {
      void this.syncEnd();
    });
  }

  private syncStart(): void {
    setTimeout(() => {
      console.log('DB sync started');
      this.syncable
        .connect(this.protocolName, environment.dexieWordpressSyncUrl)
        .catch((e) => console.log('sync could not be created', e));
    }, 5000);
  }

  private async syncEnd(): Promise<void> {
    await this.syncable.delete(environment.dexieWordpressSyncUrl);
    await Promise.all(
      this.tables
        .filter(
          (t) => !t.name.startsWith('_') || t.name === '_uncommittedChanges',
        )
        .map((t) => t.clear()),
    );

    const tableNames = this.tables.reduce(
      (acc, val) => [...acc, val.name],
      [] as string[],
    );
    this.changeObserver$.next({
      clear: true,
      tables: tableNames,
    });
  }

  private registerSyncProtocol(protocolName: string): void {
    const http = this.http;
    const pollInterval = 60000; // sync DBs every minute
    const changeObserver$ = this.changeObserver$;
    const tokenSignal = this.store.selectSignal(
      generalFeature.selectLoginToken,
    );
    const nonSyncableTables = ['trackingPoints'];

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
          clientIdentity: (context['clientIdentity'] as string) || null,
          baseRevision: baseRevision as number,
          partial: partial,
          changes: changes.filter(
            (change) => !nonSyncableTables.includes(change.table),
          ),
          syncedRevision: syncedRevision as number,
        };

        http
          .post<IServerSync>(url, request, {
            headers: { Authorization: `Bearer ${tokenSignal()}` },
          })
          .subscribe({
            next: (data) => {
              if ('clientIdentity' in data) {
                context['clientIdentity'] = data.clientIdentity;
                context
                  .save()
                  .then(() => {
                    onChangesAccepted();
                    void applyRemoteChanges(
                      data.changes,
                      data.currentRevision,
                    ).then(() => {
                      changeObserver$.next({
                        changes: data.changes,
                        tables: data.changes.map((change) => change.table),
                      });
                    });
                    onSuccess({ again: pollInterval });
                  })
                  .catch((e) => {
                    onError(e, Infinity);
                  });
              } else {
                onChangesAccepted();
                void applyRemoteChanges(
                  data.changes,
                  data.currentRevision,
                ).then(() => {
                  changeObserver$.next({
                    changes: data.changes,
                    tables: data.changes.map((change) => change.table),
                  });
                });
                onSuccess({ again: pollInterval });
              }
            },
            error: (error: unknown) => {
              onError((error as HttpErrorResponse)?.statusText, pollInterval);
            },
          });
      },
    });
  }
}
