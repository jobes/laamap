import { createActionGroup, props } from '@ngrx/store';

export const instrumentsSettings = createActionGroup({
  source: 'Instrument settings',
  events: {
    'Speed Meter Widget Position Moved': props<{
      position: { x: number; y: number };
    }>(),
    'Speed Meter Widget Colors Changed': props<{
      colorsBySpeed: { minSpeed: number; bgColor: string; textColor: string }[];
    }>(),
    'Variometer Widget Position Moved': props<{
      position: { x: number; y: number };
    }>(),
    'Variometer Diff Time Changed': props<{
      diffTime: number;
    }>(),
    'Variometer Widget Colors Changed': props<{
      colorsByClimbingSpeed: {
        minClimbing: number;
        bgColor: string;
        textColor: string;
      }[];
    }>(),
    'Altimeter Widget Position Moved': props<{
      position: { x: number; y: number };
    }>(),
    'Altimeter Manual GND Altitude Changed': props<{
      gndAltitude: number;
    }>(),
    'Altimeter GND From Altitude Method Changed': props<{
      method: 'manual' | 'terrain';
    }>(),
    'Altimeter Bg Color Changed': props<{
      bgColor: string;
    }>(),
    'Altimeter text Color Changed': props<{
      textColor: string;
    }>(),
    'Altimeter Show Type Changed': props<{
      show: ('altitudeM' | 'gndM' | 'altitudeFt' | 'gndFt')[];
    }>(),
  },
});