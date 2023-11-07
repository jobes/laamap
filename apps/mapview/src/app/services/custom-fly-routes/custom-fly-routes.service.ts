import { Injectable } from '@angular/core';
import { LngLat } from 'maplibre-gl';
// eslint-disable-next-line @typescript-eslint/naming-convention
import PouchDb from 'pouchdb';

@Injectable({
  providedIn: 'root',
})
export class CustomFlyRoutesService {
  private db = new PouchDb<{ points: { point: LngLat; name: string }[] }>(
    'customFlyRoutes',
    {},
  );
  constructor() {}

  async nameExist(routeName: string): Promise<boolean> {
    try {
      await this.db.get(routeName);
      return true;
    } catch (err) {
      return (err as { name: string }).name !== 'not_found';
    }
  }

  async saveRoute(
    routeName: string,
    points: { point: LngLat; name: string }[],
  ): Promise<void> {
    const revision = await this.getRevision(routeName);
    await this.db.put({ _id: routeName, _rev: revision, points });
  }

  async deleteRoute(routeName: string): Promise<void> {
    const revision = await this.getRevision(routeName);
    if (revision) await this.db.remove({ _id: routeName, _rev: revision });
  }

  private async getRevision(routeName: string): Promise<string | undefined> {
    try {
      const route = await this.db.get(routeName);
      return route._rev;
    } catch (err) {
      return undefined;
    }
  }
}
