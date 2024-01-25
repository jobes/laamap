import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import { InterestPointsService } from '../../../services/interest-points/interest-points.service';
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
        tap(() => this.onMapAirSpacesService.createLayers()),
        switchMap(() => this.store.select(generalFeature.selectTerritories)),
        switchMap((territories) => this.openAip.getAirSpaces$(territories)),
        tap((geojson) => this.onMapAirSpacesService.setSource(geojson)),
        switchMap(() =>
          this.store.select(airSpacesFeature['selectSettings.airSpacesState']),
        ),
        tap((settings) => this.onMapAirSpacesService.reloadSettings(settings)),
      );
    },
    { dispatch: false },
  );

  loadAirports$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        tap(() => this.onMapAirportsService.createLayers()),
        switchMap(() => this.onMapAirportsService.addRequiredImages$()),
        switchMap(() => this.store.select(generalFeature.selectTerritories)),
        switchMap((territories) => this.openAip.getAirports$(territories)),
        tap((geojson) => this.onMapAirportsService.setSource(geojson)),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio),
        ),
        tap((ratio) =>
          this.mapService.instance.setLayoutProperty(
            'airportTypeLayer',
            'text-size',
            ratio * this.onMapAirportsService.fontSize,
          ),
        ),
      );
    },
    { dispatch: false },
  );

  loadInterestPoints$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(mapActions.loaded),
        switchMap(() => this.interestPointsService.addRequiredImages$()),
        switchMap(() => this.interestPointsService.createLayers()),
        switchMap(() =>
          this.store.select(generalFeature.selectMapFontSizeRatio),
        ),
        tap((ratio) =>
          this.mapService.instance.setLayoutProperty(
            'interestPointsLayer',
            'text-size',
            ratio * this.onMapAirportsService.fontSize,
          ),
        ),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly openAip: OpenAipService,
    private readonly mapService: MapService,
    private readonly onMapAirSpacesService: OnMapAirSpacesService,
    private readonly onMapAirportsService: OnMapAirportsService,
    private readonly interestPointsService: InterestPointsService,
  ) {}
}
