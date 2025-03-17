import { Injectable } from '@angular/core';
import { Map } from 'maplibre-gl';
import { Observable, fromEvent, map, take, tap } from 'rxjs';

import { MapService } from '../map/map.service';

@Injectable({
  providedIn: 'root',
})
export class MapHelperFunctionsService {
  constructor(private readonly mapService: MapService) {}

  decodeGeoJsonProperties(
    data: import('geojson').GeoJsonProperties,
  ): object | null {
    if (data) {
      return Object.entries(data)
        .map(([key, value]) =>
          typeof value === 'string' &&
          (value.startsWith('[') || value.startsWith('{'))
            ? ([key, JSON.parse(value)] as const)
            : ([key, value] as const),
        )
        .reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value as unknown }),
          {} as object,
        );
    }
    return data;
  }

  loadImageToMap$(
    mapInstance: Map,
    name: string,
    url: string,
  ): Observable<true> {
    const img = new Image();
    const event$ = fromEvent(img, 'load').pipe(
      tap(() => mapInstance.addImage(name, img)),
      map(() => true as const),
      take(1),
    );
    img.src = url;
    return event$;
  }

  metersToPixels(meters: number): number {
    const maxWidth = 100;
    const y = (this.mapService.instance.getCanvas().clientHeight ?? 0) / 2;
    const left = this.mapService.instance.unproject([0, y]);
    const right = this.mapService.instance.unproject([maxWidth, y]);
    if (left && right) {
      const maxMeters = left?.distanceTo(right);
      return (maxWidth * meters) / maxMeters;
    }
    return 0;
  }
}
