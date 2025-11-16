import { createFeature, createReducer, on } from '@ngrx/store';

import {
  EHeightUnit,
  ESpeedUnit,
} from '../../../services/open-aip/airport.interfaces';
import { trafficEffectsActions } from '../../actions/effects.actions';
import { trafficSettingsActions } from '../../actions/settings.actions';

export const airplaneDisplayOptions = [
  'callsign',
  'label',
  'rego',
  'model',
  'pilotName',
  'speed',
  'altitude',
  'vspeed',
] as const;

export type AirplaneDisplayOption = (typeof airplaneDisplayOptions)[number];

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
  speedDisplayUnit: ESpeedUnit.kph,
  actualizationPeriod: 10,
  displayLine1: ['callsign', 'label', 'rego'] as AirplaneDisplayOption[],
  displayLine2: ['altitude', 'speed'] as AirplaneDisplayOption[],
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
      trafficSettingsActions.speedDisplayUnitChanged,
      (state, { speedDisplayUnit }): typeof initialState => ({
        ...state,
        speedDisplayUnit,
      }),
    ),
    on(
      trafficSettingsActions.actualizationPeriodChanged,
      (state, { actualizationPeriod }): typeof initialState => ({
        ...state,
        actualizationPeriod,
      }),
    ),
    on(
      trafficSettingsActions.displayLine1Changed,
      (state, { displayLine1 }): typeof initialState => ({
        ...state,
        displayLine1,
      }),
    ),
    on(
      trafficSettingsActions.displayLine2Changed,
      (state, { displayLine2 }): typeof initialState => ({
        ...state,
        displayLine2,
      }),
    ),
  ),
});
