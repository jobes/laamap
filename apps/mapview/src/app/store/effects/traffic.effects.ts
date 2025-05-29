import { Injectable, inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  EMPTY,
  catchError,
  combineLatest,
  filter,
  map,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { TrafficService } from '../../services/traffic/traffic.service';
import { mapFeature } from '../features/map.feature';
import { trafficFeature } from '../features/settings/traffic.feature';

@Injectable()
export class TrafficEffects {
  private readonly store = inject(Store);
  private readonly trafficService = inject(TrafficService);

  // when enabled and GPS available
  // 5 sec - if flying and course changed more than 30deg
  // 30 sec - if flying straight
  // 60 sec - on ground

  traffic$ = createEffect(
    () => {
      return combineLatest([
        this.store.select(trafficFeature.selectEnabled),
        this.store.select(mapFeature.selectGeoLocationTrackingActive),
        this.store.select(mapFeature.selectMinSpeedHit),
      ]).pipe(
        switchMap(([enabled, tracking, minSpeedHit]) => {
          if (!enabled || !tracking) {
            return EMPTY; // traffic not enabled or map mode without navigation (gps tracking disabled)
          }
          if (!minSpeedHit) {
            // on ground send position every minute; first sending when GPS signal is not yet obtained is ignored
            return timer(0, 60000).pipe(map(() => 'grounded' as const));
          }

          let geolocation = this.store.selectSignal(
            mapFeature.selectGeoLocation,
          )();
          return timer(0, 5000).pipe(
            filter(() => {
              const currentGeolocation = this.store.selectSignal(
                mapFeature.selectGeoLocation,
              )();
              if (
                (!geolocation?.coords.heading &&
                  geolocation?.coords.heading !== 0) ||
                (!currentGeolocation?.coords.heading &&
                  currentGeolocation?.coords.heading !== 0)
              ) {
                return false; // no geolocation - this never happens
              }
              if (
                currentGeolocation.timestamp - geolocation.timestamp >
                30000
              ) {
                return true; // every 30s send position while flying straight
              }
              let angleDiff = Math.abs(
                geolocation.coords.heading - currentGeolocation.coords.heading,
              );
              if (angleDiff > 180) {
                angleDiff = 360 - angleDiff;
              }
              //always (not more than every 5s) than course diff is > 30 send position
              return angleDiff > 30;
            }),
            tap(
              // reset timer/angle
              () =>
                (geolocation = this.store.selectSignal(
                  mapFeature.selectGeoLocation,
                )()),
            ),
            map(() => 'flying' as const),
          );
        }),
        switchMap((flightState) =>
          this.trafficService.insert(flightState).pipe(catchError(() => EMPTY)),
        ),
      );
    },
    { dispatch: false },
  );
}
