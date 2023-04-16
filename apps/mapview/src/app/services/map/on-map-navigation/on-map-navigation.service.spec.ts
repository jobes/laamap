import { TestBed } from '@angular/core/testing';

import { OnMapNavigationService } from './on-map-navigation.service';

describe('OnMapNavigationService', () => {
  let service: OnMapNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnMapNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
