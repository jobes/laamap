import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  EMPTY,
  catchError,
  combineLatest,
  delay,
  filter,
  map,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';

import { MapService } from '../../services/map/map.service';
import { OnMapAirportsService } from '../../services/map/on-map-airports/on-map-airports.service';
import { OnMapTrafficService } from '../../services/map/on-map-traffic/on-map-traffic';
import { TrafficService } from '../../services/traffic/traffic.service';
import { trafficEffectsActions } from '../actions/effects.actions';
import { mapActions } from '../actions/map.actions';
import { mapFeature } from '../features/map.feature';
import { generalFeature } from '../features/settings/general.feature';
import { trafficFeature } from '../features/settings/traffic.feature';

@Injectable()
export class TrafficEffects {
  private readonly store = inject(Store);
  private readonly trafficService = inject(TrafficService);
  private readonly actions$ = inject(Actions);
  private readonly onMapTrafficService = inject(OnMapTrafficService);
  private readonly mapService = inject(MapService);
  private readonly onMapAirportsService = inject(OnMapAirportsService);

  private readonly refreshRateGrounded = 30000;
  private readonly refreshRateFlyingTurn = 5000;
  private readonly refreshRateFlyingStraight = 15000;

  createLayer$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        tap(() => this.onMapTrafficService.createLayers()),
        switchMap(() => this.onMapTrafficService.addRequiredImages$()),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio),
        ),
        tap((ratio) =>
          this.mapService.instance.setLayoutProperty(
            'trafficLayer',
            'text-size',
            ratio * this.onMapAirportsService.fontSize,
          ),
        ),
      );
    },
    { dispatch: false },
  );

  trafficInsert$ = createEffect(
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
            return timer(0, this.refreshRateGrounded).pipe(
              map(() => 'grounded' as const),
            );
          }

          let geolocation = this.store.selectSignal(
            mapFeature.selectGeoLocation,
          )();
          return timer(0, this.refreshRateFlyingTurn).pipe(
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
                this.refreshRateFlyingStraight
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

  trafficGet$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        delay(5000), // for performance delay traffic showing
        switchMap(() =>
          combineLatest([
            this.store.select(trafficFeature.selectEnabled),
            this.store.select(trafficFeature.selectAccessKey),
            this.store.select(trafficFeature.selectActualizationPeriod),
          ]),
        ),
        switchMap(([enabled, accessKey, period]) => {
          if (!enabled || !accessKey) {
            return EMPTY;
          }
          return timer(0, period * 1000);
        }),
        withLatestFrom(
          this.store.select(trafficFeature.selectMaxAge),
          this.store.select(trafficFeature.selectMaxHeightAboveMe),
          this.store.select(mapFeature.selectGeoLocation),
          this.store.select(trafficFeature.selectAltitudeDisplayUnit),
          this.store.select(trafficFeature.selectActualizationPeriod),
          this.store.select(trafficFeature.selectDeviceId),
        ),
        switchMap(
          ([
            ,
            maxAge,
            maxHeightAboveMe,
            geolocation,
            heighUnit,
            actualizationPeriod,
            deviceId,
          ]) =>
            this.trafficService.liveTraffic(maxAge, heighUnit).pipe(
              map((data) =>
                data.filter(
                  (d) =>
                    d.alt - (geolocation?.coords?.altitude ?? 0) <
                      maxHeightAboveMe && d.trackerId !== deviceId,
                ),
              ),
              tap((data) =>
                this.onMapTrafficService.setData(
                  JSON.parse(JSON.stringify(data)),
                  actualizationPeriod,
                ),
              ),
              catchError((error) => {
                if (error.status === 401) {
                  this.store.dispatch(trafficEffectsActions.unauthorized());
                }
                return EMPTY;
              }),
            ),
        ),
      );
    },
    { dispatch: false },
  );
}
