import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mapFeature } from '../../store/features/map.feature';
import { trafficFeature } from '../../store/features/settings/traffic.feature';

@Injectable({
  providedIn: 'root',
})
export class TrafficService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private lastFixTime = 0; // never send data for same timestamp

  insert(flightState: 'grounded' | 'flying'): Observable<unknown> {
    const state = this.store.selectSignal(
      trafficFeature['selectSettings.trafficState'],
    )();
    const insertData = this.insertData(flightState);
    if (
      !state.enabled ||
      !environment.pureTrackKey ||
      !state.regoOrLabel ||
      (!state.aircraftType && state.aircraftType !== 0) ||
      !insertData
    ) {
      return of(false);
    }
    return this.http.post('https://puretrack.io/api/insert', insertData);
  }

  private insertData(flightState: 'grounded' | 'flying') {
    const state = this.store.selectSignal(
      trafficFeature['selectSettings.trafficState'],
    )();
    const geolocation = this.store.selectSignal(mapFeature.selectGeoLocation)();

    if (!geolocation || this.lastFixTime === geolocation.timestamp) {
      return null;
    }
    this.lastFixTime = geolocation.timestamp;
    return {
      ...(state.isRego
        ? { rego: state.regoOrLabel }
        : { label: state.regoOrLabel }),
      key: environment.pureTrackKey,
      type: state.aircraftType,
      deviceID: state.deviceId,
      points: [
        {
          ts: Math.round(geolocation.timestamp / 1000),
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
          alt: geolocation.coords.altitude, // meters
          speed: flightState === 'grounded' ? 0 : geolocation.coords.speed, // meters per sec
          course: geolocation.coords.heading, // 0 to 360
          // vspeed meters per second
        },
      ],
    };
  }
}
