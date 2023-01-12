import { Injectable } from '@angular/core';
import { Position } from '@maplibre/ngx-maplibre-gl';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataBusService {
  rawGeolocation = new BehaviorSubject<Position | null>(null);
  geolocation = this.rawGeolocation.asObservable();
}
