import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

export const mapEffectsActions = createActionGroup({
  source: 'Map effects',
  events: {
    'geolocation tracking running': emptyProps(),
    'track saving started': emptyProps(),
    'track saving ended': emptyProps(),
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
