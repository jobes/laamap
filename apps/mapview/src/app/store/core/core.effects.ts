import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  iif,
  interval,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { RainViewerService } from '../../services/rain-viewer.service';
import { rainViewersUrlsLoaded } from './core.actions';
import { selectRadar } from './core.selectors';

@Injectable()
export class CoreEffects {
  readonly radarReloadTime = 5 * 60 * 1000; // 5 minutes
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

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService
  ) {}
}
