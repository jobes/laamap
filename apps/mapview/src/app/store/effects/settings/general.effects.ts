import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { pressureOnSeaLevel } from '../../../helper';
import { MapService } from '../../../services/map/map.service';
import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalEffectsActions } from '../../actions/effects.actions';
import { mapActions } from '../../actions/map.actions';
import {
  altimeterQuickSettingsActions,
  generalSettingsActions,
} from '../../actions/settings.actions';
import { mapFeature } from '../../features/map.feature';
import { planeInstrumentsFeature } from '../../features/plane-instruments.feature';
import { generalFeature } from '../../features/settings/general.feature';
import { instrumentsFeature } from '../../features/settings/instruments.feature';
import { terrainFeature } from '../../features/settings/terrain.feature';

@Injectable()
export class GeneralEffects {
  private readonly mapService = inject(MapService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly screenWakeLockService = inject(ScreenWakeLockService);

  private readonly visibilitySubj$ = fromEvent<DocumentVisibilityState>(
    document,
    'visibilitychange',
  ).pipe(
    map(() => document.visibilityState),
    startWith(document.visibilityState),
  );

  private readonly wakeLockEnabled$ = this.store
    .select(generalFeature.selectScreenWakeLockEnabled)
    .pipe(distinctUntilChanged());

  screenWakeLock$ = createEffect(
    () => {
      return combineLatest([this.wakeLockEnabled$, this.visibilitySubj$]).pipe(
        debounceTime(1000),
        tap(([enabled, visibility]) => {
          if (enabled && visibility === 'visible') {
            this.screenWakeLockService.lock();
          } else {
            this.screenWakeLockService.release();
          }
        }),
      );
    },
    { dispatch: false },
  );

  widgetFontSizeRation$ = createEffect(
    () => {
      return this.store.select(generalFeature.selectWidgetFontSizeRatio).pipe(
        tap((ratio) => {
          document.documentElement.style.setProperty(
            '--widget-font-size-ratio',
            `${ratio}`,
          );
        }),
      );
    },
    { dispatch: false },
  );

  mapFontSizeRation$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio),
        ),
        tap((ratio) => {
          this.mapService.setMapFontSizeRatio(ratio);
        }),
      );
    },
    { dispatch: false },
  );

  logOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(generalSettingsActions.logOut),
        tap(() => {
          window.google.accounts.id.disableAutoSelect();
          window.google.accounts.id.revoke('jobes666@gmail.com'); // of refresh google would do auto login
        }),
      );
    },
    { dispatch: false },
  );

  calculateGndAltitude$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(altimeterQuickSettingsActions.automaticGNDAltitudeRequested),
      withLatestFrom(
        this.store.select(mapFeature.selectGeoLocation),
        this.store.select(instrumentsFeature.selectAltimeter),
      ),
      map(([, geolocation, altimeter]) =>
        generalEffectsActions.automaticGNDAltitudeSet({
          gndAltitude:
            (geolocation?.coords.altitude ?? 0) - altimeter?.gpsAltitudeError,
        }),
      ),
    );
  });

  automaticGpsAltitudeErrorRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(altimeterQuickSettingsActions.automaticGpsAltitudeErrorRequested),
      withLatestFrom(
        this.store.select(mapFeature.selectGeoLocation),
        this.store.select(mapFeature.selectTerrainElevation),
      ),
      map(([, geolocation, terrainElevation]) =>
        generalEffectsActions.automaticGpsAltitudeErrorSet({
          gpsAltitudeError: Math.round(
            (geolocation?.coords.altitude ?? 0) - (terrainElevation ?? 0),
          ),
        }),
      ),
    );
  });

  automaticQnhRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(altimeterQuickSettingsActions.automaticQnhRequested),
      withLatestFrom(
        this.store.select(mapFeature.selectGeoLocation),
        this.store.select(mapFeature.selectTerrainElevation),
        this.store.select(planeInstrumentsFeature.selectAirPressure),
        this.store.select(
          terrainFeature.selectGndHeightCalculateUsingTerrainEnabled,
        ),
      ),
      map(([, geolocation, terrainElevation, pressure, terrainGndEnabled]) =>
        generalEffectsActions.automaticQnhSet({
          qnh: pressureOnSeaLevel(
            pressure ?? 0,
            (terrainGndEnabled
              ? terrainElevation
              : geolocation?.coords.altitude) ?? 0,
          ),
        }),
      ),
    );
  });

  automaticQfeRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(altimeterQuickSettingsActions.automaticQfeRequested),
      withLatestFrom(
        this.store.select(planeInstrumentsFeature.selectAirPressure),
      ),
      map(([, pressure]) =>
        generalEffectsActions.automaticQfeSet({
          qfe: Math.round((pressure ?? 0) / 100),
        }),
      ),
    );
  });
}
