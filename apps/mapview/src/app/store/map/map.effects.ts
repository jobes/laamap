import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import maplibreGl from 'maplibre-gl';
import {
  combineLatest,
  delay,
  filter,
  iif,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { MapService } from '../../services/map/map.service';
import { selectOnMapTrackingSelector } from '../advanced-selectors';
import { mapActions } from './map.actions';
import { mapFeature } from './map.feature';

@Injectable()
export class MapEffects {
  mapRotated$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.rotated),
        tap(({ bearing }) =>
          document.documentElement.style.setProperty('--bearing', `${bearing}`)
        )
      );
    },
    { dispatch: false }
  );

  headingChanged$ = createEffect(
    () => {
      return this.store
        .select(mapFeature.selectHeading)
        .pipe(
          tap((heading) =>
            document.documentElement.style.setProperty(
              '--heading',
              `${heading ?? 0}`
            )
          )
        );
    },
    { dispatch: false }
  );

  gpsTrackingStarted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(mapActions.geolocationTrackingStaring),
      tap(() => (this.startGpsTracking = true)),
      map(() => mapActions.geolocationTrackingRunning())
    );
  });

  gpsTimeOut$ = createEffect(() => {
    return this.store.select(mapFeature.selectGeoLocation).pipe(
      switchMap((geoLocation) =>
        iif(() => !geoLocation, of(false), of(true).pipe(delay(5000)))
      ),
      filter((timedOut) => timedOut),
      map(() => mapActions.gpsTimedOut())
    );
  });

  gpsRouteSavingStarted$ = createEffect(() => {
    return combineLatest([
      this.store.select(mapFeature.selectMinSpeedHit),
      this.store.select(mapFeature.selectTrackSaving),
    ]).pipe(
      filter(
        ([hitMinSpeed, trackSavingInProgress]) =>
          hitMinSpeed && !trackSavingInProgress
      ),
      map(() => mapActions.trackSavingStarted())
    );
  });

  gpsRouteSavingEnded$ = createEffect(() => {
    return combineLatest([
      this.store.select(mapFeature.selectMinSpeedHit),
      this.store.select(mapFeature.selectTrackSaving),
    ]).pipe(
      filter(
        ([hitMinSpeed, trackSavingInProgress]) =>
          trackSavingInProgress && !hitMinSpeed
      ),
      map(() => mapActions.trackSavingEnded())
    );
  });

  moveMapOnGpsTracking$ = createEffect(
    () => {
      return this.store.select(selectOnMapTrackingSelector).pipe(
        filter(
          (
            params
          ): params is Omit<typeof params, 'geoLocation'> & {
            geoLocation: NonNullable<(typeof params)['geoLocation']>;
          } => this.trackingActive(params)
        ),
        tap(({ geoLocation, heading, zoom, pitch }) => {
          const center = new maplibreGl.LngLat(
            geoLocation.coords.longitude,
            geoLocation.coords.latitude
          );

          this.mapService.instance.flyTo(
            {
              ...{ center, bearing: heading ?? 0 },
              ...(this.startGpsTracking ? { zoom, pitch } : {}),
            },
            {
              geolocateSource: true,
            }
          );
          setTimeout(() => {
            this.startGpsTracking = false; // wait until initial animation ends
          }, 5000);
        })
      );
    },
    { dispatch: false }
  );

  private startGpsTracking = false;

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly mapService: MapService
  ) {}

  private trackingActive(params: {
    geoLocation: GeolocationPosition | null;
  }): boolean {
    const state = (
      this.mapService.instance._controls.find(
        (control) => control instanceof maplibreGl.GeolocateControl
      ) as maplibregl.GeolocateControl
    )?._watchState;
    return state === 'ACTIVE_LOCK' && !!params.geoLocation;
  }
}
