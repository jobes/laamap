import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLatLike } from 'maplibre-gl';

export const mapActions = createActionGroup({
  source: 'Map',
  events: {
    'compass heading changed': props<{ heading: number }>(),
    'geolocation changed': props<{ geoLocation: GeolocationPosition | null }>(),
    moved: props<{ center: LngLatLike }>(),
    rotated: props<{ bearing: number }>(),
    loaded: emptyProps(),
    'geolocation tracking staring': emptyProps(),
    'geolocation tracking running': emptyProps(),
    'geolocation tracking ended': emptyProps(),
    'track saving started': emptyProps(),
    'track saving ended': emptyProps(),
    'gps timed out': emptyProps(),
  },
});
