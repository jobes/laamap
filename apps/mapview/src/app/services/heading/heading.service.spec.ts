import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

import { MapService } from '../map/map.service';
import { HeadingService } from './heading.service';

describe('HeadingService', () => {
  let service: HeadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({}),
        { provide: MapService, useValue: { geolocation$: new Subject() } },
      ],
    });
    service = TestBed.inject(HeadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
