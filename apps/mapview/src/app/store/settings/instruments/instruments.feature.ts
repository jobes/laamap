import { createFeature, createReducer, on } from '@ngrx/store';

import { instrumentsSettings } from './instruments.actions';

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
    textColor: '#707070',
    show: ['altitudeM', 'gndM'] as (
      | 'altitudeM'
      | 'gndM'
      | 'altitudeFt'
      | 'gndFt'
    )[],
  },
};

export const instrumentsFeature = createFeature({
  name: 'settings.instruments',
  reducer: createReducer(
    initialState,
    on(
      instrumentsSettings.speedMeterWidgetPositionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        speedMeter: { ...state.speedMeter, position },
      })
    ),
    on(
      instrumentsSettings.speedMeterWidgetColorsChanged,
      (state, { colorsBySpeed }): typeof initialState => ({
        ...state,
        speedMeter: { ...state.speedMeter, colorsBySpeed },
      })
    ),
    on(
      instrumentsSettings.variometerWidgetPositionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        varioMeter: { ...state.varioMeter, position },
      })
    ),
    on(
      instrumentsSettings.variometerWidgetColorsChanged,
      (state, { colorsByClimbingSpeed }): typeof initialState => ({
        ...state,
        varioMeter: {
          ...state.varioMeter,
          colorsByClimbing: colorsByClimbingSpeed,
        },
      })
    ),
    on(
      instrumentsSettings.variometerDiffTimeChanged,
      (state, { diffTime }): typeof initialState => ({
        ...state,
        varioMeter: {
          ...state.varioMeter,
          diffTime,
        },
      })
    ),
    on(
      instrumentsSettings.altimeterWidgetPositionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, position },
      })
    ),
    on(
      instrumentsSettings.altimeterGndFromAltitudeMethodChanged,
      (state, { method }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, method },
      })
    ),
    on(
      instrumentsSettings.altimeterManualGndAltitudeChanged,
      (state, { gndAltitude }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, gndAltitude },
      })
    ),
    on(
      instrumentsSettings.altimeterBgColorChanged,
      (state, { bgColor }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, bgColor },
      })
    ),
    on(
      instrumentsSettings.altimeterTextColorChanged,
      (state, { textColor }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, textColor },
      })
    ),
    on(
      instrumentsSettings.altimeterShowTypeChanged,
      (state, { show }): typeof initialState => ({
        ...state,
        altimeter: { ...state.altimeter, show },
      })
    ),
    on(
      instrumentsSettings.showOnlyOnActiveGps,
      (state, { showOnlyOnActiveGps }): typeof initialState => ({
        ...state,
        showOnlyOnActiveGps,
      })
    )
  ),
});
