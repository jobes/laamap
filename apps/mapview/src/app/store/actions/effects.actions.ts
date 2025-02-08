import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { BleCharacteristicNames } from '../features/ble-sensors.initial-state';

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
    'Connect device': props<{ deviceId: string }>(),
    'Device disconnected': emptyProps(),
    'Characteristic data changed': props<{
      characteristicName: BleCharacteristicNames;
      value: number | string | undefined;
    }>(),
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
