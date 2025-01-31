import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

export const mapEffectsActions = createActionGroup({
  source: 'Map effects',
  events: {
    'geolocation tracking running': props<{ following: boolean }>(),
    'track saving started': emptyProps(),
    'track saving ended': emptyProps(),
    'first geolocation fixed': props<{
      gndAltitude: number;
      gpsAltitudeError: number;
      qnh: number;
      qfe: number;
    }>(),
  },
});

export const navigationEffectsActions = createActionGroup({
  source: 'Navigation effects',
  events: {
    'Navigation failed': props<{ reason: 'NO_GPS' | 'NO_ROUTE' }>(),
    'Next point reached': emptyProps(),
    'Route initial loaded': props<{
      route: {
        point: LngLat;
        name: string;
      }[];
    }>(),
  },
});

export const bleSensorsEffectsActions = createActionGroup({
  source: 'Ble sensors effects',
  events: {
    'Pressure changed': props<{ value: number }>(),
    'Temperature changed': props<{ value: number }>(),
    'Connect device': props<{ deviceId: string }>(),
    'Device disconnected': emptyProps(),
  },
});

export const generalEffectsActions = createActionGroup({
  source: 'General effects',
  events: {
    'Automatic GND Altitude set': props<{ gndAltitude: number }>(),
    'automatic Gps Altitude Error Set': props<{ gpsAltitudeError: number }>(),
    'Automatic Qnh set': props<{ qnh: number }>(),
    'Automatic Qfe set': props<{ qfe: number }>(),
  },
});
