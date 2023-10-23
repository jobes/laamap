import { TestBed } from '@angular/core/testing';

import { InterestPointsService } from './interest-points.service';
import { MapService } from '../map/map.service';
import { APP_BASE_HREF } from '@angular/common';

describe('InterestPointsService', () => {
  let service: InterestPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MapService, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    });
    service = TestBed.inject(InterestPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
