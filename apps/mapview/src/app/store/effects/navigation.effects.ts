import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as turf from '@turf/turf';
import { LngLat } from 'maplibre-gl';
import {
  auditTime,
  combineLatest,
  filter,
  map,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { OnMapNavigationService } from '../../services/map/on-map-navigation/on-map-navigation.service';
import {
  mapEffectsActions,
  navigationEffectsActions,
} from '../actions/effects.actions';
import { mapActions, mapLocationMenuActions } from '../actions/map.actions';
import {
  globalSearchMenu,
  navigationDialogActions,
} from '../actions/navigation.actions';
import { mapFeature } from '../features/map.feature';
import { navigationFeature } from '../features/navigation.feature';
import { CustomFlyRoutesService } from '../../services/custom-fly-routes/custom-fly-routes.service';

@Injectable()
export class NavigationEffects {
  init$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNavigation.createLayers()),
      );
    },
    { dispatch: false },
  );

  validateNavigationStarted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        mapLocationMenuActions.startedNewRouteNavigation,
        navigationDialogActions.navigationStarted,
        globalSearchMenu.activateRoute,
        globalSearchMenu.startedNewRouteNavigation,
      ),
      switchMap(() =>
        this.store.select(mapFeature.selectGeoLocationTrackingActive),
      ),
      filter((trackingActive) => !trackingActive),
      map(() =>
        navigationEffectsActions.navigationFailed({ reason: 'NO_GPS' }),
      ),
    );
  });

  navigationFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(navigationEffectsActions.navigationFailed),
        tap(({ reason }) =>
          this.snackBar.open(
            this.translocoService.translate(
              `shared.errors.navigationFailed_${reason}`,
            ),
            '',
            { duration: 5000 },
          ),
        ),
        tap(() => this.onMapNavigation.hideNavigationRoute()),
      );
    },
    { dispatch: false },
  );

  removeReachedPoint$ = createEffect(() => {
    return combineLatest({
      /* eslint-disable rxjs/finnish */
      geoLocation: this.actions$.pipe(ofType(mapActions.geolocationChanged)),
      navigationRunning: this.store.select(navigationFeature.selectRunning),
      route: this.store.select(navigationFeature.selectRoute),
      /* eslint-enable rxjs/finnish */
    }).pipe(
      filter(
        ({ geoLocation, navigationRunning, route }) =>
          navigationRunning &&
          !!geoLocation.geoLocation &&
          route.length > 0 &&
          turf.distance(
            [route[0].point.lng, route[0].point.lat],
            [
              geoLocation.geoLocation.coords.longitude,
              geoLocation.geoLocation.coords.latitude,
            ],
          ) < 1,
      ),
      tap(({ route }) => this.showNavigationPointReachedMessage(route.length)),
      map(() => navigationEffectsActions.nextPointReached()),
    );
  });

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
          if (
            navigationRunning &&
            geoLocation.geoLocation &&
            route.length > 0
          ) {
            this.onMapNavigation.createNavigationRoute([
              {
                point: new LngLat(
                  geoLocation.geoLocation.coords.longitude,
                  geoLocation.geoLocation.coords.latitude,
                ),
              },
              ...route,
            ]);
          } else {
            this.onMapNavigation.hideNavigationRoute();
          }
        }),
      );
    },
    { dispatch: false },
  );

  routeSaved$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(navigationDialogActions.routeSaved),
        concatLatestFrom(() =>
          this.store.select(navigationFeature.selectRoute),
        ),
        tap(
          ([{ name }, points]) =>
            void this.customFlyRoutes.saveRoute(name, points),
        ),
      );
    },
    { dispatch: false },
  );

  saveCurrentRoute$ = createEffect(
    () => {
      return this.store.select(navigationFeature.selectRoute).pipe(
        skip(2), // initial set does not need save
        switchMap((route) => this.customFlyRoutes.saveCurrentRoute(route)),
      );
    },
    { dispatch: false },
  );

  loadCurrentRoute$ = createEffect(() => {
    return this.store.select(mapFeature.selectLoaded).pipe(
      filter((loaded) => loaded),
      switchMap(() => this.customFlyRoutes.getCurrentRoute()),
      map((route) => navigationEffectsActions.routeInitialLoaded({ route })),
    );
  });

  firstGeolocationFixed$ = createEffect(() => {
    return this.store.select(mapFeature.selectLoaded).pipe(
      filter((loaded) => loaded),
      switchMap(() => this.store.select(mapFeature.selectGeoLocation)),
      filter(
        (geoLocation): geoLocation is GeolocationPosition => !!geoLocation,
      ),
      auditTime(3000),
      take(1),
      map((geoLocation) =>
        mapEffectsActions.firstGeolocationFixed({
          gndAltitude: geoLocation.coords.altitude || 0,
        }),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly onMapNavigation: OnMapNavigationService,
    private readonly customFlyRoutes: CustomFlyRoutesService,
  ) {}

  private showNavigationPointReachedMessage(routeLength: number): void {
    this.snackBar.open(
      this.translocoService.translate(
        routeLength > 1
          ? `shared.messages.navigationReachedNextPoint`
          : `shared.messages.navigationReachedGoal`,
      ),
      '',
      { duration: 5000 },
    );
  }
}
