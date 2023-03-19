import { createFeature, createReducer, on } from '@ngrx/store';

import { navigationSettings } from './navigation.actions';

const initialState = {
  minActivationSpeedKpH: 30,
  directionLineSegmentSeconds: 60,
  directionLineSegmentCount: 5,
};

export const navigationFeature = createFeature({
  name: 'settings.navigation',
  reducer: createReducer(
    initialState,
    on(
      navigationSettings.directionLineSegmentSeconds,
      (state, { seconds }): typeof initialState => ({
        ...state,
        directionLineSegmentSeconds: seconds,
      })
    ),
    on(
      navigationSettings.directionLineSegmentCount,
      (state, { count }): typeof initialState => ({
        ...state,
        directionLineSegmentCount: count,
      })
    ),
    on(
      navigationSettings.minimumActivationSpeedChanged,
      (state, { minActivationSpeedKpH }): typeof initialState => ({
        ...state,
        minActivationSpeedKpH,
      })
    )
  ),
});
