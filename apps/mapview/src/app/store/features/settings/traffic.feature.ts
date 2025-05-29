import { createFeature, createReducer, on } from '@ngrx/store';

import { trafficSettingsActions } from '../../actions/settings.actions';

function makeId(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const initialState = {
  enabled: false,
  isRego: true,
  regoOrLabel: '',
  aircraftType: null as null | number,
  deviceId: makeId(6),
};

export const trafficFeature = createFeature({
  name: 'settings.traffic',
  reducer: createReducer(
    initialState,
    on(
      trafficSettingsActions.enabledChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        enabled,
      }),
    ),
    on(
      trafficSettingsActions.isRegoChanged,
      (state, { isRego }): typeof initialState => ({
        ...state,
        isRego,
      }),
    ),
    on(
      trafficSettingsActions.regoOrLabelChanged,
      (state, { regoOrLabel }): typeof initialState => ({
        ...state,
        regoOrLabel,
      }),
    ),
    on(
      trafficSettingsActions.aircraftTypeChanged,
      (state, { aircraftType }): typeof initialState => ({
        ...state,
        aircraftType,
      }),
    ),
  ),
});
