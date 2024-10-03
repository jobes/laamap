import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirspacesActivationStateService {
  private http = inject(HttpClient);

  regions = [{ name: 'slovakia', id: 'LZBB' }];

  getActivationState(activationAirspaceList: string[]): Observable<string[]> {
    const observables = activationAirspaceList.map((region) =>
      this.getActivationStateByRegion(region),
    );
    return forkJoin(observables).pipe(map((states) => states.flat()));
  }

  getActivationStateByRegion(region: string): Observable<string[]> {
    switch (region) {
      case 'LZBB':
        return this.getActivationStateRegionLZBB();
      default:
        return of([]);
    }
  }

  getActivationStateRegionLZBB(): Observable<string[]> {
    const url =
      'https://gis.lps.sk/server/rest/services/Hosted/Reservation_(Public)2/FeatureServer/0/query';
    const fields = [/*'activity_code', */ 'airspace' /*'status'*/ /*'*'*/, ,];
    return this.http
      .get(url, {
        params: {
          f: 'json',
          where: `(lower_fl <> 'FL' OR lower_val <= 195) AND (localtype_txt IS NULL OR localtype_txt <> 'NPZ') AND (status = 'ACTIVE' OR status = 'APPROVED' OR status = 'ALLOCATED' OR status = 'REFERENCE_ALLOCATED' OR status = 'PENDING')`,
          returnGeometry: 'false',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: fields.join(','),
          outSR: 102100,
          resultOffset: 0,
          resultRecordCount: 1000,
        },
      })
      .pipe(
        map((res: any) => res.features.map((f: any) => f.attributes.airspace)),
      );
  }
}
