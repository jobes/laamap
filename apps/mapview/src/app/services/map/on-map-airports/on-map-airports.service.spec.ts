import { TestBed } from '@angular/core/testing';

import { OnMapAirportsService } from './on-map-airports.service';

describe('OnMapAirportsService', () => {
  let service: OnMapAirportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnMapAirportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
