import { createFeature, createReducer, on } from '@ngrx/store';

import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { trafficEffectsActions } from '../../actions/effects.actions';
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
  accessKey: null as null | string,
  maxAge: 5,
  maxHeightAboveMe: 1000,
  altitudeDisplayUnit: EHeightUnit.meter,
  actualizationPeriod: 10,
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
    on(
      trafficSettingsActions.puretrackKeySet,
      (state, { accessKey }): typeof initialState => ({
        ...state,
        accessKey,
      }),
    ),
    on(
      trafficEffectsActions.unauthorized,
      trafficSettingsActions.puretrackKeyDeleted,
      (state): typeof initialState => ({
        ...state,
        accessKey: null,
      }),
    ),
    on(
      trafficSettingsActions.maxAgeChanged,
      (state, { maxAge }): typeof initialState => ({
        ...state,
        maxAge,
      }),
    ),
    on(
      trafficSettingsActions.maxHeightAboveMeChanged,
      (state, { maxHeightAboveMe }): typeof initialState => ({
        ...state,
        maxHeightAboveMe,
      }),
    ),
    on(
      trafficSettingsActions.altitudeDisplayUnitChanged,
      (state, { altitudeDisplayUnit }): typeof initialState => ({
        ...state,
        altitudeDisplayUnit,
      }),
    ),
    on(
      trafficSettingsActions.actualizationPeriodChanged,
      (state, { actualizationPeriod }): typeof initialState => ({
        ...state,
        actualizationPeriod,
      }),
    ),
  ),
});
