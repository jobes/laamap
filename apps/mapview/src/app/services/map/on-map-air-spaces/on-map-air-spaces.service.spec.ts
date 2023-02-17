import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { MapService } from '../map.service';
import { OnMapAirSpacesService } from './on-map-air-spaces.service';

describe('OnMapAirSpacesService', () => {
  let service: OnMapAirSpacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useValue: {} }],
      imports: [MatDialogModule],
    });
    service = TestBed.inject(OnMapAirSpacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
