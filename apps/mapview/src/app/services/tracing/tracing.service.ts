import { Injectable, inject } from '@angular/core';

import {
  DexieSyncService,
  ITrackingRoute,
} from '../../database/synced-db.service';

@Injectable({
  providedIn: 'root',
})
export class TracingService {
  private dexieDb = inject(DexieSyncService);
  private currentTrackId?: string;

  async createFlyTrace(airplane: string, name: string): Promise<string> {
    return this.dexieDb.trackingRoutes
      .add({
        name,
        airplane,
        startTime: new Date().getTime(),
        flightTime: 0,
      })
      .then((id) => (this.currentTrackId = id));
  }

  endFlyTrace(): void {
    this.currentTrackId = undefined;
  }

  addTraceItem(
    timestamp: number,
    data: GeolocationCoordinates,
  ): Promise<unknown> {
    const currentTrackId = this.currentTrackId;
    if (!currentTrackId) return Promise.resolve();

    return this.dexieDb.trackingPoints
      .add({
        trackStatsId: currentTrackId,
        timestamp,
        data,
      })
      .then(() => this.dexieDb.trackingRoutes.get(currentTrackId))
      .then((currentRoute) => {
        if (currentRoute) {
          return this.dexieDb.trackingRoutes.update(currentTrackId, {
            flightTime: new Date().getTime() - currentRoute.startTime,
          });
        } else {
          return Promise.resolve(-1);
        }
      });
  }

  async getFlyHistoryListWithTime(
    offset = 0,
    limit = 10,
  ): Promise<{
    list: ITrackingRoute[];
    totalItems: number;
  }> {
    const routes = await this.dexieDb.trackingRoutes
      .orderBy('startTime')
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();

    return {
      list: routes,
      totalItems: await this.dexieDb.trackingRoutes.count(),
    };
  }

  async getFlyTime(type: 'today' | 'month' | 'year' | 'all'): Promise<number> {
    const typeTimeStart = new Date();
    if (type === 'all') typeTimeStart.setFullYear(0, 0, 0);
    if (type === 'year') typeTimeStart.setMonth(0, 1);
    if (type === 'month') typeTimeStart.setDate(1);
    typeTimeStart.setHours(0, 0, 0, 0);

    const allFlyTraces = await this.dexieDb.trackingRoutes
      .where('startTime')
      .aboveOrEqual(typeTimeStart.getTime())
      .toArray();
    return (
      (allFlyTraces.reduce((acc, val) => acc + val.flightTime, 0) || 0) / 1000
    );
  }
}
