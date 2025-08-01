import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { account } from '../../actions/init.actions';
import { generalSettingsActions } from '../../actions/settings.actions';

const initialState = {
  screenWakeLock: {
    enabled: ScreenWakeLockService.supported,
  },
  widgetFontSizeRatio: 1.5,
  mapFontSizeRatio: 1.5,
  notamFirs: [] as string[],
  notamRadius: 25000,
  territories: ['sk'],
  language: '',
  loginToken: '',
  loginObject: {
    name: '',
    email: '',
  },
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
      }),
    ),
    on(
      generalSettingsActions.widgetFontSizeRatioChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        widgetFontSizeRatio: value,
      }),
    ),
    on(
      generalSettingsActions.mapFontSizeRatioChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        mapFontSizeRatio: value,
      }),
    ),
    on(
      generalSettingsActions.notamFIRChanged,
      (state, { firs }): typeof initialState => ({
        ...state,
        notamFirs: firs,
      }),
    ),
    on(
      generalSettingsActions.notamRadiusChanged,
      (state, { radius }): typeof initialState => ({
        ...state,
        notamRadius: radius,
      }),
    ),
    on(
      generalSettingsActions.territoriesChanged,
      (state, { territories }): typeof initialState => ({
        ...state,
        territories,
      }),
    ),
    on(
      generalSettingsActions.languageChanged,
      (state, { language }): typeof initialState => ({
        ...state,
        language,
      }),
    ),
    on(account.loggedIn, (state, { jwtToken }): typeof initialState => ({
      ...state,
      loginToken: jwtToken,
      loginObject: JSON.parse(
        atob(jwtToken.split('.')[1]),
      ) as (typeof initialState)['loginObject'],
    })),
    on(generalSettingsActions.logOut, (state): typeof initialState => ({
      ...state,
      loginToken: '',
      loginObject: {
        name: '',
        email: '',
      },
    })),
  ),
  extraSelectors: ({ selectScreenWakeLock }) => ({
    selectScreenWakeLockEnabled: createSelector(
      selectScreenWakeLock,
      (wakeLock) => wakeLock.enabled,
    ),
  }),
});
