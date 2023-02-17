import { createReducer, on } from '@ngrx/store';

import { IRainViewerUrls } from '../../services/rain-viewer/rain-viewer.interface';
import { ScreenWakeLockService } from '../../services/screen-wake-lock/screen-wake-lock.service';
import { airspacesDefault } from './airspaces-defauls';
import {
  radarSettingsActions,
  rainViewersWidgetSettings,
} from './core.actions';
import * as coreActions from './core.actions';

const initialState = {
  radar: {
    enabled: false,
    type: 'radar' as 'radar' | 'satellite' | 'coverage',
    colorScheme: 1, // https://www.rainviewer.com/api/color-schemes.html
    snow: false,
    smooth: true,
    animationSpeed: 30,
    opacity: 75,
    widget: {
      enabled: false,
      position: {
        x: 0,
        y: 0,
      },
      background: '#ffffff',
      textColorPast: '#707070',
      textColorFuture: '#005706',
    },
    urls: null as IRainViewerUrls | null,
  },
  airSpaces: airspacesDefault,
  notams: {
    hiddenList: [] as string[],
  },
  screenWakeLock: {
    enabled: ScreenWakeLockService.supported,
  },
  navigation: {
    minActivationSpeedKpH: 30,
    directionLineSegmentSeconds: 60,
    directionLineSegmentCount: 5,
  },
};

export type AppState = { core: typeof initialState };

export const coreReducer = createReducer(
  initialState,
  on(
    radarSettingsActions.enabledChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, enabled },
    })
  ),
  on(
    radarSettingsActions.enabledWidgetChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, widget: { ...state.radar.widget, enabled } },
    })
  ),
  on(
    radarSettingsActions.typeChanged,
    (state, { viewType }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, type: viewType },
    })
  ),
  on(
    radarSettingsActions.colorSchemeChanged,
    (state, { colorScheme }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, colorScheme },
    })
  ),
  on(
    radarSettingsActions.enabledSmoothChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, smooth: enabled },
    })
  ),
  on(
    radarSettingsActions.enabledSnowChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, snow: enabled },
    })
  ),
  on(
    radarSettingsActions.animationSpeedChanged,
    (state, { animationSpeed }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, animationSpeed },
    })
  ),
  on(
    radarSettingsActions.opacityChanged,
    (state, { opacity }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, opacity },
    })
  ),
  on(
    radarSettingsActions.widgetBgColorChanged,
    (state, { color }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: { ...state.radar.widget, background: color },
      },
    })
  ),
  on(
    radarSettingsActions.widgetTextColorPastChanged,
    (state, { color }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: { ...state.radar.widget, textColorPast: color },
      },
    })
  ),
  on(
    radarSettingsActions.widgetTextColorFutureChanged,
    (state, { color }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: { ...state.radar.widget, textColorFuture: color },
      },
    })
  ),
  on(
    coreActions.rainViewersUrlsLoaded,
    (state, { data }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        urls: data,
      },
    })
  ),
  on(
    rainViewersWidgetSettings.positionMoved,
    (state, { position }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: {
          ...state.radar.widget,
          position,
        },
      },
    })
  ),
  on(
    coreActions.airspacesSettings.enabledChanged,
    (state, { airspaceType, enabled }): AppState['core'] => ({
      ...state,
      airSpaces: {
        ...state.airSpaces,
        [airspaceType]: { ...state.airSpaces[airspaceType], enabled },
      },
    })
  ),
  on(
    coreActions.airspacesSettings.colorChanged,
    (state, { airspaceType, color }): AppState['core'] => ({
      ...state,
      airSpaces: {
        ...state.airSpaces,
        [airspaceType]: { ...state.airSpaces[airspaceType], color },
      },
    })
  ),
  on(
    coreActions.airspacesSettings.opacityChanged,
    (state, { airspaceType, opacity }): AppState['core'] => ({
      ...state,
      airSpaces: {
        ...state.airSpaces,
        [airspaceType]: { ...state.airSpaces[airspaceType], opacity },
      },
    })
  ),
  on(
    coreActions.airspacesSettings.minZoomChanged,
    (state, { airspaceType, minZoom }): AppState['core'] => ({
      ...state,
      airSpaces: {
        ...state.airSpaces,
        [airspaceType]: { ...state.airSpaces[airspaceType], minZoom },
      },
    })
  ),
  on(
    coreActions.notamsSettings.hide,
    (state, { notamId }): AppState['core'] => ({
      ...state,
      notams: {
        ...state.notams,
        hiddenList: [
          ...state.notams.hiddenList.filter((nId) => nId !== notamId), // to avoid duplicity
          notamId,
        ],
      },
    })
  ),
  on(
    coreActions.generalSettings.screenWakeLockEnableChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      screenWakeLock: { ...state.screenWakeLock, enabled },
    })
  ),
  on(
    coreActions.navigationSettings.directionLineSegmentSeconds,
    (state, { seconds }): AppState['core'] => ({
      ...state,
      navigation: { ...state.navigation, directionLineSegmentSeconds: seconds },
    })
  ),
  on(
    coreActions.navigationSettings.directionLineSegmentCount,
    (state, { count }): AppState['core'] => ({
      ...state,
      navigation: { ...state.navigation, directionLineSegmentCount: count },
    })
  ),
  on(
    coreActions.navigationSettings.minimumActivationSpeedChanged,
    (state, { minActivationSpeedKpH }): AppState['core'] => ({
      ...state,
      navigation: { ...state.navigation, minActivationSpeedKpH },
    })
  )
);
