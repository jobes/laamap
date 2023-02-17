import { TestBed } from '@angular/core/testing';

import { OnMapNotamsService } from './on-map-notams.service';

describe('OnMapNotamsService', () => {
  let service: OnMapNotamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnMapNotamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
