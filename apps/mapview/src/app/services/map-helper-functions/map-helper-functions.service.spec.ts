import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { MapService } from '../map/map.service';
import { MapHelperFunctionsService } from './map-helper-functions.service';

describe('MapHelperFunctionsService', () => {
  let service: MapHelperFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({}), { provide: MapService, useValue: {} }],
    });
    service = TestBed.inject(MapHelperFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
