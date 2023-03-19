import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  tap,
} from 'rxjs';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { selectScreenWakeLockEnabled } from './general.feature';

@Injectable()
export class GeneralEffects {
  private readonly visibilitySubj$ = fromEvent<DocumentVisibilityState>(
    document,
    'visibilitychange'
  ).pipe(
    map(() => document.visibilityState),
    startWith(document.visibilityState)
  );

  private readonly wakeLockEnabled$ = this.store
    .select(selectScreenWakeLockEnabled)
    .pipe(distinctUntilChanged());

  // eslint-disable-next-line @typescript-eslint/member-ordering
  screenWakeLock$ = createEffect(
    () => {
      return combineLatest([this.wakeLockEnabled$, this.visibilitySubj$]).pipe(
        debounceTime(1000),
        tap(([enabled, visibility]) => {
          if (enabled && visibility === 'visible') {
            this.screenWakeLockService.lock();
          } else {
            this.screenWakeLockService.release();
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly store: Store,
    private readonly screenWakeLockService: ScreenWakeLockService
  ) {}
}
