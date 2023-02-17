import { TestBed } from '@angular/core/testing';

import { OnMapRainViewerService } from './on-map-rain-viewer.service';

describe('OnMapRainViewerService', () => {
  let service: OnMapRainViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnMapRainViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
