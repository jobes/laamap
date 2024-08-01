import { TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { Map } from 'maplibre-gl';
import { Observable, ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { gamepadInitialState } from '../../store/features/settings/gamepad.feature';
import { GamepadHandlerService } from './gamepad-handler.service';

describe('GamepadHandlerService', () => {
  let service: GamepadHandlerService;
  let testScheduler: TestScheduler;

  function makeReplay<T>(obs: Observable<T>): ReplaySubject<T> {
    const replay = new ReplaySubject<T>();
    obs.subscribe({
      next: (x) => replay.next(x),
      complete: () => replay.complete(),
      error: (x) => replay.error(x),
    });
    return replay;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { 'settings.gamepad': gamepadInitialState },
        }),
        {
          provide: MatDialog,
          useValue: { openDialogs: ['dialog'], closeAll: jest.fn() },
        },
        { provide: MatBottomSheet, useValue: { dismiss: jest.fn() } },
      ],
    });
    service = TestBed.inject(GamepadHandlerService);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map gamepad input to active buttons', () => {
    testScheduler.run(({ expectObservable }) => {
      const result = makeReplay(service.gamePadActive$);
      service['gamePadSubj$'].next([
        {
          axes: [0, 0.7, 0, 0],
          buttons: [
            { pressed: false, touched: false, value: 0 },
            { pressed: true, touched: false, value: 0.6 },
            { pressed: false, touched: false, value: 0 },
          ],
          id: 'test',
          index: 0,
          mapping: 'standard',
          timestamp: 1,
          connected: true,
          vibrationActuator: null as unknown as GamepadHapticActuator,
        },
      ]);
      service['gamePadSubj$'].next([
        {
          axes: [0, 0, 0, 0],
          buttons: [
            { pressed: true, touched: false, value: 0.3 },
            { pressed: true, touched: false, value: 0.6 },
            { pressed: false, touched: false, value: 0 },
          ],
          id: 'test',
          index: 0,
          mapping: 'standard',
          timestamp: 2,
          connected: true,
          vibrationActuator: null as unknown as GamepadHapticActuator,
        },
      ]);

      expectObservable(result).toBe('(ab)', {
        a: [
          {
            index: 0,
            buttons: {
              1: 0.6,
            },
            axes: {
              1: 0.7,
            },
          },
        ],
        b: [
          {
            index: 0,
            buttons: {
              0: 0.3,
              1: 0.6,
            },
            axes: {},
          },
        ],
      });
    });
  });

  it('close dialog using gamepad', (done) => {
    service.init(null as unknown as Map);
    service['gamePadSubj$'].next([
      {
        axes: [0, 0.7, 0, 0],
        buttons: [
          { pressed: false, touched: false, value: 0 },
          { pressed: false, touched: false, value: 0 },
          { pressed: false, touched: false, value: 0 },
          { pressed: false, touched: false, value: 0 },
        ],
        id: 'test',
        index: 0,
        mapping: 'standard',
        timestamp: 0,
        connected: true,
        vibrationActuator: null as unknown as GamepadHapticActuator,
      },
    ]);

    setTimeout(() => {
      service['gamePadSubj$'].next([
        {
          axes: [0, 0.7, 0, 0],
          buttons: [
            { pressed: false, touched: false, value: 0 },
            { pressed: false, touched: false, value: 0 },
            { pressed: false, touched: false, value: 0 },
            { pressed: true, touched: false, value: 1 },
          ],
          id: 'test',
          index: 0,
          mapping: 'standard',
          timestamp: 1,
          connected: true,
          vibrationActuator: null as unknown as GamepadHapticActuator,
        },
      ]);
      setTimeout(() => {
        expect(service['bottomSheet'].dismiss).toHaveBeenCalledTimes(1);
        expect(service['dialog'].closeAll).toHaveBeenCalledTimes(1);
        done();
      }, 50);
    }, 50);
  });
});
