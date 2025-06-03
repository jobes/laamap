import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AltitudePipe } from '../../pipes/altitude/altitude.pipe';
import { mapFeature } from '../../store/features/map.feature';
import { trafficFeature } from '../../store/features/settings/traffic.feature';
import { MapService } from '../map/map.service';
import { EHeightUnit, EReferenceDatum } from '../open-aip/airport.interfaces';

export interface TrafficEntry {
  timestamp: number;
  lat: number;
  lng: number;
  alt: number;
  speed: number;
  course: number;
  vspeed: number;
  callsign?: string;
  label?: string;
  rego?: string;
  objectType?: string;
  state?: string;
  model?: string;
  color?: string;
  onGround?: string;
  pureTrackKey?: string;
  trackerId?: string;
  pilotName?: string;
  groundLevel?: string;
  username?: string;
  aircraftId?: string;
  displayAltitude: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrafficService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly mapService = inject(MapService);
  private readonly altitudePipe = inject(AltitudePipe);
  private lastFixTime = 0; // never send data for same timestamp
  private accessKey = this.store.selectSignal(trafficFeature.selectAccessKey);

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

  login(form: {
    email: string;
    password: string;
  }): Observable<{ access_token: string; pro: boolean }> {
    return this.http.post<{ access_token: string; pro: boolean }>(
      'https://puretrack.io/api/login',
      {
        ...form,
        key: environment.pureTrackKey,
      },
    );
  }

  logout(accessToken?: string): Observable<unknown> {
    return this.http.post(
      'https://puretrack.io/api/logout',
      {},
      {
        headers: { Authorization: `Bearer ${accessToken ?? this.accessKey()}` },
      },
    );
  }

  liveTraffic(maxAge: number, heighUnit: EHeightUnit) {
    const bounds = this.mapService.instance.getBounds();
    return this.http
      .post<{ data: string[] }>(
        `https://puretrack.io/api/traffic?t=${maxAge}`,
        {
          key: environment.pureTrackKey,
          lat1: bounds.getNorthWest().lat,
          long1: bounds.getNorthWest().lng,
          lat2: bounds.getSouthEast().lat,
          long2: bounds.getSouthEast().lng,
        },
        {
          headers: { Authorization: `Bearer ${this.accessKey()}` },
        },
      )
      .pipe(map((res) => this.parseData(res.data, heighUnit)));
  }

  private parseData(data: string[], heighUnit: EHeightUnit) {
    return data.map((d) => this.parseSubData(d.split(','), heighUnit));
  }

  private parseSubData(data: string[], heighUnit: EHeightUnit): TrafficEntry {
    const altitude = +(data.find((d) => d.startsWith('A'))?.slice(1) ?? 0);
    const displayAltitude = this.altitudePipe.transform(
      {
        value: altitude,
        unit: EHeightUnit.meter,
        referenceDatum: EReferenceDatum.msl,
      },
      heighUnit,
    );
    return {
      timestamp: +(data.find((d) => d.startsWith('T'))?.slice(1) ?? 0),
      lat: +(data.find((d) => d.startsWith('L'))?.slice(1) ?? 0),
      lng: +(data.find((d) => d.startsWith('G'))?.slice(1) ?? 0),
      alt: altitude,
      displayAltitude,
      rego: data.find((d) => d.startsWith('E'))?.slice(1),
      course: +(data.find((d) => d.startsWith('C'))?.slice(1) ?? 0),
      speed: +(data.find((d) => d.startsWith('S'))?.slice(1) ?? 0),
      vspeed: +(data.find((d) => d.startsWith('V'))?.slice(1) ?? 0),
      label: data.find((d) => d.startsWith('B'))?.slice(1),
      callsign: data.find((d) => d.startsWith('m'))?.slice(1),
      pureTrackKey: data.find((d) => d.startsWith('K'))?.slice(1),
      objectType: data.find((d) => d.startsWith('O'))?.slice(1) ?? '0',
      trackerId: data.find((d) => d.startsWith('D'))?.slice(1),
      pilotName: data.find((d) => d.startsWith('N'))?.slice(1),
      model: data.find((d) => d.startsWith('M'))?.slice(1),
      groundLevel: data.find((d) => d.startsWith('g'))?.slice(1),
      color: data.find((d) => d.startsWith('c'))?.slice(1),
      aircraftId: data.find((d) => d.startsWith('a'))?.slice(1),
      username: data.find((d) => d.startsWith('u'))?.slice(1),
      state: data.find((d) => d.startsWith('6'))?.slice(1),
      onGround: data.find((d) => d.startsWith('8'))?.slice(1),
    };
  }
}
