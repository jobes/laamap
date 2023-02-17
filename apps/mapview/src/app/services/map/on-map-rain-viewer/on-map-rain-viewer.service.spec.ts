import { TestBed } from '@angular/core/testing';

import { RainViewerService } from '../../rain-viewer/rain-viewer.service';
import { MapService } from '../map.service';
import { OnMapRainViewerService } from './on-map-rain-viewer.service';

describe('OnMapRainViewerService', () => {
  let service: OnMapRainViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MapService, useValue: {} },
        { provide: RainViewerService, useValue: {} },
      ],
    });
    service = TestBed.inject(OnMapRainViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
