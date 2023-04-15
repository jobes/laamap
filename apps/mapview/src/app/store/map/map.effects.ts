import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import maplibreGl from 'maplibre-gl';
import {
  combineLatest,
  delay,
  filter,
  iif,
  map,
  of,
  sampleTime,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { MapLocationMenuComponent } from '../../components/map-location-menu/map-location-menu.component';
import { MapService } from '../../services/map/map.service';
import { OnMapDirectionLineService } from '../../services/map/on-map-direction-line/on-map-direction-line.service';
import { TracingService } from '../../services/tracing/tracing.service';
import {
  selectLineDefinitionBorderGeoJson,
  selectLineDefinitionSegmentGeoJson,
  selectOnMapTrackingState,
  selectTrackInProgressWithMinSpeed,
} from '../advanced-selectors';
import { generalFeature } from '../settings/general/general.feature';
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
    return this.actions$.pipe(
      ofType(mapActions.geolocationChanged),
      switchMap(({ geoLocation }) =>
        iif(() => !geoLocation, of(false), of(true).pipe(delay(5000)))
      ),
      filter((timedOut) => timedOut),
      map(() => mapActions.gpsTimedOut())
    );
  });

  gpsRouteSavingStarted$ = createEffect(() => {
    return this.store.select(selectTrackInProgressWithMinSpeed).pipe(
      filter(
        ({ hitMinSpeed, trackSavingInProgress }) =>
          hitMinSpeed && !trackSavingInProgress
      ),
      map(() => mapActions.trackSavingStarted())
    );
  });

  gpsRouteSavingEnded$ = createEffect(() => {
    return this.store.select(selectTrackInProgressWithMinSpeed).pipe(
      filter(
        ({ hitMinSpeed, trackSavingInProgress }) =>
          trackSavingInProgress && !hitMinSpeed
      ),
      map(() => mapActions.trackSavingEnded())
    );
  });

  moveMapOnGpsTracking$ = createEffect(
    () => {
      return this.store.select(selectOnMapTrackingState).pipe(
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

  startTraceSavingToDb$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.trackSavingStarted),
        switchMap(() => this.store.select(generalFeature.selectAirplaneName)),
        tap((airPlaneName) =>
          this.tracing.createFlyTrace(airPlaneName, new Date().toISOString())
        )
      );
    },
    { dispatch: false }
  );

  traceGeolocationToDb$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.geolocationChanged),
        map((action) => action.geoLocation),
        filter(
          (geoLocation): geoLocation is NonNullable<typeof geoLocation> =>
            !!geoLocation
        ),
        tap((geoLocation) =>
          this.tracing.addTraceItem(
            geoLocation?.timestamp ?? 0,
            geoLocation?.coords
          )
        )
      );
    },
    { dispatch: false }
  );

  setDirectionLine$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapDirectionLine.createLayers()),
        switchMap(() => this.store.select(selectLineDefinitionSegmentGeoJson)),
        concatLatestFrom(() =>
          this.store.select(selectLineDefinitionBorderGeoJson)
        ),
        tap(([segmentGeoJson, borderGeoJson]) =>
          this.onMapDirectionLine.setSource(segmentGeoJson, borderGeoJson)
        )
      );
    },
    { dispatch: false }
  );

  mapClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.clicked),
        switchMap((click) =>
          combineLatest({
            /* eslint-disable rxjs/finnish */
            lngLat: of(click.lngLat),
            airport: this.actions$.pipe(
              ofType(mapActions.airportLayerClicked),
              startWith(null)
            ),
            airspace: this.actions$.pipe(
              ofType(mapActions.airspaceLayerClicked),
              startWith(null)
            ),
            notams: this.actions$.pipe(
              ofType(mapActions.notamLayerClicked),
              startWith(null)
            ),
            doubleClick: this.actions$.pipe(
              ofType(mapActions.doubleClicked),
              startWith(null)
            ),
            /* eslint-enable rxjs/finnish */
          }).pipe(sampleTime(500))
        ),
        filter(({ doubleClick }) => doubleClick === null),
        tap((data) => this.bottomSheet.open(MapLocationMenuComponent, { data }))
      );
    },
    { dispatch: false }
  );

  private startGpsTracking = false;

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly mapService: MapService,
    private readonly tracing: TracingService,
    private readonly onMapDirectionLine: OnMapDirectionLineService,
    private readonly bottomSheet: MatBottomSheet
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
