import { createFeature, createReducer, on } from '@ngrx/store';

import { bleSensorsActions } from '../../actions/settings.actions';

const initialState = {
  deviceId: '', // if !deviceId then bluetooth for this app is disabled
  deviceName: '',
};

export const bleSensorsSettingsFeature = createFeature({
  name: 'settings.bleSensors',
  reducer: createReducer(
    initialState,
    on(
      bleSensorsActions.deviceChanged,
      (state, { deviceId, deviceName }): typeof initialState => ({
        ...state,
        deviceId,
        deviceName,
      }),
    ),
    on(bleSensorsActions.deviceDeleted, (state): typeof initialState => ({
      ...state,
      deviceId: '',
    })),
  ),
});
