import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { mapActions } from '../../store/actions/map.actions';
import { MapEffects } from '../../store/effects/map.effects';
import { mapFeature } from '../../store/features/map.feature';
import { planeInstrumentsFeature } from '../../store/features/plane-instruments.feature';
import { generalFeature } from '../../store/features/settings/general.feature';
import { navigationSettingsFeature } from '../../store/features/settings/navigation.feature';
import { trafficFeature } from '../../store/features/settings/traffic.feature';
import { MapService } from '../map/map.service';
import { OnMapDirectionLineService } from '../map/on-map-direction-line/on-map-direction-line.service';
import { TracingService } from './tracing.service';

function geoLocationBySpeed(speed: number): GeolocationPosition {
  return {
    timestamp: new Date().getTime(),
    coords: {
      accuracy: 10,
      altitude: 300,
      altitudeAccuracy: null,
      heading: 45,
      latitude: 12,
      longitude: 14,
      speed: speed / 3.6,
    } as GeolocationPosition['coords'],
  } as GeolocationPosition;
}

describe('TracingService', () => {
  let tracingService: TracingService;
  let store: Store;
  let tracedItems: object[] = [];

  const dispatchGeolocationBySpeedEverySecond = (speed: number): void => {
    vi.advanceTimersByTime(1000);
    store.dispatch(
      mapActions.geolocationChanged({
        geoLocation: geoLocationBySpeed(speed),
        terrainElevation: 0,
      }),
    );
  };

  beforeEach(() => {
    let tracing = false;
    tracedItems = [];
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule, MatDialogModule],
      providers: [
        importProvidersFrom(
          StoreModule.forRoot({
            [mapFeature.name]: mapFeature.reducer,
            [navigationSettingsFeature.name]: navigationSettingsFeature.reducer,
            [generalFeature.name]: generalFeature.reducer,
            [planeInstrumentsFeature.name]: planeInstrumentsFeature.reducer,
            [trafficFeature.name]: trafficFeature.reducer,
          }),
          EffectsModule.forRoot([MapEffects]),
        ),
        { provide: MatBottomSheet, useValue: {} },
        { provide: OnMapDirectionLineService, useValue: {} },
        { provide: MapService, useValue: { instance: { _controls: [] } } },
        {
          provide: TracingService,
          useValue: {
            createFlyTrace: vi.fn().mockImplementation(() => {
              tracing = true;
              return of('name');
            }),
            endFlyTrace: vi.fn().mockImplementation(() => (tracing = false)),
            addTraceItem: vi.fn().mockImplementation((args) => {
              if (tracing) {
                tracedItems.push(args);
              }
              return of(5);
            }),
          },
        },
      ],
    });
    tracingService = TestBed.inject(TracingService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(tracingService).toBeTruthy();
    expect(store).toBeTruthy();
  });

  it('should not save route because of low speed', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01'));
    dispatchGeolocationBySpeedEverySecond(0);
    dispatchGeolocationBySpeedEverySecond(10);
    dispatchGeolocationBySpeedEverySecond(0);

    expect(tracedItems).toEqual([]);
  });

  it('should save one route', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01'));
    const initTime = new Date().getTime();
    dispatchGeolocationBySpeedEverySecond(0);
    dispatchGeolocationBySpeedEverySecond(10);
    dispatchGeolocationBySpeedEverySecond(20);
    dispatchGeolocationBySpeedEverySecond(100);
    dispatchGeolocationBySpeedEverySecond(120);
    dispatchGeolocationBySpeedEverySecond(100);
    dispatchGeolocationBySpeedEverySecond(120);
    dispatchGeolocationBySpeedEverySecond(100);
    dispatchGeolocationBySpeedEverySecond(20);

    expect(tracedItems).toEqual([
      initTime + 5000,
      initTime + 6000,
      initTime + 7000,
      initTime + 8000,
      initTime + 9000,
    ]);
  });
});
