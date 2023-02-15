import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { DataBusService } from './data-bus.service';

describe('DataBusService', () => {
  let service: DataBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(DataBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
