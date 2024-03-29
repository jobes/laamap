import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

import { MapService } from '../map/map.service';
import { CompassService } from './compass.service';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('CompassService', () => {
  let service: CompassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [
        provideMockStore({}),
        { provide: SwUpdate, useValue: {} },
        { provide: MapService, useValue: { geolocation$: new Subject() } },
      ],
    });
    service = TestBed.inject(CompassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
