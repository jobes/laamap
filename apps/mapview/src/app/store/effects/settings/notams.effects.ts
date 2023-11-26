import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import { filter, map, merge, switchMap, take, tap } from 'rxjs';

import { OnMapNotamsService } from '../../../services/map/on-map-notams/on-map-notams.service';
import { NotamsService } from '../../../services/notams/notams.service';
import { mapFeature } from '../../features/map.feature';
import { notamsFeature } from '../../features/settings/notams.feature';
import { generalFeature } from '../../features/settings/general.feature';

@Injectable()
export class NotamsSettingsEffects {
  loadFirNotams$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        tap(() => this.onMapNotamsService.createLayers()),
        switchMap(() =>
          merge(
            this.store.select(generalFeature.selectNotamFirs).pipe(
              // don't load empty FIR notams, but clear them when turned off
              filter((val, index) => val.length !== 0 || index !== 0),
              switchMap((firs) => this.notams.loadFirNotams$(firs)),
            ),
            this.store.select(mapFeature.selectGeoLocation).pipe(
              filter((event): event is NonNullable<typeof event> => !!event),
              take(1),
              switchMap((event) =>
                this.notams.loadAroundPointNotams$(
                  new LngLat(event.coords.longitude, event.coords.latitude),
                  50000, // 50km radius
                ),
              ),
            ),
          ),
        ),
        map(() => this.notams.notamsToGeoJson(this.notams.getCachedNotams())),
        switchMap((notams) =>
          this.store.select(notamsFeature.selectNonHiddenNotams(notams)),
        ),
        tap((geojson) => this.onMapNotamsService.setNotamsGeoJson(geojson)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly store: Store,
    private readonly onMapNotamsService: OnMapNotamsService,
    private readonly notams: NotamsService,
  ) {}
}
