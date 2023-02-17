import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirport>
>;

@Injectable({
  providedIn: 'root',
})
export class OpenAipService {
  constructor(private readonly http: HttpClient) {}

  getAirSpaces$(): Observable<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirspace>
  > {
    return this.http
      .get<GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirspaceResponse>>(
        'assets/open-aip-db/sk_asp.geojson'
      )
      .pipe(
        map((json) => ({
          ...json,
          features: json.features.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              lowerLimitMetersMsl: this.toMslMeters(
                feature.properties.lowerLimit
              ),
              upperLimitMetersMsl: this.toMslMeters(
                feature.properties.upperLimit
              ),
            },
          })),
        }))
      );
  }

  getAirports$(): GetAirportsResponse {
    return this.http
      .get<GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirportResponse>>(
        'assets/open-aip-db/sk_apt.geojson'
      )
      .pipe(
        map((json) => ({
          ...json,
          features: json.features.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              mainRunway: this.runwayPaved(
                feature.properties.runways?.find((runway) => runway.mainRunway)
              ),
              runways: feature.properties.runways?.sort((a, b) =>
                a.mainRunway === b.mainRunway ? 0 : a.mainRunway ? -1 : 1
              ),
              mainFrequency:
                feature.properties.frequencies?.find((freq) => freq.primary) ??
                {},
              frequencies: feature.properties.frequencies?.sort((a, b) =>
                a.primary === b.primary ? 0 : a.primary ? -1 : 1
              ),
            },
          })),
        }))
      );
  }

  private runwayPaved(
    runway?: IRunway
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
