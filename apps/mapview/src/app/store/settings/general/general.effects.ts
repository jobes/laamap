/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { mapActions } from '../../map/map.actions';
import { generalFeature } from './general.feature';

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
    .select(generalFeature.selectScreenWakeLockEnabled)
    .pipe(distinctUntilChanged());

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

  widgetFontSizeRation$ = createEffect(
    () => {
      return this.store.select(generalFeature.selectWidgetFontSizeRatio).pipe(
        tap((ratio) => {
          document.documentElement.style.setProperty(
            '--widget-font-size-ratio',
            `${ratio}`
          );
        })
      );
    },
    { dispatch: false }
  );

  mapFontSizeRation$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio)
        ),
        tap((ratio) => {
          this.mapService.setMapFontSizeRatio(ratio);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly mapService: MapService,
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly screenWakeLockService: ScreenWakeLockService
  ) {}
}
