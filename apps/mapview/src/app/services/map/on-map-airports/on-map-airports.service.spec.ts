import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { MapService } from '../map.service';
import { OnMapAirportsService } from './on-map-airports.service';

describe('OnMapAirportsService', () => {
  let service: OnMapAirportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: MapService, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
        provideMockStore({}),
      ],
    });
    service = TestBed.inject(OnMapAirportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
