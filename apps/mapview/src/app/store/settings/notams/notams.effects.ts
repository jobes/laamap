import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import { filter, map, switchMap, take, tap } from 'rxjs';

import { OnMapNotamsService } from '../../../services/map/on-map-notams/on-map-notams.service';
import { NotamsService } from '../../../services/notams/notams.service';
import { mapFeature } from '../../map/map.feature';
import { notamsFeature } from './notams.feature';

@Injectable()
export class NotamsSettingsEffects {
  showFirstPositionNotams$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNotamsService.createLayers()),
        switchMap(() => this.store.select(mapFeature.selectGeoLocation)),
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
        switchMap((notams) =>
          this.store.select(notamsFeature.selectNonHiddenNotams(notams))
        ),
        tap((geojson) => this.onMapNotamsService.setNotamsGeoJson(geojson))
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly store: Store,
    private readonly onMapNotamsService: OnMapNotamsService,
    private readonly notams: NotamsService
  ) {}
}
