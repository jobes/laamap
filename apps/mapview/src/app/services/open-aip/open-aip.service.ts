import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

import {
  EHeightUnit,
  EReferenceDatum,
  ERunwayComposition,
  IAirport,
  IAirportResponse,
  IRunway,
} from './airport.interfaces';
import { IAirspace, IAirspaceResponse } from './airspaces.interfaces';

type GetAirportsResponse = Observable<
  import('geojson').FeatureCollection<import('geojson').Point, IAirport>
>;

@Injectable({
  providedIn: 'root',
})
export class OpenAipService {
  private readonly bucketUrl = `https://storage.googleapis.com/storage/v1/b/29f98e10-a489-4c82-ae5e-489dbcd4912f/o`;
  private readonly airspaceSuffix = `_asp.geojson?alt=media`;
  private readonly airportSuffix = `_apt.geojson?alt=media`;

  constructor(
    private readonly http: HttpClient,
    @Inject(APP_BASE_HREF) private readonly baseHref: string,
  ) {}

  getAirSpaces$(
    territories: string[],
  ): Observable<
    import('geojson').FeatureCollection<import('geojson').Geometry, IAirspace>
  > {
    return this.getAllAirspaces$(territories).pipe(
      map((features) => features.flat()),
      map((features) => ({
        type: 'FeatureCollection',
        features: features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            lowerLimitMetersMsl: this.toMslMeters(
              feature.properties.lowerLimit,
            ),
            upperLimitMetersMsl: this.toMslMeters(
              feature.properties.upperLimit,
            ),
          },
        })),
      })),
    );
  }

  getAirports$(territories: string[]): GetAirportsResponse {
    return this.getAllAirports$(territories).pipe(
      map((features) => features.flat()),
      map((features) => ({
        type: 'FeatureCollection',
        features: features.map((feature) => ({
          ...feature,
          properties: this.mapAirportsResponse(feature),
        })),
      })),
    );
  }

  getTerritories$(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseHref}assets/territories.json`);
  }

  private getAllAirports$(
    territories: string[],
  ): Observable<Feature<import('geojson').Point, IAirportResponse>[][]> {
    return forkJoin(
      territories?.length > 0
        ? territories.map((territoryCode) =>
            this.http
              .get<
                import('geojson').FeatureCollection<
                  import('geojson').Point,
                  IAirportResponse
                >
              >(`${this.bucketUrl}/${territoryCode}${this.airportSuffix}`)
              .pipe(
                catchError(() =>
                  of({
                    type: 'FeatureCollection',
                    features: [],
                  }),
                ),
                map((collection) => collection.features),
              ),
          )
        : [of([])],
    );
  }

  private getAllAirspaces$(
    territories: string[],
  ): Observable<Feature<import('geojson').Geometry, IAirspaceResponse>[][]> {
    return forkJoin(
      territories?.length > 0
        ? territories.map((territoryCode) =>
            this.http
              .get<
                import('geojson').FeatureCollection<
                  import('geojson').Geometry,
                  IAirspaceResponse
                >
              >(`${this.bucketUrl}/${territoryCode}${this.airspaceSuffix}`)
              .pipe(
                catchError(() =>
                  of({
                    type: 'FeatureCollection',
                    features: [],
                  } as import('geojson').FeatureCollection<
                    import('geojson').Geometry,
                    IAirspace
                  >),
                ),
                map((collection) => collection.features),
              ),
          )
        : [of([])],
    );
  }

  private mapAirportsResponse(
    feature: import('geojson').Feature<
      import('geojson').Geometry,
      IAirportResponse
    >,
  ): IAirport {
    return {
      ...feature.properties,
      mainRunway: this.runwayPaved(
        feature.properties.runways?.find((runway) => runway.mainRunway),
      ),
      runways: feature.properties.runways?.sort((a, b) =>
        a.mainRunway === b.mainRunway ? 0 : a.mainRunway ? -1 : 1,
      ),
      mainFrequency:
        feature.properties.frequencies?.find((freq) => freq.primary) ?? {},
      frequencies: feature.properties.frequencies?.sort((a, b) =>
        a.primary === b.primary ? 0 : a.primary ? -1 : 1,
      ),
    };
  }

  private runwayPaved(
    runway?: IRunway,
  ): (IRunway & { paved: boolean }) | Record<string, never> {
    if (!runway) {
      return {};
    }
    return {
      ...runway,
      paved:
        runway.surface.mainComposite in
        [ERunwayComposition.asphalt, ERunwayComposition.concrete],
    };
  }

  private toMslMeters(value: {
    value: number;
    unit: EHeightUnit;
    referenceDatum: EReferenceDatum;
  }): number {
    // if (value.referenceDatum === EReferenceDatum.gnd && value.value !== 0) {
    //   console.warn(`Can not convert ${value.value} GND to MSL`);
    // }
    const toMCoefficient =
      value.unit === EHeightUnit.feet
        ? 0.3048
        : value.unit === EHeightUnit.flightLevel
          ? 30.48
          : 1;
    return value.value * toMCoefficient;
  }
}
