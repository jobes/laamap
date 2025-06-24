import { Injectable, inject } from '@angular/core';

import {
  DexieSyncService,
  IDbTrackingPoint,
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

  downloadGpx(id: string, name: string): void {
    this.dexieDb.trackingPoints
      .where('trackStatsId')
      .equals(id)
      .sortBy('timestamp')
      .then((route) => {
        if (route) {
          const gpx = this.generateGPX(route, name);
          const blob = new Blob([gpx], { type: 'text/xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `flight-${name}.gpx`;
          link.click();
        }
      });
  }

  async flyTracingAvailable(trackStatsId: string): Promise<boolean> {
    const point = await this.dexieDb.trackingPoints.get({
      trackStatsId,
    });
    return !!point;
  }

  async renameFlyTrace(id: string, name: string): Promise<void> {
    await this.dexieDb.trackingRoutes.update(id, {
      name,
    });
  }

  async deleteFlyTrace(id: string): Promise<void> {
    this.dexieDb.trackingPoints.where('trackStatsId').equals(id).delete();
    await this.dexieDb.trackingRoutes.delete(id);
  }

  private generateGPX(route: IDbTrackingPoint[], name: string): string {
    return (
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="www.stork-nav.app">\n` +
      `  <trk>\n` +
      `    <name>${name}</name>\n` +
      `    <trkseg>\n` +
      route
        .map(
          (point) =>
            `      <trkpt lat="${point.data.latitude}" lon="${point.data.longitude}">\n      <ele>${Math.round(point.data.altitude ?? 0)}</ele>\n      <time>${new Date(point.timestamp).toISOString()}</time>\n    </trkpt>\n`,
        )
        .join('') +
      `    </trkseg>\n` +
      `  </trk>\n` +
      `</gpx>\n`
    );
  }
}
