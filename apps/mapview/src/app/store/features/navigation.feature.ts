import { createFeature, createReducer, on } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationEffectsActions } from '../actions/effects.actions';
import { mapLocationMenuActions } from '../actions/map.actions';
import {
  customFlyRouteListDialogActions,
  globalSearchMenu,
  navigationDialogActions,
  poiListDialogActions,
} from '../actions/navigation.actions';

const initialState = {
  running: false,
  route: [] as { name: string; point: LngLat }[],
};

export const navigationFeature = createFeature({
  name: 'navigation',
  reducer: createReducer(
    initialState,
    on(
      mapLocationMenuActions.startedNewRouteNavigation,
      (state, { name, point }): typeof initialState => ({
        ...state,
        running: true,
        route: [{ name, point }],
      }),
    ),
    on(
      mapLocationMenuActions.addedPointToNavigation,
      poiListDialogActions.addedPointToNavigation,
      (state, { name, point }): typeof initialState => ({
        ...state,
        route: [...state.route, { name, point }],
      }),
    ),
    on(
      navigationDialogActions.navigationStarted,
      (state): typeof initialState => ({
        ...state,
        running: true,
      }),
    ),
    on(
      navigationDialogActions.navigationEnded,
      (state): typeof initialState => ({
        ...state,
        running: false,
      }),
    ),
    on(navigationDialogActions.routeCleared, (state): typeof initialState => ({
      ...state,
      running: false,
      route: [],
    })),
    on(
      navigationEffectsActions.navigationFailed,
      (state): typeof initialState => ({
        ...state,
      }),
    ),
    on(
      navigationDialogActions.routeReordered,
      (state, { route }): typeof initialState => ({
        ...state,
        route,
      }),
    ),
    on(
      navigationDialogActions.routeItemDeleted,
      (state, { index }): typeof initialState => {
        const route = state.route.filter((_, i) => i !== index);
        return {
          ...state,
          route,
          running: state.running && route.length > 0,
        };
      },
    ),
    on(
      navigationEffectsActions.nextPointReached,
      (state): typeof initialState => ({
        ...state,
        route: state.route.slice(1),
        running: state.route.length > 1,
      }),
    ),
    on(
      customFlyRouteListDialogActions.routeUsed,
      (state, { route }): typeof initialState => ({
        ...state,
        route: route.points,
      }),
    ),
    on(
      navigationEffectsActions.routeInitialLoaded,
      (state, { route }): typeof initialState => ({
        ...state,
        route: route,
      }),
    ),
    on(
      globalSearchMenu.activateRoute,
      (state, { route }): typeof initialState => ({
        ...state,
        route: route.points,
        running: true,
      }),
    ),
  ),
});
