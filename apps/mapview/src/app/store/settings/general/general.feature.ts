import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettings } from './general.actions';

const initialState = {
  screenWakeLock: {
    enabled: ScreenWakeLockService.supported,
  },
};

export const generalFeature = createFeature({
  name: 'settings.general',
  reducer: createReducer(
    initialState,
    on(
      generalSettings.screenWakeLockEnableChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        screenWakeLock: { ...state.screenWakeLock, enabled },
      })
    )
  ),
});

export const selectScreenWakeLockEnabled = createSelector(
  generalFeature.selectScreenWakeLock,
  (state) => state.enabled
);
