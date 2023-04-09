import { createSelector } from '@ngrx/store';
import * as turf from '@turf/turf';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../services/open-aip/airport.interfaces';
import { mapFeature } from './map/map.feature';
import { instrumentsFeature } from './settings/instruments/instruments.feature';
import { navigationFeature } from './settings/navigation/navigation.feature';

export const selectOnMapTrackingState = createSelector(
  mapFeature.selectGeoLocation,
  mapFeature.selectHeading,
  navigationFeature.selectGpsTrackingInitZoom,
  navigationFeature.selectGpsTrackingInitPitch,
  (geoLocation, heading, zoom, pitch) => ({ geoLocation, heading, zoom, pitch })
);

export const selectLineDefinitionSegmentGeoJson = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  navigationFeature.selectDirectionLineSegmentSeconds,
  navigationFeature.selectDirectionLineSegmentCount,
  // eslint-disable-next-line max-lines-per-function
  (minSpeedHit, geoLocation, seconds, segmentCount) => {
    if (geoLocation && minSpeedHit) {
      const startPoint = [
        geoLocation.coords.longitude,
        geoLocation.coords.latitude,
      ];
      const distanceKm = ((geoLocation.coords.speed ?? 0) * seconds) / 1000;
      const pointList = Array.from(Array(segmentCount).keys()).reduce(
        (acc, index) => [
          ...acc,
          turf.destination(
            acc[index],
            distanceKm,
            geoLocation.coords.heading ?? 0
          ).geometry.coordinates,
        ],
        [startPoint]
      );

      return turf.featureCollection(
        pointList.reduce(
          (acc, point, index, array) =>
            index === 0
              ? acc
              : [
                  ...acc,
                  turf.lineString([array[index - 1], point], {
                    color: index % 2 ? 'white' : 'black',
                  }),
                ],
          [] as turf.Feature<turf.LineString>[]
        )
      );
    }
    return null;
  }
);

export const selectLineDefinitionBorderGeoJson = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  navigationFeature.selectDirectionLineSegmentSeconds,
  navigationFeature.selectDirectionLineSegmentCount,
  (minSpeedHit, geoLocation, seconds, segmentCount) => {
    if (geoLocation && minSpeedHit) {
      const distanceKm =
        ((geoLocation.coords.speed ?? 0) * seconds * segmentCount) / 1000;
      const startPoint = [
        geoLocation.coords.longitude,
        geoLocation.coords.latitude,
      ];
      const endPoint = turf.destination(
        startPoint,
        distanceKm,
        geoLocation.coords.heading ?? 0
      ).geometry.coordinates;
      return turf.featureCollection([turf.lineString([startPoint, endPoint])]);
    }
    return null;
  }
);

export const selectHeighSettings = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectAltimeter,
  (geolocation, settings) => ({
    bgColor: settings.bgColor,
    textColor: settings.textColor,
    altitudeMeters: geolocation?.coords.altitude,
    altitudeObject: {
      value: geolocation?.coords.altitude ?? 0,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.msl,
    },
    gndHeightObject: {
      value: (geolocation?.coords.altitude ?? 0) - settings.gndAltitude,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.gnd,
    },
    types: settings.show,
    position: settings.position,
    hasAltitude: !!geolocation,
  })
);

export const selectColorsBySpeed = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectSpeedMeter,
  (geoLocation, speedSettings) => {
    const speedKph = Math.round((geoLocation?.coords.speed ?? 0) * 3.6);
    const selectedSetting =
      [...speedSettings.colorsBySpeed]
        .reverse()
        .find((settings) => settings.minSpeed <= speedKph) ?? null;
    return {
      textColor: selectedSetting?.textColor || 'black',
      bgColor: selectedSetting?.bgColor || 'white',
      speedKph,
      position: speedSettings.position,
    };
  }
);

export const selectTrackInProgressWithMinSpeed = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectTrackSaving,
  (hitMinSpeed, trackSavingInProgress) => ({
    hitMinSpeed,
    trackSavingInProgress,
  })
);
