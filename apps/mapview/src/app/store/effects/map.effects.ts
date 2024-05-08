import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import maplibreGl from 'maplibre-gl';
import {
  combineLatest,
  filter,
  map,
  of,
  pairwise,
  sampleTime,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { NavigationDialogComponent } from '../../components/dialogs/navigation-dialog/navigation-dialog.component';
import { SettingsDialogComponent } from '../../components/dialogs/settings-dialog/settings-dialog.component';
import { MapLocationMenuComponent } from '../../components/map-location-menu/map-location-menu.component';
import { MapService } from '../../services/map/map.service';
import { OnMapDirectionLineService } from '../../services/map/on-map-direction-line/on-map-direction-line.service';
import { TracingService } from '../../services/tracing/tracing.service';
import { mapEffectsActions } from '../actions/effects.actions';
import {
  layerAirSpacesActions,
  layerAirportActions,
  layerInterestPointsActions,
  layerNotamsActions,
  mapActions,
} from '../actions/map.actions';
import {
  selectLineDefinitionBorderGeoJson,
  selectLineDefinitionSegmentGeoJson,
  selectOnMapTrackingState,
  selectTrackInProgressWithMinSpeed,
} from '../advanced-selectors';
import { mapFeature } from '../features/map.feature';
import { generalFeature } from '../features/settings/general.feature';

@Injectable()
export class MapEffects {
  mapRotated$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.rotated),
        tap(({ bearing }) =>
          document.documentElement.style.setProperty('--bearing', `${bearing}`),
        ),
      );
    },
    { dispatch: false },
  );

  headingChanged$ = createEffect(
    () => {
      return this.store
        .select(mapFeature.selectHeading)
        .pipe(
          tap((heading) =>
            document.documentElement.style.setProperty(
              '--heading',
              `${heading ?? 0}`,
            ),
          ),
        );
    },
    { dispatch: false },
  );

  gpsTrackingStarted$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.geolocationTrackingStarted),
        tap(() => (this.startGpsTracking = true)),
      );
    },
    { dispatch: false },
  );

  gpsRouteSavingStarted$ = createEffect(() => {
    return this.store.select(selectTrackInProgressWithMinSpeed).pipe(
      filter(
        ({ hitMinSpeed, trackSavingInProgress }) =>
          hitMinSpeed && !trackSavingInProgress,
      ),
      map(() => mapEffectsActions.trackSavingStarted()),
    );
  });

  gpsRouteSavingEnded$ = createEffect(() => {
    return this.store.select(selectTrackInProgressWithMinSpeed).pipe(
      filter(
        ({ hitMinSpeed, trackSavingInProgress }) =>
          trackSavingInProgress && !hitMinSpeed,
      ),
      map(() => mapEffectsActions.trackSavingEnded()),
    );
  });

  moveMapOnGpsTracking$ = createEffect(
    () => {
      return this.store.select(selectOnMapTrackingState).pipe(
        filter(
          (
            params,
          ): params is Omit<typeof params, 'geoLocation'> & {
            geoLocation: NonNullable<(typeof params)['geoLocation']>;
          } => this.trackingActive(params),
        ),
        startWith({ geoLocation: null, heading: 0, zoom: 0, pitch: 0 }),
        pairwise(),
        tap(([previous, { geoLocation, heading, zoom, pitch }]) => {
          const center = new maplibreGl.LngLat(
            geoLocation?.coords.longitude ?? 0,
            geoLocation?.coords.latitude ?? 0,
          );

          if (this.startGpsTracking) {
            this.mapService.instance.flyTo(
              {
                center,
                bearing: heading ?? 0,
                zoom,
                pitch,
              },
              {
                geolocateSource: true,
              },
            );
          } else {
            const duration =
              (geoLocation?.timestamp ?? 0) -
              (previous.geoLocation?.timestamp ?? 0);
            this.mapService.instance.easeTo(
              {
                center,
                bearing: heading ?? 0,
                duration: duration < 0 ? 0 : duration,
                easing: (n) => n,
              },
              {
                geolocateSource: true,
              },
            );
          }

          setTimeout(() => {
            this.startGpsTracking = false; // wait until initial animation ends
            this.store.dispatch(
              mapEffectsActions.geolocationTrackingRunning({
                following: this.trackingActive({ geoLocation }),
              }),
            );
          }, 1200);
        }),
      );
    },
    { dispatch: false },
  );

  startTraceSavingToDb$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapEffectsActions.trackSavingStarted),
        switchMap(() => this.store.select(generalFeature.selectAirplaneName)),
        tap((airPlaneName) =>
          this.tracing.createFlyTrace(airPlaneName, new Date().toISOString()),
        ),
      );
    },
    { dispatch: false },
  );

  endTraceSavingToDb$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapEffectsActions.trackSavingEnded),
        tap(() => this.tracing.endFlyTrace()),
      );
    },
    { dispatch: false },
  );

  traceGeolocationToDb$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.geolocationChanged),
        map((action) => action.geoLocation),
        filter(
          (geoLocation): geoLocation is NonNullable<typeof geoLocation> =>
            !!geoLocation,
        ),
        tap((geoLocation) =>
          this.tracing.addTraceItem(
            geoLocation?.timestamp ?? 0,
            geoLocation?.coords,
          ),
        ),
      );
    },
    { dispatch: false },
  );

  setDirectionLine$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapDirectionLine.createLayers()),
        switchMap(() => this.store.select(selectLineDefinitionSegmentGeoJson)),
        concatLatestFrom(() =>
          this.store.select(selectLineDefinitionBorderGeoJson),
        ),
        tap(([segmentGeoJson, borderGeoJson]) =>
          this.onMapDirectionLine.setSource(segmentGeoJson, borderGeoJson),
        ),
      );
    },
    { dispatch: false },
  );

  mapClicked$ = createEffect(
    // eslint-disable-next-line max-lines-per-function
    () => {
      return this.actions$.pipe(
        ofType(mapActions.clicked),
        switchMap((click) =>
          combineLatest({
            // eslint-disable-next-line rxjs/finnish
            lngLat: of(click.lngLat),
            ...this.layerClicks,
          }).pipe(sampleTime(500)),
        ),
        filter(({ doubleClick }) => doubleClick === null),
        tap((data) =>
          this.bottomSheet.open(MapLocationMenuComponent, { data }),
        ),
      );
    },
    { dispatch: false },
  );

  settingsClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.settingsClicked),
        tap(() => {
          this.dialog.open(SettingsDialogComponent, {
            width: '100%',
            id: 'settingDialog',
          });
        }),
      );
    },
    { dispatch: false },
  );

  navigationClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.navigationClicked),
        tap(() => {
          this.dialog.open(NavigationDialogComponent, {
            width: '100%',
            id: 'settingDialog',
          });
        }),
      );
    },
    { dispatch: false },
  );

  mapMoved$ = createEffect(
    () => {
      return this.store
        .select(mapFeature.selectGeoLocationFollowing)
        .pipe(
          tap((active) =>
            document.documentElement.style.setProperty(
              '--location-animation-duration',
              active ? '1s' : '0s',
            ),
          ),
        );
    },
    { dispatch: false },
  );

  private startGpsTracking = false;

  /* eslint-disable rxjs/finnish */
  private layerClicks = {
    airport: this.actions$.pipe(
      ofType(layerAirportActions.clicked),
      startWith(null),
    ),
    airspace: this.actions$.pipe(
      ofType(layerAirSpacesActions.clicked),
      startWith(null),
    ),
    notams: this.actions$.pipe(
      ofType(layerNotamsActions.clicked),
      startWith(null),
    ),
    doubleClick: this.actions$.pipe(ofType(mapActions.zoom), startWith(null)),
    interestPoint: this.actions$.pipe(
      ofType(layerInterestPointsActions.clicked),
      startWith(null),
    ),
  };
  /* eslint-enable rxjs/finnish */

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly mapService: MapService,
    private readonly tracing: TracingService,
    private readonly onMapDirectionLine: OnMapDirectionLineService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
  ) {}

  private trackingActive(params: {
    geoLocation: GeolocationPosition | null;
  }): boolean {
    const state = (
      this.mapService.instance._controls.find(
        (control) => control instanceof maplibreGl.GeolocateControl,
      ) as maplibregl.GeolocateControl
    )?._watchState;
    return state === 'ACTIVE_LOCK' && !!params.geoLocation;
  }
}
