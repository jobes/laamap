import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MapService } from '../../../services/map/map.service';
import { mapActions } from '../../actions/map.actions';
import { terrainFeature } from '../../features/settings/terrain.feature';

@Injectable()
export class TerrainEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly mapService = inject(MapService);
  loadTerrain$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() =>
          this.store.select(terrainFeature['selectSettings.terrainState']),
        ),
        filter((state) => state.enabled),
        tap((state) => {
          if (!this.mapService.instance.terrain) {
            this.mapService.instance
              .addSource('terrainSource', {
                type: 'raster-dem',
                url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${environment.mapTilesKey}`,
                tileSize: 256,
              })
              .setTerrain({
                source: 'terrainSource',
              });
          }
          this.mapService.instance.terrain.exaggeration = state.exaggeration;
        }),
      );
    },
    { dispatch: false },
  );

  removeTerrain$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() =>
          this.store.select(terrainFeature['selectSettings.terrainState']),
        ),
        filter((state) => !state.enabled && !!this.mapService.instance.terrain),
        tap(() => {
          this.mapService.instance
            .setTerrain(null)
            .removeSource('terrainSource');
        }),
      );
    },
    { dispatch: false },
  );
}
