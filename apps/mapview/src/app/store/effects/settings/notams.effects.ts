import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { createEffect } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import {
  EMPTY,
  catchError,
  combineLatest,
  filter,
  map,
  merge,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { OnMapNotamsService } from '../../../services/map/on-map-notams/on-map-notams.service';
import { NotamsService } from '../../../services/notams/notams.service';
import { mapFeature } from '../../features/map.feature';
import { navigationFeature } from '../../features/navigation.feature';
import { generalFeature } from '../../features/settings/general.feature';
import { notamsFeature } from '../../features/settings/notams.feature';

@Injectable()
export class NotamsSettingsEffects {
  private readonly store = inject(Store);
  private readonly onMapNotamsService = inject(OnMapNotamsService);
  private readonly notams = inject(NotamsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

  loadFirNotams$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNotamsService.createLayers()),
        switchMap(() =>
          merge(this.notamFir$, this.notamPoint$, this.notamRoute$),
        ),
        map(() => this.notams.notamsToGeoJson(this.notams.getCachedNotams())),
        switchMap((notams) =>
          this.store.select(notamsFeature.selectNonHiddenNotams(notams)),
        ),
        tap((geojson) => this.onMapNotamsService.setNotamsGeoJson(geojson)),
      );
    },
    { dispatch: false },
  );

  private networkError = catchError(() => {
    this.snackBar.open(
      this.translocoService.translate('notams.failedToLoad'),
      undefined,
      {
        duration: 5000,
        politeness: 'assertive',
      },
    );
    return EMPTY;
  });

  private notamFir$ = this.store.select(generalFeature.selectNotamFirs).pipe(
    // don't load empty FIR notams, but clear them when turned off
    filter((val, index) => val.length !== 0 || index !== 0),
    switchMap((firs) =>
      this.notams.loadFirNotams$(firs).pipe(this.networkError),
    ),
  );

  private notamPoint$ = this.store.select(mapFeature.selectGeoLocation).pipe(
    concatLatestFrom(() => [
      this.store.select(navigationFeature.selectRunning),
      this.store.select(generalFeature.selectNotamRadius),
    ]),
    filter(
      (
        storeData,
      ): storeData is [NonNullable<(typeof storeData)[0]>, boolean, number] =>
        !!storeData[0],
    ),
    take(1),
    filter(([, running]) => !running),
    switchMap(([event, , radius]) =>
      this.notams
        .loadAroundPointNotams$(
          new LngLat(event.coords.longitude, event.coords.latitude),
          radius,
        )
        .pipe(this.networkError),
    ),
  );

  private notamRoute$ = combineLatest([
    this.store.select(navigationFeature.selectRoute),
    this.store.select(navigationFeature.selectRunning),
  ]).pipe(
    filter(([route, running]) => running && route.length > 0),
    switchMap(
      (
        [route], // run only on change of navigationFeature
      ) =>
        this.store.select(mapFeature.selectGeoLocation).pipe(
          filter((position) => !!position),
          take(1),
          map((position) => [
            new LngLat(
              position?.coords.longitude ?? 0,
              position?.coords.latitude ?? 0,
            ),
            ...route.map(
              (point) => new LngLat(point.point.lng, point.point.lat),
            ),
          ]),
        ),
    ),
    concatLatestFrom(() => [
      this.store.select(generalFeature.selectNotamRadius),
    ]),
    switchMap(([points, radius]) =>
      this.notams.loadAroundRoute$(points, radius).pipe(this.networkError),
    ),
  );
}
