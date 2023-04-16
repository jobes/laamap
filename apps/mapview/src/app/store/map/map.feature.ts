import {
  MemoizedSelector,
  createFeature,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { LngLatLike } from 'maplibre-gl';

import { instrumentsFeature } from '../settings/instruments/instruments.feature';
import { navigationSettingsFeature } from '../settings/navigation/navigation.feature';
import { mapActions } from './map.actions';

const initialState = {
  compassHeading: 0,
  geoLocation: null as GeolocationPosition | null,
  center: [0, 0] as LngLatLike,
  bearing: 0,
  loaded: false,
  geoLocationTrackingStarting: false,
  geoLocationTrackingActive: false,
  trackSaving: false,
};

export const mapFeature = createFeature({
  name: 'map',
  reducer: createReducer(
    initialState,
    on(mapActions.loaded, (state): typeof initialState => ({
      ...state,
      loaded: true,
    })),
    on(
      mapActions.geolocationChanged,
      (state, { geoLocation }): typeof initialState => ({
        ...state,
        geoLocation,
      })
    ),
    on(
      mapActions.compassHeadingChanged,
      (state, { heading }): typeof initialState => ({
        ...state,
        compassHeading: heading,
      })
    ),
    on(mapActions.moved, (state, { center }): typeof initialState => ({
      ...state,
      center,
    })),
    on(mapActions.rotated, (state, { bearing }): typeof initialState => ({
      ...state,
      bearing,
    })),
    on(mapActions.geolocationTrackingStaring, (state): typeof initialState => ({
      ...state,
      geoLocationTrackingStarting: true,
      geoLocationTrackingActive: true,
    })),
    on(mapActions.geolocationTrackingRunning, (state): typeof initialState => ({
      ...state,
      geoLocationTrackingStarting: false,
    })),
    on(mapActions.geolocationTrackingEnded, (state): typeof initialState => ({
      ...state,
      geoLocationTrackingStarting: false,
      geoLocationTrackingActive: false,
    })),
    on(mapActions.trackSavingStarted, (state): typeof initialState => ({
      ...state,
      trackSaving: true,
    })),
    on(mapActions.trackSavingEnded, (state): typeof initialState => ({
      ...state,
      trackSaving: false,
    })),
    on(mapActions.gpsTimedOut, (state): typeof initialState => ({
      ...state,
      geoLocation: null,
    }))
  ),
  extraSelectors: ({ selectGeoLocation, selectGeoLocationTrackingActive }) => ({
    selectGpsHeading: createSelector(selectGeoLocation, (geoLocation) =>
      geoLocation?.coords.heading || geoLocation?.coords.heading === 0
        ? geoLocation?.coords.heading
        : null
    ),
    selectMinSpeedHit: createSelector(
      navigationSettingsFeature.selectMinActivationSpeedKpH,
      selectGeoLocation,
      (minSpeed, geolocation) =>
        minSpeed <= (geolocation?.coords.speed ?? 0) * 3.6
    ),
    selectShowInstruments: createSelector(
      instrumentsFeature.selectShowOnlyOnActiveGps,
      selectGeoLocationTrackingActive,
      (onlyOnActiveGps, trackingActive) => !onlyOnActiveGps || trackingActive
    ),
    selectHeading: null as unknown as MemoizedSelector<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Record<string, any>,
      number | null,
      (s1: number, s2: number | null, s3: boolean) => number | null
    >,
  }),
});

mapFeature.selectHeading = createSelector(
  mapFeature.selectCompassHeading,
  mapFeature.selectGpsHeading,
  mapFeature.selectMinSpeedHit,
  (compassHeading, gpsHeading, minSpeedHit) =>
    minSpeedHit ? gpsHeading : compassHeading
);
