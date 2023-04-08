import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb';

@Injectable({
  providedIn: 'root',
})
export class TracingService {
  private traceDb?: PouchDB.Database;

  createFlyTrace(airplaneId: string, name: string): void {
    const dbName = `${airplaneId}/flyTrace/${name}`;
    const allFlyTraces = new PouchDb(`${airplaneId}/flyTraces`);
    void allFlyTraces.put({ _id: name, dbName });
    this.traceDb = new PouchDb(dbName);
  }

  addTraceItem(timestamp: number, item: object): void {
    const isoTime = new Date(timestamp).toISOString();
    void this.traceDb?.put({ _id: isoTime, ...item });
  }
}
