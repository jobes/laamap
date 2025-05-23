import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideMockStore } from '@ngrx/store/testing';
import maplibregl from 'maplibre-gl';

import { GamepadHandlerService } from '../gamepad-handler/gamepad-handler.service';
import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [
        provideMockStore({}),
        { provide: SwUpdate, useValue: {} },
        { provide: GamepadHandlerService, useValue: { init: jest.fn() } },
      ],
    });
    const mockMapOn = jest.fn();
    jest.spyOn(maplibregl, 'Map').mockImplementation((() => {
      return {
        on: mockMapOn,
      };
    }) as unknown as undefined);

    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
