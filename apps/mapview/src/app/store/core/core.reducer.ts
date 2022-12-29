import { createReducer, on } from '@ngrx/store';
import { IRainViewerUrls } from '../../services/rain-viewer.interface';
import {
  RadarSettingsActions,
  rainViewersWidgetSettings,
} from './core.actions';
import * as coreActions from './core.actions';
import { AirspacesDefault } from './airspaces-defauls';

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
  airSpaces: AirspacesDefault,
};

export type AppState = { core: typeof initialState };

export const coreReducer = createReducer(
  initialState,
  on(
    RadarSettingsActions.enabledChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, enabled },
    })
  ),
  on(
    RadarSettingsActions.enabledWidgetChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, widget: { ...state.radar.widget, enabled } },
    })
  ),
  on(
    RadarSettingsActions.typeChanged,
    (state, { viewType }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, type: viewType },
    })
  ),
  on(
    RadarSettingsActions.colorSchemeChanged,
    (state, { colorScheme }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, colorScheme },
    })
  ),
  on(
    RadarSettingsActions.enabledSmoothChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, smooth: enabled },
    })
  ),
  on(
    RadarSettingsActions.enabledSnowChanged,
    (state, { enabled }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, snow: enabled },
    })
  ),
  on(
    RadarSettingsActions.animationSpeed,
    (state, { animationSpeed }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, animationSpeed },
    })
  ),
  on(
    RadarSettingsActions.opacityChanged,
    (state, { opacity }): AppState['core'] => ({
      ...state,
      radar: { ...state.radar, opacity },
    })
  ),
  on(
    RadarSettingsActions.widgetBgColorChanged,
    (state, { color }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: { ...state.radar.widget, background: color },
      },
    })
  ),
  on(
    RadarSettingsActions.widgetTextColorPastChanged,
    (state, { color }): AppState['core'] => ({
      ...state,
      radar: {
        ...state.radar,
        widget: { ...state.radar.widget, textColorPast: color },
      },
    })
  ),
  on(
    RadarSettingsActions.widgetTextColorFutureChanged,
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
    rainViewersWidgetSettings.moved,
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
  )
);
