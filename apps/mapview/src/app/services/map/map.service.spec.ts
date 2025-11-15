import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideMockStore } from '@ngrx/store/testing';

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
        { provide: GamepadHandlerService, useValue: { init: vi.fn() } },
      ],
    });

    vi.mock('maplibre-gl', () => ({
      __esModule: true,
      Map: vi.fn().mockImplementation(function () {
        return {
          on: vi.fn(),
          remove: vi.fn(),
          addControl: vi.fn(),
          _getUIString: vi.fn(),
        };
      }),
      GeolocateControl: vi.fn().mockImplementation(function () {
        return {
          on: vi.fn(),
        };
      }),
      NavigationControl: vi.fn().mockImplementation(function () {
        return {
          _zoomInButton: {
            cloneNode: vi.fn().mockReturnValue({ addEventListener: vi.fn() }),
            replaceWith: vi.fn(),
          },
          _zoomOutButton: {
            cloneNode: vi.fn().mockReturnValue({ addEventListener: vi.fn() }),
            replaceWith: vi.fn(),
          },
          on: vi.fn(),
        };
      }),
      AttributionControl: vi.fn().mockImplementation(function () {
        return {
          on: vi.fn(),
        };
      }),
      ScaleControl: vi.fn().mockImplementation(function () {
        return {
          on: vi.fn(),
        };
      }),
      LngLat: vi.fn().mockImplementation(function () {
        return {};
      }),
    }));

    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
