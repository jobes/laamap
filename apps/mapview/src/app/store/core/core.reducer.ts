/* eslint-disable max-lines */
import { createReducer, on } from '@ngrx/store';

import { ScreenWakeLockService } from '../../services/screen-wake-lock/screen-wake-lock.service';
import { airspacesDefault } from './airspaces-defaults';
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
        y: 270,
      },
      background: '#ffffff',
      textColorPast: '#707070',
      textColorFuture: '#005706',
    },
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
  instrumentsWidget: {
    speedMeter: {
      position: { x: 0, y: 0 },
      colorsBySpeed: [
        {
          minSpeed: 0,
          bgColor: '#d6d6d6',
          textColor: '#262626',
        },
        {
          minSpeed: 50,
          bgColor: '#e60000',
          textColor: '#feec7c',
        },
        {
          minSpeed: 80,
          bgColor: '#ffffff',
          textColor: '#020203',
        },
        {
          minSpeed: 110,
          bgColor: '#dff532',
          textColor: '#020203',
        },
      ],
    },
    varioMeter: {
      position: { x: 0, y: 200 },
      diffTime: 1000,
      colorsByClimbing: [
        {
          minClimbing: -1000,
          bgColor: '#ffffff',
          textColor: '#e51515',
        },
        {
          minClimbing: -3,
          bgColor: '#ffffff',
          textColor: '#000000',
        },
        {
          minClimbing: 3,
          bgColor: '#ff4d4d',
          textColor: '#000000',
        },
      ],
    },
    altimeter: {
      position: { x: 0, y: 60 },
      gndAltitude: 0,
      method: 'manual' as 'manual' | 'terrain',
      bgColor: '#ffffff',
      textColor: '#707070',
      show: ['altitudeM', 'gndM'] as (
        | 'altitudeM'
        | 'gndM'
        | 'altitudeFt'
        | 'gndFt'
      )[],
    },
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
  ),
  on(
    coreActions.instrumentsSettings.speedMeterWidgetPositionMoved,
    (state, { position }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        speedMeter: { ...state.instrumentsWidget.speedMeter, position },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.speedMeterWidgetColorsChanged,
    (state, { colorsBySpeed }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        speedMeter: { ...state.instrumentsWidget.speedMeter, colorsBySpeed },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.variometerWidgetPositionMoved,
    (state, { position }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        varioMeter: { ...state.instrumentsWidget.varioMeter, position },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.variometerWidgetColorsChanged,
    (state, { colorsByClimbingSpeed }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        varioMeter: {
          ...state.instrumentsWidget.varioMeter,
          colorsByClimbing: colorsByClimbingSpeed,
        },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.variometerDiffTimeChanged,
    (state, { diffTime }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        varioMeter: {
          ...state.instrumentsWidget.varioMeter,
          diffTime,
        },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterWidgetPositionMoved,
    (state, { position }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, position },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterGndFromAltitudeMethodChanged,
    (state, { method }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, method },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterManualGndAltitudeChanged,
    (state, { gndAltitude }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, gndAltitude },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterBgColorChanged,
    (state, { bgColor }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, bgColor },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterTextColorChanged,
    (state, { textColor }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, textColor },
      },
    })
  ),
  on(
    coreActions.instrumentsSettings.altimeterShowTypeChanged,
    (state, { show }): AppState['core'] => ({
      ...state,
      instrumentsWidget: {
        ...state.instrumentsWidget,
        altimeter: { ...state.instrumentsWidget.altimeter, show },
      },
    })
  )
);
