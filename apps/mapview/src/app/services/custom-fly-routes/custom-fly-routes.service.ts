import { Injectable } from '@angular/core';
import { LngLat } from 'maplibre-gl';
import pouchDb from 'pouchdb';
import pouchFind from 'pouchdb-find';
import { escapeStringRegexp } from '../../helper';
pouchDb.plugin(pouchFind);

export interface ICustomFlyRoute {
  routeName: string;
  points: {
    point: LngLat;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class CustomFlyRoutesService {
  private db = new pouchDb<{ points: ICustomFlyRoute['points'] }>(
    'customFlyRoutes',
    {},
  );

  private currentRouteDb = new pouchDb<{ points: ICustomFlyRoute['points'] }>(
    'currentFlyRoutes',
    {},
  );

  constructor() {}

  async getAllRoutes(): Promise<ICustomFlyRoute[]> {
    return (
      // eslint-disable-next-line @typescript-eslint/naming-convention
      (await this.db.allDocs({ include_docs: true })).rows.map((row) => ({
        routeName: row.doc?._id ?? '',
        points: row.doc?.points ?? [],
      })) ?? []
    );
  }

  async searchRoute(
    searchText: string | null,
    limit = 5,
  ): Promise<ICustomFlyRoute[]> {
    if (!searchText) {
      return [];
    }
    return (
      await this.db.find({
        selector: {
          _id: {
            $regex: RegExp(
              `.*${escapeStringRegexp(searchText)}.*`,
              'i',
            ) as unknown as string,
          },
        },
      })
    ).docs
      .map((item) => ({
        routeName: item._id,
        points: item.points,
      }))
      .sort((a, b) => this.sortByRouteName(searchText, a, b))
      .slice(0, limit);
  }

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
    const revision = await this.getDbRevision(routeName);
    await this.db.put({ _id: routeName, _rev: revision, points });
  }

  async deleteRoute(routeName: string): Promise<void> {
    const revision = await this.getDbRevision(routeName);
    if (revision) await this.db.remove({ _id: routeName, _rev: revision });
  }

  async getCurrentRoute(): Promise<ICustomFlyRoute['points']> {
    try {
      return (await this.currentRouteDb.get('currentRoute')).points;
    } catch {
      return [];
    }
  }

  async saveCurrentRoute(route: ICustomFlyRoute['points']): Promise<void> {
    const revision = await this.getCurrentRouteDbRevision();
    await this.currentRouteDb.put({
      _id: 'currentRoute',
      _rev: revision,
      points: route,
    });
  }

  private async getDbRevision(routeName: string): Promise<string | undefined> {
    try {
      const route = await this.db.get(routeName);
      return route._rev;
    } catch (err) {
      return undefined;
    }
  }

  private async getCurrentRouteDbRevision(): Promise<string | undefined> {
    try {
      const route = await this.currentRouteDb.get('currentRoute');
      return route._rev;
    } catch (err) {
      return undefined;
    }
  }

  private sortByRouteName(
    routeName: string,
    a: ICustomFlyRoute,
    b: ICustomFlyRoute,
  ): number {
    if (
      a.routeName.startsWith(routeName) &&
      !b.routeName.startsWith(routeName)
    ) {
      return -1;
    }
    if (
      !a.routeName.startsWith(routeName) &&
      b.routeName.startsWith(routeName)
    ) {
      return 1;
    }
    return a.routeName.localeCompare(b.routeName);
  }
}
