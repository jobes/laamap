import { Injectable } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { Observable, fromEvent, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapHelperFunctionsService {
  decodeGeoJsonProperties(
    data: import('geojson').GeoJsonProperties
  ): object | null {
    if (data) {
      return Object.entries(data)
        .map(([key, value]) =>
          typeof value === 'string' &&
          (value.startsWith('[') || value.startsWith('{'))
            ? ([key, JSON.parse(value)] as const)
            : ([key, value] as const)
        )
        .reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value as unknown }),
          {} as object
        );
    }
    return data;
  }

  loadImageToMap$(
    mapComponent: MapComponent,
    name: string,
    url: string
  ): Observable<true> {
    const img = new Image();
    const event$ = fromEvent(img, 'load').pipe(
      tap(() => {
        if (mapComponent) {
          mapComponent.mapInstance.addImage(name, img);
        }
      }),
      map(() => true as const),
      take(1)
    );
    img.src = url;
    return event$;
  }
}
