import { TestBed } from '@angular/core/testing';

import { CustomFlyRoutesService } from './custom-fly-routes.service';

describe('CustomFlyRoutesService', () => {
  let service: CustomFlyRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFlyRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
