import { createSelector } from '@ngrx/store';
import * as turf from '@turf/turf';
import { LngLat } from 'maplibre-gl';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../services/open-aip/airport.interfaces';
import { mapFeature } from './features/map.feature';
import { navigationFeature } from './features/navigation.feature';
import { instrumentsFeature } from './features/settings/instruments.feature';
import { navigationSettingsFeature } from './features/settings/navigation.feature';
import { terrainFeature } from './features/settings/terrain.feature';

export const selectOnMapTrackingState = createSelector(
  mapFeature.selectGeoLocation,
  mapFeature.selectHeading,
  navigationSettingsFeature.selectGpsTrackingInitZoom,
  navigationSettingsFeature.selectGpsTrackingInitPitch,
  (geoLocation, heading, zoom, pitch) => ({
    geoLocation,
    heading,
    zoom,
    pitch,
  }),
);

export const selectLineDefinitionSegmentGeoJson = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  navigationSettingsFeature.selectDirectionLineSegmentSeconds,
  navigationSettingsFeature.selectDirectionLineSegmentCount,
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
            geoLocation.coords.heading ?? 0,
          ).geometry.coordinates,
        ],
        [startPoint],
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
          [] as turf.Feature<turf.LineString>[],
        ),
      );
    }
    return null;
  },
);

export const selectLineDefinitionBorderGeoJson = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  navigationSettingsFeature.selectDirectionLineSegmentSeconds,
  navigationSettingsFeature.selectDirectionLineSegmentCount,
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
        geoLocation.coords.heading ?? 0,
      ).geometry.coordinates;
      return turf.featureCollection([turf.lineString([startPoint, endPoint])]);
    }
    return null;
  },
);

export const selectHeighSettings = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectAltimeter,
  terrainFeature['selectSettings.terrainState'],
  mapFeature.selectTerrainElevation,
  (geolocation, settings, terrain, terrainElevation) => ({
    bgColor: settings.bgColor,
    textColor: settings.textColor,
    altitudeMeters: geolocation?.coords.altitude,
    altitudeObject: {
      value: geolocation?.coords.altitude ?? 0,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.msl,
    },
    gndHeightObject: {
      value:
        terrain.enabled &&
        terrain.gndHeightCalculateUsingTerrain &&
        terrainElevation
          ? (geolocation?.coords.altitude ?? 0) -
            settings.gndAltitude -
            terrainElevation
          : (geolocation?.coords.altitude ?? 0) - settings.gndAltitude,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.gnd,
    },
    types: settings.show,
    position: settings.position,
    hasAltitude: !!geolocation,
    terrainElevation:
      terrain.enabled && terrain.gndHeightCalculateUsingTerrain
        ? terrainElevation ?? 0
        : 0,
  }),
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
  },
);

export const selectTrackInProgressWithMinSpeed = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectTrackSaving,
  (hitMinSpeed, trackSavingInProgress) => ({
    hitMinSpeed,
    trackSavingInProgress,
  }),
);

export const selectRouteNavigationStats = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  navigationFeature.selectRoute,
  (minSpeedHit, geoLocation, route) => {
    if (!geoLocation) return null;
    const pointPairs = [
      {
        point: new LngLat(
          geoLocation.coords.longitude,
          geoLocation.coords.latitude,
        ),
      },
      ...route,
    ].reduce(
      (acc, item, index, array) => {
        if (index === 0) return acc;
        return [
          ...acc,
          [array[index - 1].point, array[index].point] as [LngLat, LngLat],
        ];
      },
      [] as [LngLat, LngLat][],
    );
    const distanceList = pointPairs.map(([from, to]) =>
      turf.distance([from.lng, from.lat], [to.lng, to.lat]),
    );
    const durationList = minSpeedHit
      ? distanceList.map(
          (distance) => (1000 * distance) / (geoLocation?.coords.speed ?? 1),
        )
      : null;
    return { distanceList, durationList };
  },
);

export const selectNavigationStats = createSelector(
  selectRouteNavigationStats,
  (routeNavStats) => {
    if (!routeNavStats) return null;
    const distanceWithDuration = {
      distanceToNextPoint:
        routeNavStats.distanceList.length > 1
          ? routeNavStats.distanceList[0]
          : undefined,
      distanceToGoal: routeNavStats.distanceList.reduce(
        (acc, item) => acc + item,
        0,
      ),
      timeToNextPoint:
        (routeNavStats.durationList?.length ?? 0) > 1
          ? routeNavStats.durationList?.[0]
          : undefined,
      timeToGoal: routeNavStats.durationList?.reduce(
        (acc, item) => acc + item,
        0,
      ),
    };
    return {
      ...distanceWithDuration,
      arriveTimeToNextPoint: currentDateAddSeconds(
        distanceWithDuration.timeToNextPoint ?? 0,
      ),
      arriveTimeToGoal: currentDateAddSeconds(
        distanceWithDuration.timeToGoal ?? 0,
      ),
    };
  },
);

function currentDateAddSeconds(seconds: number): Date {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}
