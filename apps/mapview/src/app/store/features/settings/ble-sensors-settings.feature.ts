import { createFeature, createReducer, on } from '@ngrx/store';

import { bleSensorsSettingsActions } from '../../actions/settings.actions';

const initialState = {
  deviceId: '', // if !deviceId then bluetooth for this app is disabled
  deviceName: '',
};

export const bleSensorsSettingsFeature = createFeature({
  name: 'settings.bleSensors',
  reducer: createReducer(
    initialState,
    on(
      bleSensorsSettingsActions.deviceChanged,
      (state, { deviceId, deviceName }): typeof initialState => ({
        ...state,
        deviceId,
        deviceName,
      }),
    ),
    on(
      bleSensorsSettingsActions.deviceDeleted,
      (state): typeof initialState => ({
        ...state,
        deviceId: '',
      }),
    ),
  ),
});
