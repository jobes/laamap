import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, share } from 'rxjs';

import {
  EHeightUnit,
  EReferenceDatum,
  ERunwayComposition,
  IAirport,
  IAirportResponse,
  IRunway,
} from './airport.interfaces';
import { IAirspace, IAirspaceResponse } from './airspaces.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OpenAipService {
  constructor(private readonly http: HttpClient) {}

  getAirSPaces$(): Observable<{ features: { properties: IAirspace }[] }> {
    return this.http
      .get<{ features: { properties: IAirspaceResponse }[] }>(
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

  getAirports$(): Observable<{ features: { properties: IAirport }[] }> {
    return this.http
      .get<{ features: { properties: IAirportResponse }[] }>(
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
        })),
        share()
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
        [ERunwayComposition.ASPHALT, ERunwayComposition.CONCRETE],
    };
  }

  private toMslMeters(value: {
    value: number;
    unit: EHeightUnit;
    referenceDatum: EReferenceDatum;
  }): number {
    if (value.referenceDatum === EReferenceDatum.GND && value.value !== 0) {
      console.warn(`Can not convert ${value.value} GND to MSL`);
    }
    const toMCoefficient =
      value.unit === EHeightUnit.FEET
        ? 0.3048
        : value.unit === EHeightUnit.FLIGHT_LEVEL
        ? 30.48
        : 1;
    return value.value * toMCoefficient;
  }
}
