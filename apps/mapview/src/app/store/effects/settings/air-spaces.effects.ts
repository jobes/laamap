import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, switchMap, tap } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { OnMapAirSpacesService } from '../../../services/map/on-map-air-spaces/on-map-air-spaces.service';
import { OnMapAirportsService } from '../../../services/map/on-map-airports/on-map-airports.service';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { mapActions } from '../../actions/map.actions';
import { airSpacesFeature } from '../../features/settings/air-spaces.feature';
import { generalFeature } from '../../features/settings/general.feature';

@Injectable()
export class AirSpacesEffects {
  loadAirSpaces$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
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
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() =>
          forkJoin([
            this.openAip.getAirports$(),
            this.onMapAirportsService.addRequiredImages$(),
          ])
        ),
        tap(([geojson]) => this.onMapAirportsService.createLayers(geojson)),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio)
        ),
        tap((ratio) =>
          this.mapService.instance.setLayoutProperty(
            'airportTypeLayer',
            'text-size',
            ratio * this.onMapAirportsService.fontSize
          )
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly openAip: OpenAipService,
    private readonly mapService: MapService,
    private readonly onMapAirSpacesService: OnMapAirSpacesService,
    private readonly onMapAirportsService: OnMapAirportsService
  ) {}
}
