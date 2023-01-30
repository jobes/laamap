import { Injectable } from '@angular/core';
import { Position } from '@maplibre/ngx-maplibre-gl';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataBusService {
  geolocation$: Observable<Position | null>;
  private geolocationSubj$ = new BehaviorSubject(null as Position | null);

  constructor() {
    this.geolocation$ = this.geolocationSubj$.asObservable();
  }
  setGeoLocation(value: Position | null): void {
    this.geolocationSubj$.next(value);
  }
}
