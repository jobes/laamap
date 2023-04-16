import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';

import { OnMapNavigationService } from '../../services/map/on-map-navigation/on-map-navigation.service';
import { mapActions } from '../map/map.actions';
import { mapFeature } from '../map/map.feature';
import { navigationActions } from './navigation.actions';
import { navigationFeature } from './navigation.feature';

@Injectable()
export class NavigationEffects {
  init$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNavigation.createLayers())
      );
    },
    { dispatch: false }
  );

  validateNavigationStarted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(navigationActions.startedNewRouteNavigation),
      switchMap(() =>
        this.store.select(mapFeature.selectGeoLocationTrackingActive)
      ),
      filter((trackingActive) => !trackingActive),
      map(() => navigationActions.navigationFailed({ reason: 'NO_GPS' }))
    );
  });

  navigationFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(navigationActions.navigationFailed),
        tap(({ reason }) =>
          this.snackBar.open(
            this.translocoService.translate(
              `shared.errors.navigationFailed_${reason}`
            ),
            '',
            { duration: 5000 }
          )
        ),
        tap(() => this.onMapNavigation.hideNavigationLine())
      );
    },
    { dispatch: false }
  );

  recalculateNavigationLine$ = createEffect(
    () => {
      return combineLatest({
        /* eslint-disable rxjs/finnish */
        geoLocation: this.actions$.pipe(ofType(mapActions.geolocationChanged)),
        navigationRunning: this.store.select(navigationFeature.selectRunning),
        route: this.store.select(navigationFeature.selectRoute),
        /* eslint-enable rxjs/finnish */
      }).pipe(
        tap(({ geoLocation, navigationRunning, route }) => {
          if (navigationRunning && geoLocation.geoLocation) {
            this.onMapNavigation.createNavigationLine([
              {
                point: new LngLat(
                  geoLocation.geoLocation.coords.longitude,
                  geoLocation.geoLocation.coords.latitude
                ),
              },
              ...route,
            ]);
          } else {
            this.onMapNavigation.hideNavigationLine();
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly onMapNavigation: OnMapNavigationService
  ) {}
}
