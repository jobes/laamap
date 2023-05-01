import { createActionGroup, props } from '@ngrx/store';

export const altimeterWidgetActions = createActionGroup({
  source: 'Altimeter widget',
  events: {
    'Position moved': props<{
      position: { x: number; y: number };
    }>(),
    'Manual GND Altitude Changed': props<{
      gndAltitude: number;
    }>(),
  },
});

export const navigationWidgetActions = createActionGroup({
  source: 'Navigation widget',
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
