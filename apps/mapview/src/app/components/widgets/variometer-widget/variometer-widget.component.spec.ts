/* eslint-disable max-statements */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { provideTranslocoLocale } from '@ngneat/transloco-locale';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, of, takeUntil, toArray } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { VariometerWidgetComponent } from './variometer-widget.component';

jest.useFakeTimers();
describe('VariometerWidgetComponent', () => {
  let component: VariometerWidgetComponent;
  let fixture: ComponentFixture<VariometerWidgetComponent>;
  const initialState = {
    'settings.instruments': {
      varioMeter: { diffTime: 1000, colorsByClimbing: [] },
    },
  };

  const altitudeToStore = (altitude: number, timestamp: number) => ({
    ...initialState,
    map: { geoLocation: { coords: { altitude }, timestamp } },
  });

  const altitudeDiffTestCreator = (
    diffTime: number,
    stepTime: number,
    altitudeDiff: number,
    steps: number,
    result: (number | null)[],
    done: jest.DoneCallback,
    initAltitude = 1000,
    initTime = 1234567890,
  ) => {
    initialState['settings.instruments'].varioMeter.diffTime = diffTime;
    const store = TestBed.inject(MockStore);
    const stop = new Subject<void>();

    component['climbingSpeedMs$']
      .pipe(takeUntil(stop), toArray())
      .subscribe((lastValue) => {
        expect(
          lastValue.map((num) =>
            num ? Math.round((num + Number.EPSILON) * 100) / 100 : num,
          ),
        ).toEqual(result);
        done();
      });

    for (let i = 0; i < steps; i++) {
      store.setState(
        altitudeToStore(
          initAltitude + i * altitudeDiff,
          initTime + i * stepTime,
        ),
      );
      jest.advanceTimersByTime(stepTime);
    }

    stop.next();
    stop.complete();
    jest.advanceTimersByTime(1);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VariometerWidgetComponent,
        TranslocoTestingModule.forRoot({ langs: {} }),
      ],
      providers: [
        provideTranslocoLocale({
          langToLocaleMapping: {
            en: 'en-US',
            sk: 'sk-SK',
          },
        }),
        provideMockStore({
          initialState,
        }),
        { provide: MapService, useValue: { geolocation$: of(null) } },
        {
          provide: WidgetSafePositionService,
          useValue: { safePosition$: () => of({ x: 0, y: 0 }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VariometerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get altitude diff for 1000ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      1000,
      10,
      10,
      [null, null, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      done,
    );
  });

  it('should get altitude diff for 500ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      500,
      5,
      20,
      [null, null, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      done,
    );
  });

  it('should get altitude diff for 30ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      30,
      0.3,
      350,
      [null, null, 10, 10, 10, 10, 10, 10, 10, 10, 10], // THIS IS WRONG as contains rounding
      done,
    );
  });

  it('should get altitude diff for 1500ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      1500,
      15,
      5,
      [null, null, 10, 10, 10, 10], // THIS IS WRONG
      done,
    );
  });

  it('should get altitude diff for 2000ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      2000,
      20,
      5,
      [null, null, 10, 10, 10, 10], // THIS IS WRONG
      done,
    );
  });

  it('should get altitude diff for 5000ms step and 1000ms diffTime', (done) => {
    altitudeDiffTestCreator(
      1000,
      5000,
      50,
      5,
      [null, null, 10, 10, 10, 10], // THIS IS WRONG
      done,
    );
  });
});
