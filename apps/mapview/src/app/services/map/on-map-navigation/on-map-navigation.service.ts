import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import {
  Feature,
  GeoJsonProperties,
  LineString,
  MultiLineString,
} from 'geojson';
import { LngLat } from 'maplibre-gl';
import { GeoJSONSource } from 'maplibre-gl';

import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapNavigationService {
  constructor(private readonly mapService: MapService) {}

  createLayers(): void {
    this.mapService.instance.addSource('navigationSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    this.mapService.instance.addLayer({
      id: 'navigationLayer',
      type: 'line',
      source: 'navigationSource',
      paint: {
        'line-color': 'blue',
        'line-width': 5,
        'line-dasharray': [10, 5],
      },
    });
  }

  hideNavigationRoute(): void {
    const source = this.mapService.instance.getSource(
      'navigationSource',
    ) as GeoJSONSource;
    source?.setData({
      type: 'FeatureCollection',
      features: [],
    });
  }

  createNavigationRoute(points: { point: LngLat }[]): void {
    if (points.length < 2) {
      return;
    }
    const geoJson = turf.featureCollection(
      points.reduce(
        (acc, item, index, array) => {
          if (index === 0) return acc;
          return [
            ...acc,
            turf.greatCircle(
              [array[index - 1].point.lng, array[index - 1].point.lat],
              [array[index].point.lng, array[index].point.lat],
            ),
          ];
        },
        [] as Feature<LineString | MultiLineString, GeoJsonProperties>[],
      ),
    );

    const source = this.mapService.instance.getSource(
      'navigationSource',
    ) as GeoJSONSource;
    source.setData(geoJson);
  }
}
