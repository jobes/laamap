import { createFeature, createReducer, on } from '@ngrx/store';

import { bleSensorsEffectsActions } from '../actions/effects.actions';
import { bleSensorsSettingsActions } from '../actions/settings.actions';

const initialState = {
  pressure: undefined as number | undefined,
  temperature: undefined as number | undefined,
};

export const bleSensorsFeature = createFeature({
  name: 'bleSensors',
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
    on(
      bleSensorsEffectsActions.deviceDisconnected,
      bleSensorsSettingsActions.deviceChanged,
      bleSensorsSettingsActions.deviceDeleted,
      (): typeof initialState => initialState,
    ),
  ),
});
