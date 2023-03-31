import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettings } from './general.actions';

const initialState = {
  screenWakeLock: {
    enabled: ScreenWakeLockService.supported,
  },
  widgetFontSizeRation: 1.5,
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
    ),
    on(
      generalSettings.widgetFontSizeRatioChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        widgetFontSizeRation: value,
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
