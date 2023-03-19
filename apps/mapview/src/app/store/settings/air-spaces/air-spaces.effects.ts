import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, forkJoin, switchMap, tap } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { OnMapAirSpacesService } from '../../../services/map/on-map-air-spaces/on-map-air-spaces.service';
import { OnMapAirportsService } from '../../../services/map/on-map-airports/on-map-airports.service';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { airSpacesFeature } from './air-spaces.feature';

@Injectable()
export class AirSpacesEffects {
  loadAirSpaces$ = createEffect(
    () => {
      return this.mapService.loaded$.pipe(
        filter((loaded) => loaded),
        switchMap(() => this.openAip.getAirSpaces$()),
        tap((geojson) => this.onMapAirSpacesService.createLayers(geojson)),
        switchMap(() =>
          this.store.select(airSpacesFeature['selectSettings.airSpacesState'])
        ),
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

  constructor(
    private readonly store: Store,
    private readonly mapService: MapService,
    private readonly openAip: OpenAipService,
    private readonly onMapAirSpacesService: OnMapAirSpacesService,
    private readonly onMapAirportsService: OnMapAirportsService
  ) {}
}
