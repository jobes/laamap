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
    clicked: props<{ lngLat: LngLatLike }>(),
    'double clicked': emptyProps(),
    'open bottom sheet': emptyProps(),
    'close bottom sheet': props<{ lngLat: LngLatLike }>(),
    'airport layer clicked': props<{ features: GeoJSON.Feature[] }>(),
    'airspace layer clicked': props<{ features: GeoJSON.Feature[] }>(),
    'notam layer clicked': props<{ features: GeoJSON.Feature[] }>(),
  },
});
