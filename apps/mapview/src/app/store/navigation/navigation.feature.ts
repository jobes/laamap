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
    on(navigationActions.startNavigation, (state): typeof initialState => ({
      ...state,
      running: true,
    })),
    on(navigationActions.endNavigation, (state): typeof initialState => ({
      ...state,
      running: false,
    })),
    on(navigationActions.routeClear, (state): typeof initialState => ({
      ...state,
      route: [],
    })),
    on(navigationActions.navigationFailed, (state): typeof initialState => ({
      ...state,
    })),
    on(
      navigationActions.reorderRoute,
      (state, { route }): typeof initialState => ({
        ...state,
        route,
      })
    ),
    on(
      navigationActions.routeItemDeleted,
      (state, { index }): typeof initialState => ({
        ...state,
        route: state.route.filter((_, i) => i !== index),
      })
    ),
    on(navigationActions.nextPointReached, (state): typeof initialState => ({
      ...state,
      route: state.route.slice(1),
      running: state.route.length > 1,
    }))
  ),
});
