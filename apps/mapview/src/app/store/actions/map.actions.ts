import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat, LngLatLike } from 'maplibre-gl';

export const mapActions = createActionGroup({
  source: 'Map',
  events: {
    'geolocation changed': props<{ geoLocation: GeolocationPosition | null }>(),
    moved: props<{ center: LngLatLike }>(),
    rotated: props<{ bearing: number }>(),
    loaded: emptyProps(),
    'geolocation tracking started': emptyProps(),
    'geolocation tracking ended': emptyProps(),
    clicked: props<{ lngLat: LngLatLike }>(),
    zoom: emptyProps(),
    'navigation clicked': emptyProps(),
    'settings clicked': emptyProps(),
  },
});

export const layerAirSpacesActions = createActionGroup({
  source: 'Layer airspaces',
  events: {
    clicked: props<{ features: GeoJSON.Feature[] }>(),
  },
});

export const layerAirportActions = createActionGroup({
  source: 'Layer airport',
  events: {
    clicked: props<{ features: GeoJSON.Feature[] }>(),
  },
});

export const layerNotamsActions = createActionGroup({
  source: 'Layer notams',
  events: {
    clicked: props<{ features: GeoJSON.Feature[] }>(),
  },
});

export const layerInterestPointsActions = createActionGroup({
  source: 'Layer interest points',
  events: {
    clicked: props<{ features: GeoJSON.Feature[] }>(),
  },
});

export const compassActions = createActionGroup({
  source: 'Compass',
  events: {
    'heading changed': props<{ heading: number }>(),
  },
});

export const mapLocationMenuActions = createActionGroup({
  source: 'Map location menu',
  events: {
    'Started new route navigation': props<{ point: LngLat; name: string }>(),
    'Added point to navigation': props<{ point: LngLat; name: string }>(),
  },
});
