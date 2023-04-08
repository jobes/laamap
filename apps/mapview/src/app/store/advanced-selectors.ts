import { createSelector } from '@ngrx/store';

import { MapHelperFunctionsService } from '../services/map-helper-functions/map-helper-functions.service';
import { MapService } from '../services/map/map.service';
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

export const selectLineDefinition = (
  mapService: MapService,
  mapHelperFunctionsService: MapHelperFunctionsService
) =>
  createSelector(
    mapFeature.selectMinSpeedHit,
    mapFeature.selectGeoLocation,
    navigationFeature.selectDirectionLineSegmentSeconds,
    navigationFeature.selectDirectionLineSegmentCount,
    (enabled, geolocation, segmentInSeconds, segmentCount) =>
      !enabled ||
      !geolocation?.coords.longitude ||
      !geolocation?.coords.latitude
        ? null
        : {
            segmentSize: mapHelperFunctionsService.metersToPixels(
              (geolocation.coords.speed ?? 0) * segmentInSeconds
            ),
            segmentsArray: Array.from(Array(segmentCount).keys()),
            heading: geolocation.coords.heading,
            currentPxPosition: mapService.instance.project([
              geolocation.coords.longitude,
              geolocation.coords.latitude,
            ]),
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
