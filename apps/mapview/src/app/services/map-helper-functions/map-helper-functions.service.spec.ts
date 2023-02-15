import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { MapHelperFunctionsService } from './map-helper-functions.service';

describe('MapHelperFunctionsService', () => {
  let service: MapHelperFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(MapHelperFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
