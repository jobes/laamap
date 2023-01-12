import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LngLat } from 'maplibre-gl';
import { iif, map, Observable, of, switchMap } from 'rxjs';
import { notamTranslations } from './notam-translations';
import {
  INotamDecoded,
  INotamDecodedResponse,
  INotamParts,
  INotamQParsed,
  INotamResponse,
} from './notams.interface';
import * as turf from '@turf/turf';

// data getting https://github.com/avwx-rest/avwx-engine/blob/aa929745559ad815e250a3e8bbe6166235a8c53d/avwx/service/scrape.py
// decode structure https://www.theairlinepilots.com/flightplanningforairlinepilots/notamdecode.php
// decode message abbreviations https://www.notams.faa.gov/downloads/contractions.pdf
// decode structure https://www.faa.gov/air_traffic/flight_info/aeronav/notams/media/ICAO_NOTAM_Format_Example.pdf

export type NotamGeoJson = turf.FeatureCollection<
  turf.Polygon,
  INotamDecodedResponse['notamList'][0]
>;

@Injectable({
  providedIn: 'root',
})
export class NotamsService {
  constructor(private http: HttpClient) {}

  icaoCode$(icao: string[], offset = 0): Observable<INotamDecodedResponse> {
    const body = new URLSearchParams();
    body.set('searchType', '0');
    body.set('designatorsForLocation', icao.join(','));
    body.set('offset', offset.toString());
    body.set('notamsOnly', 'false');
    return this.http
      .post<INotamResponse>(`/notams/notamSearch/search`, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(
        switchMap((resp) =>
          iif(
            () => resp.endRecordCount === resp.totalNotamCount,
            of(resp),
            this.icaoCode$(icao, resp.endRecordCount).pipe(
              map((nextResp) => ({
                ...nextResp,
                startRecordCount: resp.startRecordCount,
                notamList: [...nextResp.notamList, ...resp.notamList],
              }))
            )
          )
        ),
        map((notams) => ({
          ...notams,
          notamList: notams.notamList.map((notamItem) => ({
            ...notamItem,
            decoded: this.decodeNotam(notamItem.icaoMessage),
          })),
        }))
      );
  }

  /**
   * @param {number} [radius] Distance in meters from the center coordinates
   */
  aroundPoint$(
    point: LngLat,
    radius: number,
    offset = 0
  ): Observable<INotamDecodedResponse> {
    const wrapped = point.wrap();
    wrapped.lat % 1;

    const body = new URLSearchParams();
    body.set('searchType', '3');
    body.set('latDegrees', Math.abs(Math.floor(wrapped.lat)).toString());
    body.set(
      'latMinutes',
      Math.abs(Math.floor((wrapped.lat % 1) * 60)).toString()
    );
    body.set(
      'latSeconds',
      Math.abs(Math.floor((((wrapped.lat % 1) * 60) % 1) * 60)).toString()
    );
    body.set('latitudeDirection', wrapped.lat >= 0 ? 'N' : 'S');
    body.set('longDegrees', Math.abs(Math.floor(wrapped.lng)).toString());
    body.set(
      'longMinutes',
      Math.abs(Math.floor((wrapped.lng % 1) * 60)).toString()
    );
    body.set(
      'longSeconds',
      Math.abs(Math.floor((((wrapped.lng % 1) * 60) % 1) * 60)).toString()
    );
    body.set('longitudeDirection', wrapped.lng >= 0 ? 'E' : 'W');
    body.set('radius', Math.ceil(0.000539956803 * radius).toString());
    body.set('offset', offset.toString());
    body.set('notamsOnly', 'false');
    body.set('radiusSearchOnDesignator', 'false');

    return this.http
      .post<INotamResponse>(`/notams/notamSearch/search`, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(
        switchMap((resp) =>
          iif(
            () => resp.endRecordCount === resp.totalNotamCount,
            of(resp),
            this.aroundPoint$(point, radius, resp.endRecordCount).pipe(
              map((nextResp) => ({
                ...nextResp,
                startRecordCount: resp.startRecordCount,
                notamList: [...nextResp.notamList, ...resp.notamList],
              }))
            )
          )
        ),
        map((notams) => ({
          ...notams,
          notamList: notams.notamList.map((notamItem) => ({
            ...notamItem,
            decoded: this.decodeNotam(notamItem.icaoMessage),
          })),
        }))
      );
  }

  aroundPointWithFir$(
    point: LngLat,
    radius: number
  ): Observable<INotamDecodedResponse['notamList']> {
    return this.aroundPoint$(point, radius).pipe(
      switchMap((pointNotams) =>
        of(
          pointNotams.notamList.reduce(
            (acc, item) =>
              acc.includes(item.decoded.fir) ? acc : [...acc, item.decoded.fir],
            [] as string[]
          )
        )
          .pipe(
            switchMap((icaoCodes) =>
              iif(
                () => icaoCodes.length === 0,
                of({ notamList: [] }),
                this.icaoCode$(icaoCodes)
              )
            )
          )
          .pipe(
            map((firNotams) => [
              ...firNotams.notamList,
              ...pointNotams.notamList,
            ])
          )
      )
    );
  }

  decodeNotam(notam: string): INotamDecoded {
    const parts = this.separateToParts(notam);
    return {
      ...this.parseQ(parts.q),
      id: parts.id.split(' ')[0],
      type: parts.id.split(' ')[1],
      linkedNotam: parts.id.split(' ')[2],
      issuer: parts.a,
      from: this.convertToDate(parts.b),
      to: this.convertToDate(parts.c),
      schedule: parts.d,
      msg: this.parseMsg(parts.e),
      lowerLimit2: parts.f,
      upperLimit2: parts.g,
    };
  }

  notamsToGeoJson(notams: INotamDecodedResponse['notamList']): NotamGeoJson {
    return turf.featureCollection(
      notams.map((notam) =>
        turf.circle(
          notam.decoded.position.toArray(),
          notam.decoded.radius / 1000,
          { properties: notam }
        )
      )
    );
  }

  private separateToParts(notam: string): INotamParts {
    notam = notam.replaceAll('\n', ' ');
    const qStart = notam.indexOf('Q)');
    const aStart = notam.indexOf('A)');
    const bStart = notam.indexOf('B)');
    const cStart = notam.indexOf('C)');
    const dStart = notam.indexOf('D)');
    const eStart = notam.indexOf('E)');
    const fStart = notam.indexOf('F)');
    const gStart = notam.indexOf('G)');
    return {
      id: notam.substring(0, qStart)?.trim(),
      q: notam.substring(qStart + 2, aStart)?.trim(),
      a: notam.substring(aStart + 2, bStart)?.trim(),
      b: notam.substring(bStart + 2, cStart)?.trim(),
      c: notam.substring(cStart + 2, dStart === -1 ? eStart : dStart)?.trim(),
      d:
        dStart === -1 ? undefined : notam.substring(dStart + 2, eStart)?.trim(),
      e: notam
        .substring(eStart + 2, fStart === -1 ? undefined : fStart)
        ?.trim(),
      f:
        fStart === -1
          ? undefined
          : notam
              .substring(fStart + 2, gStart === -1 ? undefined : gStart)
              ?.trim(),
      g: gStart === -1 ? undefined : notam.substring(gStart + 2)?.trim(),
    };
  }

  private convertToDate(data: string): Date {
    return new Date(
      `20${data.substring(0, 2)}-${data.substring(2, 4)}-${data.substring(
        4,
        6
      )}T${data.substring(6, 8)}:${data.substring(8, 10)}:00.000Z`
    );
  }

  private parseQ(q: string): INotamQParsed {
    const [
      fir,
      code,
      traffic,
      purpose,
      scope,
      lowerLimit,
      upperLimit,
      coordinates,
    ] = q.split('/');
    return {
      fir,
      subjectIdentification: code.substring(1, 3),
      subjectCondition: code.substring(3),
      traffic: {
        checklist: traffic.toUpperCase().includes('K'),
        instrument: traffic.toUpperCase().includes('I'),
        visual: traffic.toUpperCase().includes('V'),
      },
      purpose: {
        checklist: purpose.toUpperCase().includes('K'),
        flightOperation: purpose.toUpperCase().includes('O'),
        immediateAttention: purpose.toUpperCase().includes('N'),
        miscellaneous: purpose.toUpperCase().includes('M'),
        preFlightBriefing: purpose.toUpperCase().includes('B'),
      },
      scope: {
        aerodrome: scope.toUpperCase().includes('A'),
        checklist: scope.toUpperCase().includes('K'),
        enRoute: scope.toUpperCase().includes('E'),
        navigationWarning: scope.toUpperCase().includes('W'),
      },
      flightLevelLowerLimit: Number(lowerLimit),
      flightLevelUpperLimit: Number(upperLimit),
      radius: Number(coordinates.substring(11)) * 1852,
      position: new LngLat(
        (Number(coordinates.substring(5, 10)) / 100) *
          (coordinates.substring(10, 11) === 'W' ? -1 : 1),
        (Number(coordinates.substring(0, 4)) / 100) *
          (coordinates.substring(4, 5) === 'S' ? -1 : 1)
      ),
    };
  }

  private parseMsg(msg: string): string {
    const translations = notamTranslations;
    return msg.replace(/[A-Z]+/gi, (m) => translations[m] ?? m).toUpperCase();
  }
}
