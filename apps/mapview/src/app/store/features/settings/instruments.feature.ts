import { createFeature, createReducer, on } from '@ngrx/store';

import {
  instrumentAltimeterSettingsActions,
  instrumentSettingsActions,
  instrumentSpeedSettingsActions,
  trackingSettingsActions,
  varioSettingsActions,
} from '../../actions/settings.actions';
import {
  altimeterWidgetActions,
  speedMeterWidgetActions,
  trackingWidgetActions,
  varioMeterWidgetActions,
} from '../../actions/widgets.actions';
import { mapEffectsActions } from '../../actions/effects.actions';

const initialState = {
  showOnlyOnActiveGps: true,
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
    textColor: '#000000',
    show: ['altitudeM', 'gndM'] as (
      | 'altitudeM'
      | 'gndM'
      | 'altitudeFt'
      | 'gndFt'
    )[],
  },
  tracking: {
    position: { x: 0, y: 300 },
    activeBg: '#ffffff',
    inactiveBg: '#d3d3d3',
    activeText: '#000000',
    inactiveText: '#000000',
  },
};

export const instrumentsFeature = createFeature({
  name: 'settings.instruments',
  reducer: createReducer(
    initialState,
    on(
      speedMeterWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        speedMeter: { ...state.speedMeter, position },
      }),
    ),
    on(
      instrumentSpeedSettingsActions.widgetColorsChanged,
      (state, { colorsBySpeed }): typeof initialState => ({
        ...state,
        speedMeter: { ...state.speedMeter, colorsBySpeed },
      }),
    ),
    on(
      varioMeterWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        varioMeter: { ...state.varioMeter, position },
      }),
    ),
    on(
      varioSettingsActions.widgetColorsChanged,
      (state, { colorsByClimbingSpeed }): typeof initialState => ({
        ...state,
        varioMeter: {
          ...state.varioMeter,
          colorsByClimbing: colorsByClimbingSpeed,
        },
      }),
    ),
    on(
      varioSettingsActions.diffTimeChanged,
      (state, { diffTime }): typeof initialState => ({
        ...state,
        varioMeter: {
          ...state.varioMeter,
          diffTime,
        },
      }),
    ),
    on(
      altimeterWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, position },
      }),
    ),
    on(
      altimeterWidgetActions.manualGNDAltitudeChanged,
      instrumentAltimeterSettingsActions.manualGNDAltitudeChanged,
      mapEffectsActions.firstGeolocationFixed,
      (state, { gndAltitude }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, gndAltitude },
      }),
    ),
    on(
      instrumentAltimeterSettingsActions.bgColorChanged,
      (state, { bgColor }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, bgColor },
      }),
    ),
    on(
      instrumentAltimeterSettingsActions.textColorChanged,
      (state, { textColor }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, textColor },
      }),
    ),
    on(
      instrumentAltimeterSettingsActions.showTypeChanged,
      (state, { show }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, show },
      }),
    ),
    on(
      instrumentSettingsActions.visibleOnGpsTrackingChanged,
      (state, { showOnlyOnActiveGps }): typeof initialState => ({
        ...state,
        showOnlyOnActiveGps,
      }),
    ),
    on(
      trackingWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        tracking: { ...state.tracking, position },
      }),
    ),
    on(
      trackingSettingsActions.activeBgColorChanged,
      (state, { activeBg }): typeof initialState => ({
        ...state,
        tracking: { ...state.tracking, activeBg },
      }),
    ),
    on(
      trackingSettingsActions.inactiveBgColorChanged,
      (state, { inactiveBg }): typeof initialState => ({
        ...state,
        tracking: { ...state.tracking, inactiveBg },
      }),
    ),
    on(
      trackingSettingsActions.activeTextColorChanged,
      (state, { activeText }): typeof initialState => ({
        ...state,
        tracking: { ...state.tracking, activeText },
      }),
    ),
    on(
      trackingSettingsActions.inactiveTextColorChanged,
      (state, { inactiveText }): typeof initialState => ({
        ...state,
        tracking: { ...state.tracking, inactiveText },
      }),
    ),
  ),
});
