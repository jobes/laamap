import { Injectable, inject } from '@angular/core';
import { LngLat } from 'maplibre-gl';

import {
  DexieSyncService,
  IDbCustomRoute,
} from '../../database/synced-db.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFlyRoutesService {
  private readonly dexieDb = inject(DexieSyncService);

  getAllRoutes(): Promise<IDbCustomRoute[]> {
    return this.dexieDb.customRoutes
      .where('id')
      .notEqual('_currentRoute')
      .toArray();
  }

  async searchRoute(
    searchText: string | null,
    limit = 5,
  ): Promise<IDbCustomRoute[]> {
    if (!searchText) {
      return [];
    }
    return await this.dexieDb.customRoutes
      .where('id')
      .startsWithIgnoreCase(searchText.trim())
      .limit(limit)
      .toArray();
  }

  async nameExist(routeName: string): Promise<boolean> {
    const count = await this.dexieDb.customRoutes
      .where('id')
      .equals(routeName)
      .count();
    return count > 0;
  }

  async saveRoute(
    routeName: string,
    points: { point: LngLat; name: string }[],
  ): Promise<void> {
    await this.dexieDb.customRoutes.put({
      id: routeName,
      points,
    });
  }

  deleteRoute(routeName: string): Promise<void> {
    return this.dexieDb.customRoutes.delete(routeName);
  }

  async getCurrentRoute(): Promise<IDbCustomRoute['points']> {
    try {
      return this.dexieDb.customRoutes
        .get('_currentRoute')
        .then((data) => data?.points ?? []);
    } catch {
      return [];
    }
  }

  async saveCurrentRoute(route: IDbCustomRoute['points']): Promise<void> {
    await this.dexieDb.customRoutes.put({
      id: '_currentRoute',
      points: route,
    });
  }
}
