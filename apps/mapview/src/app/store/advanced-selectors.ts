import { createSelector, select } from '@ngrx/store';
import * as turf from '@turf/turf';
import { Feature, LineString } from 'geojson';
import { LngLat } from 'maplibre-gl';
import { auditTime, map, pairwise, pipe, startWith } from 'rxjs';

import { altitudeFromPressure } from '../helper';
import {
  EHeightUnit,
  EReferenceDatum,
} from '../services/open-aip/airport.interfaces';
import { mapFeature } from './features/map.feature';
import { navigationFeature } from './features/navigation.feature';
import { planeInstrumentsFeature } from './features/plane-instruments.feature';
import { instrumentsFeature } from './features/settings/instruments.feature';
import { navigationSettingsFeature } from './features/settings/navigation.feature';
import { terrainFeature } from './features/settings/terrain.feature';

export const selectOnMapTrackingState = createSelector(
  mapFeature.selectGeoLocation,
  mapFeature.selectHeading,
  navigationSettingsFeature.selectGpsTrackingInitZoom,
  navigationSettingsFeature.selectGpsTrackingInitPitch,
  mapFeature.selectMinSpeedHit,
  (geoLocation, heading, zoom, pitch, minSpeedHit) => ({
    geoLocation,
    heading,
    zoom,
    pitch,
    minSpeedHit,
  }),
);

export const selectLineDefinitionSegmentGeoJson = createSelector(
  mapFeature.selectMinSpeedHit,
  mapFeature.selectGeoLocation,
  mapFeature.selectGeoLocationTrackingActive,
  navigationSettingsFeature.selectDirectionLineSegmentSeconds,
  navigationSettingsFeature.selectDirectionLineSegmentCount,
  (minSpeedHit, geoLocation, trackingActive, seconds, segmentCount) => {
    if (geoLocation && minSpeedHit && trackingActive) {
      const startPoint = [
        geoLocation.coords.longitude,
        geoLocation.coords.latitude,
      ];
      const distanceKm = ((geoLocation.coords.speed ?? 0) * seconds) / 1000; // GPS speed has to be used as this is for line on ground
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
          [] as Feature<LineString>[],
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
        ((geoLocation.coords.speed ?? 0) * seconds * segmentCount) / 1000; // GPS speed has to be used as this is for line on ground
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
  planeInstrumentsFeature.selectAirPressure,
  (geolocation, settings, terrain, terrainElevation, pressure) => ({
    bgColor: settings.bgColor,
    textColor: settings.textColor,
    altitudeMetersGps: geolocation?.coords.altitude,
    altitudeObjectGps: {
      value: (geolocation?.coords.altitude ?? 0) - settings.gpsAltitudeError,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.msl,
    },
    gndHeightObjectGps: {
      value:
        terrain.enabled &&
        terrain.gndHeightCalculateUsingTerrain &&
        terrainElevation
          ? (geolocation?.coords.altitude ?? 0) -
            settings.gpsAltitudeError -
            terrainElevation
          : (geolocation?.coords.altitude ?? 0) -
            settings.gndAltitude -
            settings.gpsAltitudeError,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.gnd,
    },
    altitudeObjectPressure: {
      realValue: !!(pressure && settings.qnh),
      value:
        (pressure &&
          settings.qnh &&
          altitudeFromPressure(pressure, settings.qnh)) ??
        0,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.msl,
    },
    gndHeightObjectPressure: {
      realValue: !!(pressure && settings.qfe),
      value:
        !pressure || !settings.qfe
          ? 0
          : terrain.enabled &&
              terrain.gndHeightCalculateUsingTerrain &&
              terrainElevation &&
              settings.qnh
            ? altitudeFromPressure(pressure, settings.qnh) - terrainElevation
            : altitudeFromPressure(pressure, settings.qfe),
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.gnd,
    },
    types: settings.show,
    position: settings.position,
    terrainElevation,
  }),
);

export const selectColorsBySpeed = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectSpeedMeter,
  planeInstrumentsFeature.selectConnected,
  planeInstrumentsFeature.selectIas,
  (geoLocation, speedSettings, isConnected, ias) => {
    const speedKph = Math.round(
      ((isConnected && ias !== null && ias !== undefined
        ? ias
        : geoLocation?.coords.speed) ?? 0) * 3.6,
    );
    const selectedSetting =
      [...speedSettings.colorsBySpeed]
        .reverse()
        .find((settings) => settings.minSpeed <= speedKph) ?? null;
    return {
      textColor: selectedSetting?.textColor || 'black',
      bgColor: selectedSetting?.bgColor || 'white',
      groundSpeed:
        (geoLocation?.coords.speed ?? 0) > 2
          ? (geoLocation?.coords.speed ?? 0)
          : 0,
      airSpeed: isConnected && (ias ?? 0) > 2 ? (ias ?? 0) : 0,
      position: speedSettings.position,
      selectedSources: speedSettings.selectedSources,
      instrumentIasConnected: isConnected && ias != null,
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
  navigationSettingsFeature.selectAverageSpeed,
  (minSpeedHit, geoLocation, route, averageSpeed) => {
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
          (distance) => (1000 * distance) / (geoLocation?.coords.speed ?? 1), // GPS speed has to be used as this is for ground speed
        )
      : distanceList.map(
          (distance) => (1000 * distance) / (averageSpeed / 3.6),
        );
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

export const altitude = createSelector(
  instrumentsFeature.selectVarioMeter,
  instrumentsFeature.selectAltimeter,
  planeInstrumentsFeature.selectAirPressure,
  mapFeature.selectGeoLocation,
  (varioSetting, altimeterSettings, pressure, location) =>
    varioSetting.source === 'pressure' && pressure && altimeterSettings.qnh
      ? {
          altitude: altitudeFromPressure(pressure ?? 0, altimeterSettings.qnh),
          timestamp: new Date().getTime(),
        }
      : {
          altitude: location?.coords.altitude,
          timestamp: location?.timestamp ?? new Date().getTime(),
        },
);

export const climbingSpeedMs = (diffTime: number) => {
  return pipe(
    select(altitude),
    auditTime(diffTime),
    startWith(null),
    startWith(null),
    pairwise(),
    map(([prev, curr]) =>
      (curr?.altitude || curr?.altitude === 0) &&
      (prev?.altitude || prev?.altitude === 0)
        ? {
            altDiff: curr.altitude - prev.altitude,
            timeDiff: curr.timestamp - prev.timestamp,
          }
        : null,
    ),
    map((diffs) =>
      diffs !== null ? (diffs.altDiff * 1000) / diffs.timeDiff : null,
    ),
  );
};

export const colorsByClimbing = (settings: {
  diffTime: number;
  colorsByClimbing: {
    minClimbing: number;
    bgColor: string;
    textColor: string;
  }[];
}) => {
  return pipe(
    climbingSpeedMs(settings.diffTime),
    map(
      (climbingSpeed) =>
        [
          [...settings.colorsByClimbing]
            .reverse()
            .find((setting) => setting.minClimbing <= (climbingSpeed ?? 0)) ??
            null,
          climbingSpeed,
        ] as const,
    ),
    map(([settings, climbingSpeed]) => ({
      bgColor: settings?.bgColor || 'white',
      textColor: settings?.textColor || 'black',
      climbingSpeed,
    })),
  );
};

function currentDateAddSeconds(seconds: number): Date {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}
