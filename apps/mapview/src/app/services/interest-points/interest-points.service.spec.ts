import { TestBed } from '@angular/core/testing';

import { InterestPointsService } from './interest-points.service';

describe('InterestPointsService', () => {
  let service: InterestPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterestPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
