import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { ScreenWakeLockService } from './screen-wake-lock.service';

describe('ScreenWakeLockService', () => {
  let service: ScreenWakeLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, TranslocoTestingModule],
    });
    service = TestBed.inject(ScreenWakeLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
