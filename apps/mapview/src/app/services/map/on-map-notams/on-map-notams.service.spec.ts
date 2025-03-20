import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { MapService } from '../map.service';
import { OnMapNotamsService } from './on-map-notams.service';

describe('OnMapNotamsService', () => {
  let service: OnMapNotamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        TranslocoTestingModule.forRoot({ langs: {} }),
      ],
      providers: [provideMockStore({}), { provide: MapService, useValue: {} }],
    });
    service = TestBed.inject(OnMapNotamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
