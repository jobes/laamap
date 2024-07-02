import { Injectable, inject } from '@angular/core';

import {
  DexieSyncService,
  IDbTracking,
} from '../../database/synced-db.service';

@Injectable({
  providedIn: 'root',
})
export class TracingService {
  private dexieDb = inject(DexieSyncService);
  private currentTrackId?: string;

  async createFlyTrace(airplane: string, name: string): Promise<string> {
    return this.dexieDb.tracking
      .add({
        name,
        airplane,
        points: [],
        startTime: new Date().getTime(),
      })
      .then((id) => (this.currentTrackId = id));
  }

  endFlyTrace(): void {
    this.currentTrackId = undefined;
  }

  addTraceItem(
    timestamp: number,
    item: GeolocationCoordinates,
  ): Promise<number> {
    const currentTrackId = this.currentTrackId;
    if (!currentTrackId) return Promise.resolve(-1);

    return this.dexieDb.tracking
      .get(currentTrackId)
      .then((currentTrack) => {
        const points = currentTrack?.points || [];
        return [...points, { timestamp, item }];
      })
      .then((points) =>
        this.dexieDb.tracking.update(currentTrackId, { points }),
      );
  }

  async getFlyHistoryListWithTime(
    offset = 0,
    limit = 10,
  ): Promise<{
    list: (IDbTracking & { duration: number })[];
    totalItems: number;
  }> {
    const tracingList = (
      await this.dexieDb.tracking
        .orderBy('startTime')
        .reverse()
        .offset(offset)
        .limit(limit)
        .toArray()
    ).map((trace) => {
      const duration =
        trace.points.length >= 2
          ? (trace.points[trace.points.length - 1].timestamp -
              trace.points[0].timestamp) /
            1000
          : 0;
      return { ...trace, duration };
    });
    return {
      list: tracingList,
      totalItems: await this.dexieDb.tracking.count(),
    };
  }

  async getFlyTime(type: 'today' | 'month' | 'year' | 'all'): Promise<number> {
    const typeTimeStart = new Date();
    if (type === 'all') typeTimeStart.setFullYear(0, 0, 0);
    if (type === 'year') typeTimeStart.setMonth(0, 1);
    if (type === 'month') typeTimeStart.setDate(1);
    typeTimeStart.setHours(0, 0, 0, 0);

    const allFlyTraces = await this.dexieDb.tracking.toArray();
    const traceDurations = allFlyTraces.map((trace) => {
      const startPointPerType = trace.points.find(
        (point) => point.timestamp >= typeTimeStart.getTime(),
      );
      if (startPointPerType) {
        const endPointPerType = trace.points[trace.points.length - 1];
        return endPointPerType.timestamp - startPointPerType.timestamp;
      }
      return 0;
    });

    return (traceDurations.reduce((acc, val) => acc + val, 0) || 0) / 1000;
  }
}
