import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { instrumentsEffectsActions } from '../actions/effects.actions';
import { barExtraValues } from '../selector-helpers';
import {
  IPlaneInstruments,
  PlaneInstrumentsBarKeys,
  planeInstrumentsInitialState,
} from './plane-instruments.initial-state';
import { instrumentsFeature } from './settings/instruments.feature';

export const planeInstrumentsFeature = createFeature({
  name: 'planeInstruments',
  reducer: createReducer(
    planeInstrumentsInitialState,
    on(
      instrumentsEffectsActions.planeInstrumentsValuesChanged,
      (state, { values }): IPlaneInstruments => ({
        ...values,
      }),
    ),
    on(
      instrumentsEffectsActions.planeInstrumentValueChanged,
      (state, { name, value }): IPlaneInstruments => ({
        ...state,
        [name]: value,
      }),
    ),
    on(
      instrumentsEffectsActions.planeInstrumentsDisconnected,
      (): IPlaneInstruments => planeInstrumentsInitialState,
    ),
  ),
  extraSelectors: ({ selectPlaneInstrumentsState, selectCpuUsage }) => ({
    selectExtended: (type: PlaneInstrumentsBarKeys) =>
      createSelector(
        selectPlaneInstrumentsState,
        instrumentsFeature['selectSettings.instrumentsState'],
        (state, settings) =>
          barExtraValues(
            state[type],
            settings[type],
            state.cpuUsage !== null && state.cpuUsage !== undefined,
          ),
      ),
    selectConnected: createSelector(
      selectCpuUsage,
      (cpuUsage) => cpuUsage !== null && cpuUsage !== undefined,
    ),
  }),
});
