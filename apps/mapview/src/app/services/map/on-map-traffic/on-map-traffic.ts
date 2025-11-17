import { APP_BASE_HREF } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as turf from '@turf/turf';
import { GeoJSONSource, LngLat } from 'maplibre-gl';
import { Observable, forkJoin } from 'rxjs';

import {
  AirplaneDisplayOption,
  trafficFeature,
} from '../../../store/features/settings/traffic.feature';
import { MapHelperFunctionsService } from '../../map-helper-functions/map-helper-functions.service';
import { TrafficEntry } from '../../traffic/traffic.service';
import { MapService } from '../map.service';
import { airplaneTypes } from './airplane-types';

@Injectable({
  providedIn: 'root',
})
export class OnMapTrafficService {
  private readonly mapService = inject(MapService);
  private readonly mapHelper = inject(MapHelperFunctionsService);
  private readonly baseHref = inject(APP_BASE_HREF);
  private readonly store = inject(Store);

  constructor() {
    // Watch for changes in display settings and update text field accordingly
    effect(() => {
      // Reading these signals triggers the effect when they change
      this.store.selectSignal(trafficFeature.selectDisplayLine1)();
      this.store.selectSignal(trafficFeature.selectDisplayLine2)();

      // Only update if the layer exists (map is initialized)
      if (
        this.mapService.instance &&
        this.mapService.instance.getLayer('trafficLayer')
      ) {
        this.updateTextFieldExpression();
      }
    });
  }
  private generateImageList(): Record<string, string> {
    return airplaneTypes.reduce(
      (list, type) => {
        list[`type${type.id}`] = `${type.icon}.svg`;
        list[`type${type.id}Grey`] = `${type.icon}-grey.svg`;
        return list;
      },
      { possibleLoc: 'possible-loc.svg' } as Record<string, string>,
    );
  }

  addRequiredImages$(): Observable<true[]> {
    return forkJoin(
      Object.entries(this.generateImageList()).map(([name, src]) =>
        this.mapHelper.loadImageToMap$(
          this.mapService.instance,
          name,
          `${this.baseHref}public/traffic/${src}`,
        ),
      ),
    );
  }

  createLayers(): void {
    this.mapService.instance.addSource('trafficSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.mapService.instance.addLayer({
      id: 'trafficPossibleLayer',
      source: 'trafficSource',
      type: 'symbol',
      layout: {
        'icon-image': 'possibleLoc',
        'icon-size': ['get', 'possiblePositionRatio'],
        'icon-allow-overlap': true,
        'icon-overlap': 'always',
        'icon-ignore-placement': false,
        'icon-rotate': ['get', 'course'],
        'icon-rotation-alignment': 'map',
        'icon-pitch-alignment': 'map',
        'icon-optional': false,
        'icon-anchor': 'bottom',
      },
    });

    this.mapService.instance.addLayer({
      id: 'trafficLayer',
      source: 'trafficSource',
      type: 'symbol',
      layout: {
        'icon-image': [
          'case',
          // If speed is 0 or less, OR onGround is "1" or "true", use grey icon
          [
            'any',
            ['<=', ['get', 'speed'], 0],
            ['==', ['get', 'onGround'], '1'],
            ['==', ['get', 'onGround'], 'true'],
          ],
          ['concat', 'type', ['get', 'objectType'], 'Grey'],
          // Otherwise use normal icon
          ['concat', 'type', ['get', 'objectType']],
        ],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          // zoom is 10 (or less) value is 1
          10,
          1,
          // zoom is 20 (or greater) value is 3
          20,
          3,
        ],
        'icon-allow-overlap': true,
        'icon-overlap': 'always',
        'icon-ignore-placement': false,
        'icon-rotate': ['get', 'course'],
        'icon-rotation-alignment': 'map',
        'icon-pitch-alignment': 'viewport',
        'icon-optional': false,
        'text-overlap': 'always',
        'text-allow-overlap': true,
        'text-optional': false,
        'text-anchor': 'bottom',
        'text-offset': [0, -1.2],
        'text-size': 12,
        'symbol-sort-key': 0,
      },
      paint: {
        'icon-color': '#FAB',
      },
    });

    this.mapService.instance.on('mouseenter', 'trafficLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = 'pointer';
    });

    this.mapService.instance.on('mouseleave', 'trafficLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = '';
    });

    // Set initial text field expression based on current settings
    this.updateTextFieldExpression();
  }

  updateTextFieldExpression(): void {
    const line1 = this.buildLineExpression(
      this.store.selectSignal(trafficFeature.selectDisplayLine1)(),
    );
    const line2 = this.buildLineExpression(
      this.store.selectSignal(trafficFeature.selectDisplayLine2)(),
    );

    let textFieldExpression: unknown;

    if (line1 && line2) {
      textFieldExpression = ['concat', line1, '\n', line2];
    } else if (line1) {
      textFieldExpression = line1;
    } else if (line2) {
      textFieldExpression = line2;
    } else {
      textFieldExpression = '';
    }

    this.mapService.instance.setLayoutProperty(
      'trafficLayer',
      'text-field',
      textFieldExpression,
    );
  }

  private buildLineExpression(options: AirplaneDisplayOption[]) {
    const expressions = options.map((option) =>
      this.getFieldExpression(option),
    );

    if (expressions.length === 0) {
      return null;
    }
    if (expressions.length === 1) {
      return expressions[0];
    }
    // Combine multiple expressions with spaces
    return [
      'concat',
      ...expressions.flatMap((expr, i) =>
        i < expressions.length - 1 ? [expr, ' '] : [expr],
      ),
    ];
  }

  private getFieldExpression(option: AirplaneDisplayOption) {
    switch (option) {
      case 'callsign':
        return ['get', 'callsign'];
      case 'label':
        return ['get', 'label'];
      case 'rego':
        return ['get', 'rego'];
      case 'model':
        return ['get', 'model'];
      case 'pilotName':
        return ['get', 'pilotName'];
      case 'speed':
        return ['get', 'displaySpeed'];
      case 'altitude':
        return ['get', 'displayAltitude'];
      case 'vspeed':
        return ['concat', ['get', 'vspeed'], ' m/s'];
    }
  }

  setData(entries: TrafficEntry[], actualizationPeriod: number): void {
    const features = entries.map((entry) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [entry.lng, entry.lat],
      },
      properties: {
        ...entry,
        possiblePositionRatio: this.getIconRatio(
          new LngLat(entry.lng, entry.lat),
          entry.speed,
          entry.course,
          entry.timestamp,
          actualizationPeriod,
        ),
      },
    }));
    const source = this.mapService.instance.getSource(
      'trafficSource',
    ) as GeoJSONSource;
    source.setData({
      type: 'FeatureCollection',
      features,
    });
  }

  private getIconRatio(
    coordinate: LngLat,
    speedMps: number,
    bearing: number,
    lastMsgTime: number,
    actualizationPeriod: number,
  ): number {
    const delay =
      Math.floor(Date.now() / 1000 + actualizationPeriod) - lastMsgTime;
    const iconSize = 32; // px
    const distanceMeters = speedMps * delay; // m/s * s = meters
    const destination = turf.destination(
      [coordinate.lng, coordinate.lat],
      distanceMeters,
      bearing,
      { units: 'meters' },
    );
    const airplanePosPoint = this.mapService.instance.project(coordinate);
    const destinationPoint = this.mapService.instance.project({
      lng: destination.geometry.coordinates[0],
      lat: destination.geometry.coordinates[1],
    });

    const distancePoints = airplanePosPoint.dist(destinationPoint);
    const ratio = distancePoints / iconSize;
    return ratio;
  }
}
