import { createFeature, createReducer, on } from '@ngrx/store';

import { instrumentsEffectsActions } from '../actions/effects.actions';
import {
  IPlaneInstruments,
  planeInstrumentsInitialState,
} from './plane-instruments.initial-state';

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
});
