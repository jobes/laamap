import { TestBed } from '@angular/core/testing';

import { MapService } from '../map.service';
import { OnMapNavigationService } from './on-map-navigation.service';

describe('OnMapNavigationService', () => {
  let service: OnMapNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useValue: {} }],
    });
    service = TestBed.inject(OnMapNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
