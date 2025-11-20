import * as turf from '@turf/turf';
import { LngLat } from 'maplibre-gl';
import { Subject } from 'rxjs';

import {
  altitude,
  climbingSpeedMs,
  selectColorsBySpeed,
  selectHeighSettings,
  selectLineDefinitionBorderGeoJson,
  selectLineDefinitionSegmentGeoJson,
  selectNavigationStats,
  selectOnMapTrackingState,
  selectRouteNavigationStats,
  selectTrackInProgressWithMinSpeed,
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
      } as unknown as GeolocationPosition;
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
      } as unknown as GeolocationPosition;
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
      } as unknown as GeolocationPosition;

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
      } as unknown as GeolocationPosition;

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
      } as unknown as GeolocationPosition;

      const speedSettings = {
        position: { x: 0, y: 0 },
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'] as ('gps' | 'ias')[],
      };

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        false,
        null,
      );

      expect(result).toEqual({
        textColor: 'green',
        bgColor: 'yellow',
        position: { x: 0, y: 0 },
        airSpeed: 0,
        groundSpeed: 10,
        instrumentIasConnected: false,
        selectedSources: ['gps'],
      });
    });

    it('should return correct colors when instruments are connected, but no IAS', () => {
      const geoLocation = {
        coords: { speed: 10 }, // m/s => 36 km/h
      } as unknown as GeolocationPosition;

      const speedSettings = {
        position: { x: 0, y: 0 },
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'] as ('gps' | 'ias')[],
      };

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        true,
        null,
      );

      expect(result).toEqual({
        textColor: 'green',
        bgColor: 'yellow',
        position: { x: 0, y: 0 },
        airSpeed: 0,
        groundSpeed: 10,
        instrumentIasConnected: false,
        selectedSources: ['gps'],
      });
    });

    it('should return correct colors when instruments are connected with IAS', () => {
      const geoLocation = {
        coords: { speed: 10 }, // m/s => 36 km/h
      } as unknown as GeolocationPosition;

      const speedSettings = {
        position: { x: 0, y: 0 },
        colorsBySpeed: [
          { minSpeed: 0, textColor: 'black', bgColor: 'white' },
          { minSpeed: 30, textColor: 'green', bgColor: 'yellow' },
          { minSpeed: 50, textColor: 'red', bgColor: 'pink' },
        ],
        selectedSources: ['gps'] as ('gps' | 'ias')[],
      };

      const result = selectColorsBySpeed.projector(
        geoLocation,
        speedSettings,
        true,
        20,
      );

      expect(result).toEqual({
        textColor: 'red',
        bgColor: 'pink',
        position: {
          x: 0,
          y: 0,
        },
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
      } as GeolocationPosition;

      const route = [
        { point: new LngLat(0.01, 0.01), name: 'Point 1' },
        { point: new LngLat(0.02, 0.02), name: 'Point 2' },
      ];

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
      } as GeolocationPosition;
      const route = [{ point: new LngLat(0.01, 0.01), name: 'Point 1' }];

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
      const geolocation = { coords: { altitude: 1000 } } as GeolocationPosition;
      const altimeterSettings = {
        bgColor: 'black',
        textColor: 'white',
        gpsAltitudeError: 10,
        gndAltitude: 50,
        qnh: 1013,
        qfe: 1005,
        show: ['altitudeM', 'gndM'] as (
          | 'altitudeM'
          | 'gndM'
          | 'altitudeFt'
          | 'gndFt'
          | 'pressureAltitudeM'
          | 'pressureGndM'
          | 'pressureAltitudeFt'
          | 'pressureGndFt'
        )[],
        position: { x: 0, y: 0 },
        method: 'manual' as const,
      };
      const terrainSettings = {
        enabled: false,
        gndHeightCalculateUsingTerrain: false,
        exaggeration: 1,
      };
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
      const geolocation = { coords: { altitude: 500 } } as GeolocationPosition;
      const altimeterSettings = {
        bgColor: 'black',
        textColor: 'white',
        gpsAltitudeError: 0,
        gndAltitude: 0,
        qnh: 1013,
        qfe: 1005, // ignored as terrain changes this value changes as well
        show: [] as (
          | 'altitudeM'
          | 'gndM'
          | 'altitudeFt'
          | 'gndFt'
          | 'pressureAltitudeM'
          | 'pressureGndM'
          | 'pressureAltitudeFt'
          | 'pressureGndFt'
        )[],
        position: { x: 0, y: 0 },
        method: 'manual' as const,
      };
      const terrainSettings = {
        enabled: true,
        gndHeightCalculateUsingTerrain: true,
        exaggeration: 1,
      };
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
      };

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
  describe('selectTrackInProgressWithMinSpeed', () => {
    it('should return object with hitMinSpeed and trackSavingInProgress', () => {
      const result = selectTrackInProgressWithMinSpeed.projector(true, true);
      expect(result).toEqual({
        hitMinSpeed: true,
        trackSavingInProgress: true,
      });
    });
  });

  describe('altitude$', () => {
    it('should return GPS altitude when source is not pressure', () => {
      const varioSetting = { source: 'gps' as const } as Parameters<
        typeof altitude.projector
      >[0];
      const altimeterSettings = { qnh: 1013 } as Parameters<
        typeof altitude.projector
      >[1];
      const pressure = 101325;
      const location = {
        coords: { altitude: 123 },
        timestamp: 9999,
      } as GeolocationPosition;

      const result = altitude.projector(
        varioSetting,
        altimeterSettings,
        pressure,
        location,
      );

      expect(result).toEqual({
        altitude: 123,
        timestamp: 9999,
      });
    });

    it('should return GPS altitude when pressure is missing', () => {
      const varioSetting = { source: 'pressure' as const } as Parameters<
        typeof altitude.projector
      >[0];
      const altimeterSettings = { qnh: 1013 } as Parameters<
        typeof altitude.projector
      >[1];
      const pressure = null;
      const location = {
        coords: { altitude: 123 },
        timestamp: 9999,
      } as GeolocationPosition;

      const result = altitude.projector(
        varioSetting,
        altimeterSettings,
        pressure,
        location,
      );

      expect(result).toEqual({
        altitude: 123,
        timestamp: 9999,
      });
    });

    it('should return pressure altitude when source is pressure and data exists', () => {
      const varioSetting = { source: 'pressure' as const } as Parameters<
        typeof altitude.projector
      >[0];
      const altimeterSettings = { qnh: 1013 } as Parameters<
        typeof altitude.projector
      >[1];
      const pressure = 101300; // 1013 hPa
      const location = {
        coords: { altitude: 500 },
        timestamp: 1000,
      } as GeolocationPosition;

      const now = new Date().getTime();
      vi.useFakeTimers().setSystemTime(now);

      const result = altitude.projector(
        varioSetting,
        altimeterSettings,
        pressure,
        location,
      );

      // 1013 hPa at 1013 QNH is approx 0 altitude
      expect(result.altitude).toBeCloseTo(0, 0);
      expect(result.timestamp).toBe(now);
    });
  });
  describe('climbingSpeedMs', () => {
    it('should calculate climbing speed correctly (default 1000ms)', async () => {
      vi.useFakeTimers();
      const diffTime = 1000;
      const source$ = new Subject<Record<string, unknown>>();
      const results: (number | null)[] = [];

      source$.pipe(climbingSpeedMs(diffTime)).subscribe((val) => {
        results.push(val);
      });

      const createState = (alt: number, time: number) => ({
        'settings.instruments': {
          varioMeter: { source: 'gps' },
          altimeter: { qnh: 1013 },
        },
        planeInstruments: { airPressure: 101325 },
        map: {
          geoLocation: {
            coords: { altitude: alt },
            timestamp: time,
          },
        },
      });

      // Initial emission (t=0)
      expect(results.length).toBe(1);
      expect(results[0]).toBeNull();

      // Emit first state
      source$.next(createState(100, 10000));
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(2);
      expect(results[1]).toBeNull();

      // Emit second state
      source$.next(createState(110, 11000)); // 1s later, 10m higher
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(3);
      expect(results[2]).toBe(10);

      // Emit third state (descent)
      source$.next(createState(105, 12000)); // 1s later, 5m lower
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(4);
      expect(results[3]).toBe(-5);

      vi.useRealTimers();
    });

    it('should calculate climbing speed with 500ms diffTime', async () => {
      vi.useFakeTimers();
      const diffTime = 500;
      const source$ = new Subject<Record<string, unknown>>();
      const results: (number | null)[] = [];

      source$.pipe(climbingSpeedMs(diffTime)).subscribe((val) => {
        results.push(val);
      });

      const createState = (alt: number, time: number) => ({
        'settings.instruments': {
          varioMeter: { source: 'gps' },
          altimeter: { qnh: 1013 },
        },
        planeInstruments: { airPressure: 101325 },
        map: {
          geoLocation: {
            coords: { altitude: alt },
            timestamp: time,
          },
        },
      });

      // Initial emission
      expect(results.length).toBe(1);
      expect(results[0]).toBeNull();

      // Emit first state
      source$.next(createState(200, 1000));
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(2);
      expect(results[1]).toBeNull();

      // Emit second state (500ms later, 2m higher)
      // Speed = 2m / 0.5s = 4 m/s
      source$.next(createState(202, 1500));
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(3);
      expect(results[2]).toBe(4);

      vi.useRealTimers();
    });

    it('should calculate climbing speed with 2000ms diffTime', async () => {
      vi.useFakeTimers();
      const diffTime = 2000;
      const source$ = new Subject<Record<string, unknown>>();
      const results: (number | null)[] = [];

      source$.pipe(climbingSpeedMs(diffTime)).subscribe((val) => {
        results.push(val);
      });

      const createState = (alt: number, time: number) => ({
        'settings.instruments': {
          varioMeter: { source: 'gps' },
          altimeter: { qnh: 1013 },
        },
        planeInstruments: { airPressure: 101325 },
        map: {
          geoLocation: {
            coords: { altitude: alt },
            timestamp: time,
          },
        },
      });

      // Initial emission
      expect(results.length).toBe(1);
      expect(results[0]).toBeNull();

      // Emit first state
      source$.next(createState(500, 10000));
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(2);
      expect(results[1]).toBeNull();

      // Emit second state (2000ms later, 20m lower)
      // Speed = -20m / 2s = -10 m/s
      source$.next(createState(480, 12000));
      vi.advanceTimersByTime(diffTime);
      expect(results.length).toBe(3);
      expect(results[2]).toBe(-10);

      vi.useRealTimers();
    });
  });
});
