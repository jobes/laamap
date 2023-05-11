import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import PouchDb from 'pouchdb';

interface IIndexDb {
  _id: string;
  dbName: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TracingService {
  private traceDb?: PouchDB.Database;
  private timeTimeToSliceCount = {
    today: 10,
    month: 7,
    year: 4,
    all: 0,
  };

  createFlyTrace(airplaneId: string, name: string): void {
    const dbName = this.itemDbName(airplaneId, name);
    const allFlyTraces = new PouchDb(this.indexDbName(airplaneId));
    const id = new Date().toISOString();
    void allFlyTraces.put({
      _id: id,
      dbName,
      name,
    } as IIndexDb);
    this.traceDb = new PouchDb(dbName);
  }

  addTraceItem(timestamp: number, item: object): void {
    const isoTime = new Date(timestamp).toISOString();
    void this.traceDb?.put({ _id: isoTime, ...item });
  }

  async createGeoJson(
    dbName: string
  ): Promise<
    turf.FeatureCollection<
      turf.Point,
      { altitude: number | null; speed: number | null }
    >
  > {
    const db = new PouchDb(dbName);
    const indexDbRows = await db.allDocs<GeolocationCoordinates>({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      include_docs: true,
    });
    const geoCoordinations = indexDbRows.rows
      .map((row) => row.doc)
      .filter((doc): doc is NonNullable<typeof doc> => !!doc);

    return turf.featureCollection(
      geoCoordinations.map((geoCoords) =>
        turf.point([geoCoords.longitude, geoCoords.latitude], {
          altitude: geoCoords.altitude,
          speed: geoCoords.speed,
        })
      )
    );
  }

  async getFlyHistoryListWithTime(
    airplaneId: string,
    offset = 0,
    limit = 10
  ): Promise<{
    list: (IIndexDb & { duration: number })[];
    totalItems: number;
  }> {
    const flyHistoryList = await this.getFlyHistoryList(
      airplaneId,
      offset,
      limit
    );
    return {
      totalItems: flyHistoryList.totalItems,
      list: await Promise.all(
        flyHistoryList.list.map(async (doc) => ({
          duration: await this.getSecondsForDbs([doc]),
          ...doc,
        }))
      ),
    };
  }

  async getFlyHistoryList(
    airplaneId: string,
    offset = 0,
    limit = 10
  ): Promise<{ list: IIndexDb[]; totalItems: number }> {
    const allFlyTraces = new PouchDb(this.indexDbName(airplaneId));
    const documents = await allFlyTraces.allDocs<IIndexDb>({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      include_docs: true,
      descending: true,
      limit,
      skip: offset,
    });

    return {
      list: documents.rows
        .map((row) => row.doc)
        .filter((doc): doc is NonNullable<typeof doc> => !!doc),
      totalItems: documents.total_rows,
    };
  }

  async getFlyTime(
    airplaneId: string,
    type: 'today' | 'month' | 'year' | 'all'
  ): Promise<number> {
    const sliceCount = this.timeTimeToSliceCount[type];
    const allFlyTraces = new PouchDb(this.indexDbName(airplaneId));
    const indexDbRows = await allFlyTraces.allDocs<IIndexDb>({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      include_docs: true,
      startkey: new Date().toISOString().slice(0, sliceCount),
      endkey: `${new Date().toISOString().slice(0, sliceCount)}\ufff0`,
    });

    return await this.getSecondsForDbs(indexDbRows.rows.map((row) => row.doc));
  }

  private async getSecondsForDbs(
    docs: (IIndexDb | undefined)[]
  ): Promise<number> {
    return docs
      .map((doc) => doc?.dbName)
      .map((dbName) => new PouchDb(dbName))
      .map(async (db) => {
        const x = await Promise.all([
          db.allDocs({ limit: 1, descending: false }),
          db.allDocs({ limit: 1, descending: true }),
        ]);
        if (x[0].rows.length === 0 || x[1].rows.length === 0) {
          return 0;
        }
        return Math.round(
          (new Date(x[1].rows[0].id).getTime() -
            new Date(x[0].rows[0].id).getTime()) /
            1000
        );
      })
      .reduce(
        async (acc, seconds) => (await seconds) + (await acc),
        Promise.resolve(0)
      );
  }

  private indexDbName(airplaneId: string): string {
    return `${airplaneId}/flyTraces`;
  }

  private itemDbName(airplaneId: string, name: string): string {
    return `${airplaneId}/flyTrace/${name}`;
  }
}
