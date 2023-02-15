import { Injectable } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { Observable, fromEvent, map, take, tap } from 'rxjs';

import { DataBusService } from '../data-bus.service';

@Injectable({
  providedIn: 'root',
})
export class MapHelperFunctionsService {
  constructor(private readonly dataBusService: DataBusService) {}

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

  metersToPixels(meters: number): number {
    const maxWidth = 100;
    const y = (this.dataBusService.getMap()?._container.clientHeight ?? 0) / 2;
    const left = this.dataBusService.getMap()?.unproject([0, y]);
    const right = this.dataBusService.getMap()?.unproject([maxWidth, y]);
    if (left && right) {
      const maxMeters = left?.distanceTo(right);
      return (maxWidth * meters) / maxMeters;
    }
    return 0;
  }
}
