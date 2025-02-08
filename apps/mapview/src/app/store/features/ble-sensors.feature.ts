import { createFeature, createReducer, on } from '@ngrx/store';

import { bleSensorsEffectsActions } from '../actions/effects.actions';
import { bleSensorsSettingsActions } from '../actions/settings.actions';
import { bleSensorsInitialState } from './ble-sensors.initial-state';

export const bleSensorsFeature = createFeature({
  name: 'bleSensors',
  reducer: createReducer(
    bleSensorsInitialState,
    on(
      bleSensorsEffectsActions.characteristicDataChanged,
      (
        state,
        { characteristicName, value },
      ): typeof bleSensorsInitialState => ({
        ...state,
        [characteristicName]: value,
      }),
    ),
    on(
      bleSensorsEffectsActions.deviceDisconnected,
      bleSensorsSettingsActions.deviceChanged,
      bleSensorsSettingsActions.deviceDeleted,
      (): typeof bleSensorsInitialState => bleSensorsInitialState,
    ),
  ),
});
