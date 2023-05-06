import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettingsActions } from '../../actions/settings.actions';

const initialState = {
  screenWakeLock: {
    enabled: ScreenWakeLockService.supported,
  },
  widgetFontSizeRatio: 1.5,
  mapFontSizeRatio: 1.5,
  airplaneName: 'OMH-XXX (John Doe)',
};

export const generalFeature = createFeature({
  name: 'settings.general',
  reducer: createReducer(
    initialState,
    on(
      generalSettingsActions.screenWakeLockEnableChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        screenWakeLock: { ...state.screenWakeLock, enabled },
      })
    ),
    on(
      generalSettingsActions.widgetFontSizeRatioChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        widgetFontSizeRatio: value,
      })
    ),
    on(
      generalSettingsActions.mapFontSizeRatioChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        mapFontSizeRatio: value,
      })
    ),
    on(
      generalSettingsActions.airplaneNameChanged,
      (state, { airplaneName }): typeof initialState => ({
        ...state,
        airplaneName,
      })
    )
  ),
  extraSelectors: ({ selectScreenWakeLock }) => ({
    selectScreenWakeLockEnabled: createSelector(
      selectScreenWakeLock,
      (wakeLock) => wakeLock.enabled
    ),
  }),
});