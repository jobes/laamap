import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { IRainViewerUrls } from './rain-viewer.interface';

@Injectable({
  providedIn: 'root',
})
export class RainViewerService {
  readonly tileSize = 256;
  constructor(private http: HttpClient, private store: Store) {}

  getUrls$(): Observable<IRainViewerUrls> {
    return this.http
      .get<IRainViewerUrls>(
        'https://api.rainviewer.com/public/weather-maps.json'
      )
      .pipe(
        map((defs) => ({
          ...defs,
          coverage: `/v2/coverage/0/${this.tileSize}/{z}/{x}/{y}/0/0_0.png`,
        }))
      );
  }
}
