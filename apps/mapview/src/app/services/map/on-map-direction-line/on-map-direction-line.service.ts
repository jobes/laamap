import { Injectable, inject } from '@angular/core';
import { GeoJSONSource } from 'maplibre-gl';

import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapDirectionLineService {
  private readonly mapService = inject(MapService);

  createLayers(): void {
    this.createBorderLayer();
    this.createSegmentLayer();
  }

  setSource(
    geoJson: GeoJSON.GeoJSON | null,
    borderGeoJson: GeoJSON.GeoJSON | null,
  ): void {
    const source = this.mapService.instance.getSource(
      'directionLineSource',
    ) as GeoJSONSource;
    const borderSource = this.mapService.instance.getSource(
      'directionLineBorderSource',
    ) as GeoJSONSource;
    if (geoJson && borderGeoJson) {
      source.setData(geoJson);
      borderSource.setData(borderGeoJson);
    } else {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
      borderSource.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }

  private createSegmentLayer(): void {
    this.mapService.instance.addSource('directionLineSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.mapService.instance.addLayer({
      id: 'directionLineLayer',
      type: 'line',
      source: 'directionLineSource',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 5,
      },
    });
  }

  private createBorderLayer(): void {
    this.mapService.instance.addSource('directionLineBorderSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    this.mapService.instance.addLayer({
      id: 'directionLineBorderLayer',
      type: 'line',
      source: 'directionLineBorderSource',
      paint: {
        'line-color': 'black',
        'line-width': 7,
      },
      layout: {
        'line-cap': 'square',
      },
    });
  }
}
