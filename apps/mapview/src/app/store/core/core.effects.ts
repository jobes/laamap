/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  fromEvent,
  iif,
  interval,
  map,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { HeadingService } from '../../services/heading/heading.service';
import { MapService } from '../../services/map/map.service';
import { OnMapAirSpacesService } from '../../services/map/on-map-air-spaces/on-map-air-spaces.service';
import { OnMapAirportsService } from '../../services/map/on-map-airports/on-map-airports.service';
import { OnMapNotamsService } from '../../services/map/on-map-notams/on-map-notams.service';
import { NotamsService } from '../../services/notams/notams.service';
import { OpenAipService } from '../../services/open-aip/open-aip.service';
import { RainViewerService } from '../../services/rain-viewer/rain-viewer.service';
import { ScreenWakeLockService } from '../../services/screen-wake-lock/screen-wake-lock.service';
import { rainViewersUrlsLoaded } from './core.actions';
import {
  selectAirspacesSettings,
  selectNonHiddenNotams,
  selectRadar,
  selectScreenWakeLockEnabled,
} from './core.selectors';

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

  heading$ = createEffect(
    () => {
      return this.headingService.heading$.pipe(
        tap((heading) =>
          document.documentElement.style.setProperty('--heading', `${heading}`)
        )
      );
    },
    { dispatch: false }
  );

  loadAirSpaces$ = createEffect(
    () => {
      return this.mapService.loaded$.pipe(
        filter((loaded) => loaded),
        switchMap(() => this.openAip.getAirSpaces$()),
        tap((geojson) => this.onMapAirSpacesService.createLayers(geojson)),
        switchMap(() => this.store.select(selectAirspacesSettings)),
        tap((settings) => this.onMapAirSpacesService.reloadSettings(settings))
      );
    },
    { dispatch: false }
  );

  loadAirports$ = createEffect(
    () => {
      return this.mapService.loaded$.pipe(
        filter((loaded) => loaded),
        switchMap(() =>
          forkJoin([
            this.openAip.getAirports$(),
            this.onMapAirportsService.addRequiredImages$(),
          ])
        ),
        tap(([geojson]) => this.onMapAirportsService.createLayers(geojson))
      );
    },
    { dispatch: false }
  );

  showFirstPositionNotams$ = createEffect(
    () => {
      return this.mapService.loaded$.pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNotamsService.createLayers()),
        switchMap(() => this.mapService.geolocation$),
        filter((event): event is NonNullable<typeof event> => !!event),
        take(1),
        switchMap((event) =>
          this.notams
            .aroundPointWithCodes$(
              new LngLat(event.coords.longitude, event.coords.latitude),
              100000, // 100km radius
              ['LZBB']
            )
            .pipe(map((notams) => this.notams.notamsToGeoJson(notams)))
        ),
        switchMap((notams) => this.store.select(selectNonHiddenNotams(notams))),
        tap((geojson) => this.onMapNotamsService.setNotamsGeoJson(geojson))
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService,
    private readonly screenWakeLockService: ScreenWakeLockService,
    private readonly headingService: HeadingService,
    private readonly mapService: MapService,
    private readonly openAip: OpenAipService,
    private readonly onMapAirSpacesService: OnMapAirSpacesService,
    private readonly onMapAirportsService: OnMapAirportsService,
    private readonly onMapNotamsService: OnMapNotamsService,
    private readonly notams: NotamsService
  ) {}
}
