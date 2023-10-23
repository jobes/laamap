import { createFeature, createReducer, on } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationEffectsActions } from '../actions/effects.actions';
import { mapLocationMenuActions } from '../actions/map.actions';
import {
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
      (state, { index }): typeof initialState => ({
        ...state,
        route: state.route.filter((_, i) => i !== index),
      }),
    ),
    on(
      navigationEffectsActions.nextPointReached,
      (state): typeof initialState => ({
        ...state,
        route: state.route.slice(1),
        running: state.route.length > 1,
      }),
    ),
  ),
});
