import { TestBed } from '@angular/core/testing';

import { WidgetSafePositionService } from './widget-safe-position.service';

describe('WidgetSafePositionService', () => {
  let service: WidgetSafePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetSafePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
