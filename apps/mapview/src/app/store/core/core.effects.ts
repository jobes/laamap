/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  iif,
  interval,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { RainViewerService } from '../../services/rain-viewer.service';
import { ScreenWakeLockService } from '../../services/screen-wake-lock/screen-wake-lock.service';
import { rainViewersUrlsLoaded } from './core.actions';
import { selectRadar, selectScreenWakeLockEnabled } from './core.selectors';

@Injectable()
export class CoreEffects {
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

  private readonly radarReloadTime = 5 * 60 * 1000; // 5 minutes

  radarUrls$ = createEffect(() => {
    return this.store.select(selectRadar).pipe(
      map((radar) => radar.enabled),
      distinctUntilChanged(),
      switchMap((enabled) =>
        iif(
          () => enabled,
          interval(this.radarReloadTime).pipe(startWith(0)),
          of(false)
        )
      ),
      filter((val) => val !== false),
      switchMap(() => this.rainViewer.getUrls$()),
      map((data) => rainViewersUrlsLoaded({ data }))
    );
  });

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
    private readonly rainViewer: RainViewerService,
    private readonly screenWakeLockService: ScreenWakeLockService
  ) {}
}
