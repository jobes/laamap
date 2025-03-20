import {
  MemoizedSelector,
  createFeature,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { LngLatLike } from 'maplibre-gl';

import { mapEffectsActions } from '../actions/effects.actions';
import { compassActions, mapActions } from '../actions/map.actions';
import { instrumentsFeature } from './settings/instruments.feature';
import { navigationSettingsFeature } from './settings/navigation.feature';

const initialState = {
  compassHeading: 0,
  geoLocation: null as GeolocationPosition | null,
  terrainElevation: null as number | null,
  center: [0, 0] as LngLatLike,
  bearing: 0,
  loaded: false,
  geoLocationTrackingStarting: false,
  geoLocationTrackingActive: false,
  geoLocationFollowing: false,
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
      (state, { geoLocation, terrainElevation }): typeof initialState => ({
        ...state,
        geoLocation,
        terrainElevation,
      }),
    ),
    on(
      compassActions.headingChanged,
      (state, { heading }): typeof initialState => ({
        ...state,
        compassHeading: heading,
      }),
    ),
    on(mapActions.moved, (state, { center }): typeof initialState => ({
      ...state,
      center,
    })),
    on(mapActions.rotated, (state, { bearing }): typeof initialState => ({
      ...state,
      bearing,
    })),
    on(mapActions.geolocationTrackingStarted, (state): typeof initialState => ({
      ...state,
      geoLocationTrackingStarting: true,
      geoLocationTrackingActive: true,
      geoLocationFollowing: false,
    })),
    on(
      mapEffectsActions.geolocationTrackingRunning,
      (state, { following }): typeof initialState => ({
        ...state,
        geoLocationTrackingStarting: false,
        geoLocationFollowing: following,
      }),
    ),
    on(
      mapActions.geolocationTrackingEnded,
      (state, { background }): typeof initialState => ({
        ...state,
        geoLocationTrackingStarting: false,
        geoLocationTrackingActive: background
          ? state.geoLocationTrackingActive
          : false,
        geoLocationFollowing: false,
      }),
    ),
    on(mapEffectsActions.trackSavingStarted, (state): typeof initialState => ({
      ...state,
      trackSaving: true,
    })),
    on(mapEffectsActions.trackSavingEnded, (state): typeof initialState => ({
      ...state,
      trackSaving: false,
    })),
  ),
  extraSelectors: ({ selectGeoLocation, selectGeoLocationTrackingActive }) => ({
    selectGpsHeading: createSelector(selectGeoLocation, (geoLocation) =>
      geoLocation?.coords.heading || geoLocation?.coords.heading === 0
        ? geoLocation?.coords.heading
        : null,
    ),
    selectMinSpeedHit: createSelector(
      navigationSettingsFeature.selectMinActivationSpeedKpH,
      selectGeoLocation,
      (minSpeed, geolocation) =>
        minSpeed <= (geolocation?.coords.speed ?? 0) * 3.6,
    ),
    selectShowInstruments: createSelector(
      instrumentsFeature.selectShowOnlyOnActiveGps,
      selectGeoLocationTrackingActive,
      (onlyOnActiveGps, trackingActive) => !onlyOnActiveGps || trackingActive,
    ),
    selectHeading: null as unknown as MemoizedSelector<
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
    minSpeedHit ? gpsHeading : compassHeading,
);
