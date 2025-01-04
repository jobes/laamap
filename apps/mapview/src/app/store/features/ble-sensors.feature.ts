import { createFeature, createReducer, on } from '@ngrx/store';

import { bleSensorsEffectsActions } from '../actions/effects.actions';

const initialState = {
  pressure: 0,
  temperature: 0,
};

export const bleSensorsFeature = createFeature({
  name: 'ble sensors',
  reducer: createReducer(
    initialState,
    on(
      bleSensorsEffectsActions.pressureChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        pressure: value,
      }),
    ),
    on(
      bleSensorsEffectsActions.temperatureChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        temperature: value,
      }),
    ),
  ),
});
