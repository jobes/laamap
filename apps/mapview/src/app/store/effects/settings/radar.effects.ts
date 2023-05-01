import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  iif,
  interval,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { OnMapRainViewerService } from '../../../services/map/on-map-rain-viewer/on-map-rain-viewer.service';
import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { mapFeature } from '../../features/map.feature';
import { radarFeature } from '../../features/settings/radar.feature';

@Injectable()
export class RadarSettingsEffects {
  showRainViewer$ = createEffect(
    // eslint-disable-next-line max-lines-per-function
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        switchMap(() => this.store.select(radarFeature.selectEnabled)),
        distinctUntilChanged(),
        switchMap((enabled) =>
          iif(
            () => enabled,
            interval(this.radarReloadTime).pipe(
              startWith(0),

              switchMap(() =>
                combineLatest({
                  // eslint-disable-next-line rxjs/finnish
                  urls: this.rainViewer.getUrls$(),
                  // eslint-disable-next-line rxjs/finnish
                  settings: this.store.select(
                    radarFeature['selectSettings.radarState']
                  ),
                }).pipe(debounceTime(1000))
              )
            ),
            of(undefined)
          )
        ),

        tap((urlsWithSettings) =>
          this.onMapRainViewerService.createLayers(urlsWithSettings)
        )
      );
    },
    { dispatch: false }
  );

  rainViewerAnimation$ = createEffect(
    () => {
      return this.rainViewer.currentAnimationFrame$.pipe(
        concatLatestFrom(() =>
          this.store.select(radarFeature['selectSettings.radarState'])
        ),
        tap(([{ frameNum }, settings]) =>
          this.onMapRainViewerService.showFrame(frameNum, settings.opacity)
        )
      );
    },
    { dispatch: false }
  );

  private readonly radarReloadTime = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService,
    private readonly onMapRainViewerService: OnMapRainViewerService
  ) {}
}
