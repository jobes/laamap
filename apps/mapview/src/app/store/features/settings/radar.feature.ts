import { createFeature, createReducer, on } from '@ngrx/store';

import {
  RadarTypes,
  radarSettingsActions,
} from '../../actions/settings.actions';
import { radarWidgetActions } from '../../actions/widgets.actions';

const initialState = {
  enabled: false,
  type: 'radar' as RadarTypes,
  colorScheme: 1, // https://www.rainviewer.com/api/color-schemes.html
  snow: false,
  smooth: true,
  animationSpeed: 30,
  opacity: 75,
  widget: {
    enabled: false,
    position: {
      x: 0,
      y: 270,
    },
    background: '#ffffff',
    textColorPast: '#707070',
    textColorFuture: '#005706',
  },
  pauseOnEnd: 10000,
};

export type RadarSettings = typeof initialState;

export const radarFeature = createFeature({
  name: 'settings.radar',
  reducer: createReducer(
    initialState,
    on(
      radarSettingsActions.enabledChanged,
      (state, { enabled }): RadarSettings => ({
        ...state,
        enabled,
      }),
    ),
    on(
      radarSettingsActions.widgetEnabled,
      (state, { enabled }): RadarSettings => ({
        ...state,
        widget: { ...state.widget, enabled },
      }),
    ),
    on(
      radarSettingsActions.typeChanged,
      (state, { viewType }): RadarSettings => ({
        ...state,
        type: viewType,
      }),
    ),
    on(
      radarSettingsActions.colorSchemeChanged,
      (state, { colorScheme }): RadarSettings => ({
        ...state,
        colorScheme,
      }),
    ),
    on(
      radarSettingsActions.enabledSmoothChanged,
      (state, { enabled }): RadarSettings => ({
        ...state,
        smooth: enabled,
      }),
    ),
    on(
      radarSettingsActions.enabledSnowChanged,
      (state, { enabled }): RadarSettings => ({
        ...state,
        snow: enabled,
      }),
    ),
    on(
      radarSettingsActions.animationSpeedChanged,
      (state, { animationSpeed }): RadarSettings => ({
        ...state,
        animationSpeed,
      }),
    ),
    on(
      radarSettingsActions.opacityChanged,
      (state, { opacity }): RadarSettings => ({
        ...state,
        opacity,
      }),
    ),
    on(
      radarSettingsActions.widgetBgColorChanged,
      (state, { color }): RadarSettings => ({
        ...state,
        widget: { ...state.widget, background: color },
      }),
    ),
    on(
      radarSettingsActions.widgetTextColorPastChanged,
      (state, { color }): RadarSettings => ({
        ...state,
        widget: { ...state.widget, textColorPast: color },
      }),
    ),
    on(
      radarSettingsActions.widgetTextColorFutureChanged,
      (state, { color }): RadarSettings => ({
        ...state,
        widget: { ...state.widget, textColorFuture: color },
      }),
    ),
    on(
      radarSettingsActions.pauseOnEndChanged,
      (state, { time }): RadarSettings => ({
        ...state,
        pauseOnEnd: time,
      }),
    ),
    on(
      radarWidgetActions.positionMoved,
      (state, { position }): RadarSettings => ({
        ...state,
        widget: {
          ...state.widget,
          position,
        },
      }),
    ),
  ),
});
