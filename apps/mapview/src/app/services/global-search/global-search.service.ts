import { Injectable, inject } from '@angular/core';
import {
  GeocodingFeature,
  GeocodingSearchResult,
  config,
  geocoding,
} from '@maptiler/client';
import { Store } from '@ngrx/store';
import { Feature, Point } from '@turf/turf';
import {
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  from,
  map,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { IDbInterestPoint } from '../../database/synced-db.service';
import { generalFeature } from '../../store/features/settings/general.feature';
import {
  CustomFlyRoutesService,
  ICustomFlyRoute,
} from '../custom-fly-routes/custom-fly-routes.service';
import { InterestPointsService } from '../interest-points/interest-points.service';
import { OnMapAirportsService } from '../map/on-map-airports/on-map-airports.service';
import { IAirport } from '../open-aip/airport.interfaces';

config.apiKey = environment.mapTilesKey;

export type GlobalMenuInput =
  | ({ itemType: 'route' } & ICustomFlyRoute)
  | ({ itemType: 'interestPoint' } & GeoJSON.Feature<Point, IDbInterestPoint>)
  | ({ itemType: 'airports' } & GeoJSON.Feature<Point, IAirport>)
  | ({ itemType: 'address' } & GeocodingFeature);

interface IGlobalMenuResult {
  label: string;
  values: {
    name: string;
    data: GlobalMenuInput;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private readonly customFlyRoutesService = inject(CustomFlyRoutesService);
  private readonly interestPointsService = inject(InterestPointsService);
  private readonly onMapAirportsService = inject(OnMapAirportsService);
  private readonly store = inject(Store);

  searchResults$(
    input$: Observable<string | null>,
  ): Observable<IGlobalMenuResult[]> {
    return input$.pipe(
      map((val) => ((val?.length ?? 0) >= 2 ? val : '')),
      debounceTime(500),
      switchMap((val) =>
        combineLatest({
          routes: this.customFlyRoutesService.searchRoute(val),
          points: this.interestPointsService.searchPoints(val),
          airports: Promise.resolve(
            this.onMapAirportsService.searchAirport(val),
          ),
          // eslint-disable-next-line rxjs/finnish
          address: this.searchAddress$(val),
        }),
      ),
      map((values) => this.mapToList(values)),
    );
  }

  private searchAddress$(val: string | null): Observable<
    | GeocodingSearchResult
    | {
        error: boolean;
      }
    | null
  > {
    return this.store.select(generalFeature.selectTerritories).pipe(
      take(1),
      switchMap((territories) =>
        val && territories?.length
          ? from(
              geocoding.forward(val, {
                country: territories,
                types: ['municipality'],
              }),
            ).pipe(
              startWith(null),
              catchError(() => of({ error: true })),
            )
          : Promise.resolve(null),
      ),
    );
  }

  private mapToList(values: {
    routes: ICustomFlyRoute[];
    points: Feature<Point, IDbInterestPoint>[];
    airports: Feature<Point, IAirport>[];
    address: GeocodingSearchResult | null | { error: boolean };
  }): IGlobalMenuResult[] {
    return [
      ...this.mapRoutesToList(values.routes),
      ...this.mapInterestPointsToList(values.points),
      ...this.mapAirportsToList(values.airports),
      ...this.mapAddressToList(values.address),
    ];
  }

  private mapRoutesToList(routes: ICustomFlyRoute[]): IGlobalMenuResult[] {
    if (routes.length === 0) {
      return [];
    }
    return [
      {
        label: 'routes',
        values: routes.map((route) => ({
          name: route.routeName,
          data: { itemType: 'route' as const, ...route },
        })),
      },
    ];
  }

  private mapInterestPointsToList(
    points: Feature<Point, IDbInterestPoint>[],
  ): IGlobalMenuResult[] {
    if (points.length === 0) {
      return [];
    }
    return [
      {
        label: 'interestPoints',
        values: points.map((point) => ({
          name: point.properties.name,
          data: { itemType: 'interestPoint' as const, ...point },
        })),
      },
    ];
  }

  private mapAirportsToList(
    airports: Feature<Point, IAirport>[],
  ): IGlobalMenuResult[] {
    if (airports.length === 0) {
      return [];
    }
    return [
      {
        label: 'airports',
        values: airports.map((airport) => ({
          name:
            airport.properties.name +
            (airport.properties.icaoCode
              ? `(${airport.properties.icaoCode})`
              : ''),
          data: { itemType: 'airports' as const, ...airport },
        })),
      },
    ];
  }

  private mapAddressToList(
    address: GeocodingSearchResult | null | { error: boolean },
  ): IGlobalMenuResult[] {
    if (address && 'error' in address) {
      return [{ label: 'addressError', values: [] }];
    }
    if (!address || address.features.length === 0) {
      return [];
    }
    return [
      {
        label: 'address',
        values: address.features.map((address) => ({
          name: address.text,
          data: { itemType: 'address' as const, ...address },
        })),
      },
    ];
  }
}
