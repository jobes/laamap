import { createFeature, createReducer, on } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationActions } from './navigation.actions';

const initialState = {
  running: false,
  route: [] as { name: string; point: LngLat }[],
};

export const navigationFeature = createFeature({
  name: 'navigation',
  reducer: createReducer(
    initialState,
    on(
      navigationActions.startedNewRouteNavigation,
      (state, { name, point }): typeof initialState => ({
        ...state,
        running: true,
        route: [{ name, point }],
      })
    ),
    on(
      navigationActions.addedPointToNavigation,
      (state, { name, point }): typeof initialState => ({
        ...state,
        route: [...state.route, { name, point }],
      })
    ),
    on(navigationActions.navigationFailed, (state): typeof initialState => ({
      ...state,
    }))
  ),
});
