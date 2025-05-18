import { createActionGroup, props } from '@ngrx/store';

import { PlaneInstrumentsBarKeys } from '../features/plane-instruments.initial-state';

export const altimeterWidgetActions = createActionGroup({
  source: 'Altimeter widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const navigationGoalWidgetActions = createActionGroup({
  source: 'Navigation goal widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const navigationNextPointWidgetActions = createActionGroup({
  source: 'Navigation next point widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const radarWidgetActions = createActionGroup({
  source: 'Radar widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const speedMeterWidgetActions = createActionGroup({
  source: 'Speed meter widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const aircraftBarInstrumentsWidgetActions = createActionGroup({
  source: 'Aircraft bar instrument widget',
  events: {
    'Position moved': props<{
      instrumentType: PlaneInstrumentsBarKeys;
      position: { x: number; y: number };
    }>(),
  },
});

export const radioWidgetActions = createActionGroup({
  source: 'Radio widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const trackingWidgetActions = createActionGroup({
  source: 'Tracking widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const varioMeterWidgetActions = createActionGroup({
  source: 'Vario meter widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const gamepadWidgetActions = createActionGroup({
  source: 'Gamepad widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});

export const compassWidgetActions = createActionGroup({
  source: 'Compass widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
  },
});
