import { TestBed } from '@angular/core/testing';

import { MapFontSizeService } from './map-font-size.service';

describe('MapFontSizeService', () => {
  let service: MapFontSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapFontSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
