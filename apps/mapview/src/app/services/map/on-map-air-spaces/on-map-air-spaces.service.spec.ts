import { TestBed } from '@angular/core/testing';

import { OnMapAirSpacesService } from './on-map-air-spaces.service';

describe('OnMapAirSpacesService', () => {
  let service: OnMapAirSpacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnMapAirSpacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
