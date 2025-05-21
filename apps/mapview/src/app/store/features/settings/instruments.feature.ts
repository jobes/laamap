import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  generalEffectsActions,
  mapEffectsActions,
} from '../../actions/effects.actions';
import {
  AircraftBarInstrumentWidgetSettingsActions,
  airTemperatureSettingsActions,
  altimeterQuickSettingsActions,
  compassSettingsActions,
  instrumentAltimeterSettingsActions,
  instrumentSettingsActions,
  instrumentSpeedSettingsActions,
  trackingSettingsActions,
  varioSettingsActions,
} from '../../actions/settings.actions';
import {
  airTemperatureWidgetActions,
  aircraftBarInstrumentsWidgetActions,
  altimeterWidgetActions,
  compassWidgetActions,
  radioWidgetActions,
  speedMeterWidgetActions,
  trackingWidgetActions,
  varioMeterWidgetActions,
} from '../../actions/widgets.actions';
import { barDefinition } from '../../selector-helpers';
import { PlaneInstrumentsBarKeys } from '../plane-instruments.initial-state';

const initialState = {
  showOnlyOnActiveGps: true,
  airplaneInstrumentsUrl: '',
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
    source: 'gps' as 'gps' | 'pressure',
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
    gpsAltitudeError: 0,
    qfe: 1013,
    qnh: 1013,
    method: 'manual' as 'manual' | 'terrain',
    bgColor: '#ffffff',
    textColor: '#000000',
    show: ['altitudeM', 'gndM'] as (
      | 'altitudeM'
      | 'gndM'
      | 'altitudeFt'
      | 'gndFt'
      | 'pressureAltitudeM'
      | 'pressureGndM'
      | 'pressureAltitudeFt'
      | 'pressureGndFt'
    )[],
  },
  tracking: {
    position: { x: 0, y: 300 },
    activeBg: '#ffffff',
    inactiveBg: '#d3d3d3',
    activeText: '#000000',
    inactiveText: '#000000',
  },
  oilTemp: {
    show: true,
    position: { x: 0, y: 400 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 30,
    maxShownValue: 150,
    alertLower: 50,
    alertUpper: 130,
    cautionLower: 90,
    cautionUpper: 110,
  },
  cht1Temp: {
    show: true,
    position: { x: 0, y: 430 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 30,
    maxShownValue: 130,
    alertLower: 40,
    alertUpper: 120,
    cautionLower: 60,
    cautionUpper: 100,
  },
  cht2Temp: {
    show: true,
    position: { x: 0, y: 460 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 30,
    maxShownValue: 130,
    alertLower: 40,
    alertUpper: 120,
    cautionLower: 60,
    cautionUpper: 100,
  },
  oilPressure: {
    show: true,
    position: { x: 0, y: 490 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 1,
    maxShownValue: 8,
    alertLower: 1.5,
    alertUpper: 7,
    cautionLower: 2,
    cautionUpper: 5,
  },
  fuelLevel: {
    show: true,
    position: { x: 0, y: 520 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 0,
    maxShownValue: 40,
    alertLower: 5,
    alertUpper: 42,
    cautionLower: 15,
    cautionUpper: 41,
  },
  rpm: {
    show: true,
    position: { x: 0, y: 550 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 0,
    maxShownValue: 6000,
    alertLower: 1400,
    alertUpper: 5800,
    cautionLower: 2000,
    cautionUpper: 5500,
  },
  radio: {
    position: { x: 0, y: 600 },
  },
  compass: {
    showWidget: true,
    showCircle: false,
    circleRelativePositionFromBottom: 65,
    circleRelativePositionFromCenter: -50,
    circleRelativeSize: 1.5,
    widgetPosition: { x: 0, y: 650 },
  },
  airTemperature: {
    show: true,
    widgetPosition: { x: 0, y: 700 },
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
      varioSettingsActions.relativeHeightSourceChanged,
      (state, { source }): typeof initialState => ({
        ...state,
        varioMeter: {
          ...state.varioMeter,
          source,
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
      generalEffectsActions.automaticGNDAltitudeSet,
      altimeterQuickSettingsActions.manualGNDAltitudeChanged,
      instrumentAltimeterSettingsActions.manualGNDAltitudeChanged,
      mapEffectsActions.firstGeolocationFixed,
      (state, { gndAltitude }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, gndAltitude },
      }),
    ),
    on(
      instrumentAltimeterSettingsActions.altitudeGpsErrorChanged,
      altimeterQuickSettingsActions.gpsAltitudeErrorChanged,
      generalEffectsActions.automaticGpsAltitudeErrorSet,
      mapEffectsActions.firstGeolocationFixed,
      (state, { gpsAltitudeError }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, gpsAltitudeError },
      }),
    ),
    on(
      altimeterQuickSettingsActions.manualQfeChanged,
      instrumentAltimeterSettingsActions.qfeChanged,
      generalEffectsActions.automaticQfeSet,
      mapEffectsActions.firstGeolocationFixed,
      (state, { qfe }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, qfe },
      }),
    ),
    on(
      altimeterQuickSettingsActions.manualQnhChanged,
      instrumentAltimeterSettingsActions.qnhChanged,
      generalEffectsActions.automaticQnhSet,
      mapEffectsActions.firstGeolocationFixed,
      (state, { qnh }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, qnh },
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
      instrumentSettingsActions.airplaneInstrumentsURLChanged,
      (state, { url }): typeof initialState => ({
        ...state,
        airplaneInstrumentsUrl: url,
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
    on(
      aircraftBarInstrumentsWidgetActions.positionMoved,
      (state, { position, instrumentType }): typeof initialState => ({
        ...state,
        [instrumentType]: { ...state[instrumentType], position },
      }),
    ),
    on(
      radioWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        radio: { ...state.radio, position },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.textColorChanged,
      (state, { textColor, instrumentType }): typeof initialState => ({
        ...state,
        [instrumentType]: { ...state[instrumentType], textColor },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.bgColorChanged,
      (state, { instrumentType, bgColor }): typeof initialState => ({
        ...state,
        [instrumentType]: { ...state[instrumentType], bgColor },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.show,
      (state, { instrumentType, show }): typeof initialState => ({
        ...state,
        [instrumentType]: { ...state[instrumentType], show },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.minShownValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          minShownValue: value,
        },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.maxShownValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          maxShownValue: value,
        },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.lowerAlertValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          alertLower: value,
        },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.upperAlertValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          alertUpper: value,
        },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.lowerCautionValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          cautionLower: value,
        },
      }),
    ),
    on(
      AircraftBarInstrumentWidgetSettingsActions.upperCautionValueChanged,
      (state, { instrumentType, value }): typeof initialState => ({
        ...state,
        [instrumentType]: {
          ...state[instrumentType],
          cautionUpper: value,
        },
      }),
    ),
    on(
      compassSettingsActions.widgetEnabledChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, showWidget: enabled },
      }),
    ),
    on(
      compassSettingsActions.circleEnabledChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, showCircle: enabled },
      }),
    ),
    on(
      compassSettingsActions.circleMovedFromBottom,
      (state, { value }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, circleRelativePositionFromBottom: value },
      }),
    ),
    on(
      compassSettingsActions.circleMovedFromCenter,
      (state, { value }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, circleRelativePositionFromCenter: value },
      }),
    ),
    on(
      compassSettingsActions.circleRelativeSizeChanged,
      (state, { value }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, circleRelativeSize: value },
      }),
    ),
    on(
      compassWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        compass: { ...state.compass, widgetPosition: position },
      }),
    ),
    on(
      airTemperatureWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        airTemperature: { ...state.airTemperature, widgetPosition: position },
      }),
    ),
    on(
      airTemperatureSettingsActions.enabledChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        airTemperature: { ...state.airTemperature, show: enabled },
      }),
    ),
  ),
  extraSelectors: (selectors) => ({
    selectAircraftInstrumentBars: (type: PlaneInstrumentsBarKeys) =>
      createSelector(selectors['selectSettings.instrumentsState'], (settings) =>
        barDefinition(settings[type]),
      ),
  }),
});
