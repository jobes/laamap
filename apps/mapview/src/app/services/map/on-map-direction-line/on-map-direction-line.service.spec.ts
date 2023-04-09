import { TestBed } from '@angular/core/testing';

import { MapService } from '../map.service';
import { OnMapDirectionLineService } from './on-map-direction-line.service';

describe('OnMapDirectionLineService', () => {
  let service: OnMapDirectionLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useValue: {} }],
    });
    service = TestBed.inject(OnMapDirectionLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
