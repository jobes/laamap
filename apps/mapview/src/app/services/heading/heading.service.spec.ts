import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { HeadingService } from './heading.service';

describe('HeadingService', () => {
  let service: HeadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(HeadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
