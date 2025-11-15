import * as turf from '@turf/turf';
import { LngLat } from 'maplibre-gl';

import {
  selectColorsBySpeed,
  selectHeighSettings,
  selectLineDefinitionBorderGeoJson,
  selectLineDefinitionSegmentGeoJson,
  selectNavigationStats,
  selectOnMapTrackingState,
  selectRouteNavigationStats,
} from './advanced-selectors';

describe('advanced-selectors', () => {
  describe('selectOnMapTrackingState', () => {
    it('should map incoming values into a single object', () => {
      const geoLocation = {
        coords: {
          latitude: 1,
          longitude: 2,
          speed: 3,
          heading: 4,
          altitude: 5,
        },
      } as any;
      const heading = 33;
      const zoom = 10;
      const pitch = 45;
      const minSpeedHit = true;

      const result = selectOnMapTrackingState.projector(
        geoLocation,
        heading,
        zoom,
        pitch,
        minSpeedHit,
      );

      expect(result).toEqual({
        geoLocation,
        heading,
        zoom,
        pitch,
        minSpeedHit,
      });
    });
  });

  describe('selectLineDefinitionSegmentGeoJson', () => {
    it('should return null when geoLocation is missing', () => {
      const result = selectLineDefinitionSegmentGeoJson.projector(
        true,
        null,
        1,
        5,
      );
      expect(result).toBeNull();
    });

    it('should return null when minSpeedHit is false', () => {
      const geoLocation = {
        coords: {
          latitude: 10,
          longitude: 20,
          speed: 30,
          heading: 0,
        },
      } as any;
      const result = selectLineDefinitionSegmentGeoJson.projector(
        false,
        geoLocation,
        1,
        5,
      );
      expect(result).toBeNull();
    });

    it('should build segment geojson feature collection', () => {
      const geoLocation = {
        coords: {
          latitude: 0,
          longitude: 0,
          speed: 10,
          heading: 0,
        },
      } as any;

      const result = selectLineDefinitionSegmentGeoJson.projector(
        true,
        geoLocation,
        1,
        3,
      );

      expect(result).not.toBeNull();

      result?.features.forEach((f) => {
        f.geometry.coordinates = f.geometry.coordinates.map((pt: number[]) => [
          Number(pt[0].toFixed(5)),
          Number(pt[1].toFixed(5)),
        ]);
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('selectLineDefinitionBorderGeoJson', () => {
    it('should return null when conditions not met', () => {
      const result = selectLineDefinitionBorderGeoJson.projector(
        false,
        null,
        1,
        3,
      );
      expect(result).toBeNull();
    });

    it('should build border geojson feature collection', () => {
      const geoLocation = {
        coords: {
          latitude: 0,
          longitude: 0,
          speed: 10,
          heading: 0,
        },
      } as any;

      const result = selectLineDefinitionBorderGeoJson.projector(
        true,
        geoLocation,
        1,
        3,
      );
      expect(result).not.toBeNull();

      const simplified = JSON.parse(JSON.stringify(result));
      simplified.features[0].geometry.coordinates =
        simplified.features[0].geometry.coordinates.map((pt: number[]) => [
          Number(pt[0].toFixed(5)),
          Number(pt[1].toFixed(5)),
        ]);

      expect(simplified).toMatchSnapshot();
    });
  });

  describe('selectColorsBySpeed', () => {
    it('should pick the correct color setting depending on current speed', () => {
      const geoLocation = {
        coords: { speed: 10 }, // m/s => 36 km/h
      } as any;

      const speedSettings = {
        position: 'top-left',
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'],
      } as any;

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        false,
        null,
      );

      expect(result).toEqual({
        textColor: 'green',
        bgColor: 'yellow',
        position: 'top-left',
        airSpeed: 0,
        groundSpeed: 10,
        instrumentIasConnected: false,
        selectedSources: ['gps'],
      });
    });

    it('should return correct colors when instruments are connected, but no IAS', () => {
      const geoLocation = {
        coords: { speed: 10 }, // m/s => 36 km/h
      } as any;

      const speedSettings = {
        position: 'top-left',
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'],
      } as any;

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        true,
        null,
      );

      expect(result).toEqual({
        textColor: 'green',
        bgColor: 'yellow',
        position: 'top-left',
        airSpeed: 0,
        groundSpeed: 10,
        instrumentIasConnected: false,
        selectedSources: ['gps'],
      });
    });

    it('should return correct colors when instruments are connected with IAS', () => {
      const geoLocation = {
        coords: { speed: 10 }, // m/s => 36 km/h
      } as any;

      const speedSettings = {
        position: 'top-left',
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'],
      } as any;

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        true,
        20,
      );

      expect(result).toEqual({
        textColor: 'red',
        bgColor: 'pink',
        position: 'top-left',
        airSpeed: 20,
        groundSpeed: 10,
        instrumentIasConnected: true,
        selectedSources: ['gps'],
      });
    });
  });

  describe('selectRouteNavigationStats', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return null when geoLocation is missing', () => {
      const result = selectRouteNavigationStats.projector(false, null, [], 50);
      expect(result).toBeNull();
    });

    it('should calculate distance and duration using current speed when minSpeedHit', () => {
      vi.mock('@turf/turf', { spy: true });
      turf.distance = vi.fn().mockReturnValueOnce(1).mockReturnValueOnce(2);

      const geoLocation = {
        coords: { longitude: 0, latitude: 0, speed: 10, heading: 0 },
      } as any;

      const route = [
        { point: new LngLat(0.01, 0.01) },
        { point: new LngLat(0.02, 0.02) },
      ] as any;

      const result = selectRouteNavigationStats.projector(
        true,
        geoLocation,
        route,
        80,
      );

      expect(turf.distance).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        distanceList: [1, 2],
        durationList: [100, 200],
      });
    });

    it('should calculate duration from averageSpeed when minSpeedHit is false', () => {
      vi.mock('@turf/turf', { spy: true });
      turf.distance = vi.fn().mockReturnValue(1);

      const geoLocation = {
        coords: { longitude: 0, latitude: 0, speed: 5 },
      } as any;
      const route = [{ point: new LngLat(0.01, 0.01) }] as any;

      const averageSpeedKph = 72; // -> 20 m/s
      const result = selectRouteNavigationStats.projector(
        false,
        geoLocation,
        route,
        averageSpeedKph,
      );

      expect(result).toEqual({
        distanceList: [1],
        durationList: [50],
      });
    });
  });

  describe('selectHeighSettings', () => {
    it('should compute GPS and pressure based altitude/gnd correctly without terrain', () => {
      const geolocation = { coords: { altitude: 1000 } } as any;
      const altimeterSettings = {
        bgColor: 'black',
        textColor: 'white',
        gpsAltitudeError: 10,
        gndAltitude: 50,
        qnh: 1013,
        qfe: 1005,
        show: ['gps', 'pressure'],
        position: 'top-right',
      } as any;
      const terrainSettings = { enabled: false } as any;
      const terrainElevation = 0;
      const pressure = 101000;

      const result = selectHeighSettings.projector(
        geolocation,
        altimeterSettings,
        terrainSettings,
        terrainElevation,
        pressure,
      );

      expect(result.altitudeObjectGps.value).toBe(990); // 1000-10
      expect(result.gndHeightObjectGps.value).toBe(940); // 1000-50-10
      expect(result.altitudeObjectPressure.value).toBe(25);
      expect(result.gndHeightObjectPressure.value).toBe(-42);
    });

    it('should use terrain elevation when enabled', () => {
      const geolocation = { coords: { altitude: 500 } } as any;
      const altimeterSettings = {
        bgColor: 'black',
        textColor: 'white',
        gpsAltitudeError: 0,
        gndAltitude: 0,
        qnh: 1013,
        qfe: 1005, // ignored as terrain changes this value changes as well
        show: [],
        position: 'bottom',
      } as any;
      const terrainSettings = {
        enabled: true,
        gndHeightCalculateUsingTerrain: true,
      } as any;
      const terrainElevation = 200;
      const pressure = 101000;

      const result = selectHeighSettings.projector(
        geolocation,
        altimeterSettings,
        terrainSettings,
        terrainElevation,
        pressure,
      );

      expect(result.altitudeObjectGps.value).toBe(500);
      expect(result.gndHeightObjectGps.value).toBe(500 - 200);
      expect(result.altitudeObjectPressure.value).toBe(25);
      expect(result.gndHeightObjectPressure.value).toBe(25 - 200);
    });
  });

  describe('selectNavigationStats', () => {
    it('should return null when routeNavStats is missing', () => {
      const result = selectNavigationStats.projector(null);
      expect(result).toBeNull();
    });

    it('should calculate aggregated distance and time as well as arrival times', () => {
      // Fake Date so that arrival times are deterministic
      const baseDate = new Date('2025-01-01T00:00:00Z');
      vi.useFakeTimers().setSystemTime(baseDate);

      const routeNavStats = {
        distanceList: [1, 2, 3],
        durationList: [10, 20, 30],
      } as any;

      const result = selectNavigationStats.projector(routeNavStats);

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        distanceToNextPoint: 1,
        distanceToGoal: 6,
        timeToNextPoint: 10,
        timeToGoal: 60,
      });

      // Arrival times should be baseDate + seconds difference
      expect(
        (result?.arriveTimeToNextPoint?.getTime() ?? 0) - baseDate.getTime(),
      ).toBe(10 * 1000);
      expect(
        (result?.arriveTimeToGoal?.getTime() ?? 0) - baseDate.getTime(),
      ).toBe(60 * 1000);
    });
  });
});
