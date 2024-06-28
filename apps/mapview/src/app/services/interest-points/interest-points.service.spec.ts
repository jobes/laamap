import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { DexieSyncService } from '../../database/synced-db.service';
import { MapService } from '../map/map.service';
import { InterestPointsService } from './interest-points.service';

describe('InterestPointsService', () => {
  let service: InterestPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MapService, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: DexieSyncService, useValue: { changes$: new Subject() } },
      ],
    });
    service = TestBed.inject(InterestPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
