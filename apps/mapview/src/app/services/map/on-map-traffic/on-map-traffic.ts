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

  private readonly imageList = {
    type0: 'plane.svg',
    type1: 'plane.svg',
    type2: 'plane.svg',
    type3: 'plane.svg',
    type4: 'plane.svg',
    type5: 'plane.svg',
    type6: 'plane.svg',
    type7: 'plane.svg',
    type8: 'plane.svg',
    type9: 'plane.svg',
    type10: 'plane.svg',
    type11: 'plane.svg',
    type12: 'plane.svg',
    type13: 'plane.svg',
    type14: 'plane.svg',
    type15: 'plane.svg',
    type16: 'plane.svg',
    type17: 'plane.svg',
    type18: 'plane.svg',
    type19: 'plane.svg',
    type20: 'plane.svg',
    type21: 'plane.svg',
    type22: 'plane.svg',
    type23: 'plane.svg',
    type24: 'plane.svg',
    type25: 'plane.svg',
    type26: 'plane.svg',
    type27: 'plane.svg',
    type28: 'plane.svg',
    type29: 'plane.svg',
    type30: 'plane.svg',
    type31: 'plane.svg',
    type32: 'plane.svg',
    type33: 'plane.svg',
    type34: 'plane.svg',
    type35: 'plane.svg',
    type36: 'plane.svg',
    type37: 'plane.svg',
    type38: 'plane.svg',
    type39: 'plane.svg',
    type40: 'plane.svg',
    type41: 'plane.svg',
    type42: 'plane.svg',
    type43: 'plane.svg',
    type44: 'plane.svg',
    type45: 'plane.svg',
    type46: 'plane.svg',
    type47: 'plane.svg',
    type48: 'plane.svg',
    type49: 'plane.svg',
    type50: 'plane.svg',
    type51: 'plane.svg',
    type52: 'plane.svg',
    type53: 'plane.svg',
    type54: 'plane.svg',
    type55: 'plane.svg',
    type56: 'plane.svg',
    type57: 'plane.svg',
    type58: 'plane.svg',
    type59: 'plane.svg',
    type60: 'plane.svg',
    type61: 'plane.svg',
    type62: 'plane.svg',
    type63: 'plane.svg',
    type64: 'plane.svg',
    type65: 'plane.svg',
    type66: 'plane.svg',
    type67: 'plane.svg',
    type68: 'plane.svg',
    type69: 'plane.svg',
    type70: 'plane.svg',
    type71: 'plane.svg',
    type72: 'plane.svg',
    type73: 'plane.svg',
    type74: 'plane.svg',
    type75: 'plane.svg',
    type76: 'plane.svg',
    type77: 'plane.svg',
    type78: 'plane.svg',
    type79: 'plane.svg',
    // Grey versions for grounded or zero speed planes
    type0Grey: 'plane-grey.svg',
    type1Grey: 'plane-grey.svg',
    type2Grey: 'plane-grey.svg',
    type3Grey: 'plane-grey.svg',
    type4Grey: 'plane-grey.svg',
    type5Grey: 'plane-grey.svg',
    type6Grey: 'plane-grey.svg',
    type7Grey: 'plane-grey.svg',
    type8Grey: 'plane-grey.svg',
    type9Grey: 'plane-grey.svg',
    type10Grey: 'plane-grey.svg',
    type11Grey: 'plane-grey.svg',
    type12Grey: 'plane-grey.svg',
    type13Grey: 'plane-grey.svg',
    type14Grey: 'plane-grey.svg',
    type15Grey: 'plane-grey.svg',
    type16Grey: 'plane-grey.svg',
    type17Grey: 'plane-grey.svg',
    type18Grey: 'plane-grey.svg',
    type19Grey: 'plane-grey.svg',
    type20Grey: 'plane-grey.svg',
    type21Grey: 'plane-grey.svg',
    type22Grey: 'plane-grey.svg',
    type23Grey: 'plane-grey.svg',
    type24Grey: 'plane-grey.svg',
    type25Grey: 'plane-grey.svg',
    type26Grey: 'plane-grey.svg',
    type27Grey: 'plane-grey.svg',
    type28Grey: 'plane-grey.svg',
    type29Grey: 'plane-grey.svg',
    type30Grey: 'plane-grey.svg',
    type31Grey: 'plane-grey.svg',
    type32Grey: 'plane-grey.svg',
    type33Grey: 'plane-grey.svg',
    type34Grey: 'plane-grey.svg',
    type35Grey: 'plane-grey.svg',
    type36Grey: 'plane-grey.svg',
    type37Grey: 'plane-grey.svg',
    type38Grey: 'plane-grey.svg',
    type39Grey: 'plane-grey.svg',
    type40Grey: 'plane-grey.svg',
    type41Grey: 'plane-grey.svg',
    type42Grey: 'plane-grey.svg',
    type43Grey: 'plane-grey.svg',
    type44Grey: 'plane-grey.svg',
    type45Grey: 'plane-grey.svg',
    type46Grey: 'plane-grey.svg',
    type47Grey: 'plane-grey.svg',
    type48Grey: 'plane-grey.svg',
    type49Grey: 'plane-grey.svg',
    type50Grey: 'plane-grey.svg',
    type51Grey: 'plane-grey.svg',
    type52Grey: 'plane-grey.svg',
    type53Grey: 'plane-grey.svg',
    type54Grey: 'plane-grey.svg',
    type55Grey: 'plane-grey.svg',
    type56Grey: 'plane-grey.svg',
    type57Grey: 'plane-grey.svg',
    type58Grey: 'plane-grey.svg',
    type59Grey: 'plane-grey.svg',
    type60Grey: 'plane-grey.svg',
    type61Grey: 'plane-grey.svg',
    type62Grey: 'plane-grey.svg',
    type63Grey: 'plane-grey.svg',
    type64Grey: 'plane-grey.svg',
    type65Grey: 'plane-grey.svg',
    type66Grey: 'plane-grey.svg',
    type67Grey: 'plane-grey.svg',
    type68Grey: 'plane-grey.svg',
    type69Grey: 'plane-grey.svg',
    type70Grey: 'plane-grey.svg',
    type71Grey: 'plane-grey.svg',
    type72Grey: 'plane-grey.svg',
    type73Grey: 'plane-grey.svg',
    type74Grey: 'plane-grey.svg',
    type75Grey: 'plane-grey.svg',
    type76Grey: 'plane-grey.svg',
    type77Grey: 'plane-grey.svg',
    type78Grey: 'plane-grey.svg',
    type79Grey: 'plane-grey.svg',
    possibleLoc: 'possible-loc.svg',
  };

  addRequiredImages$(): Observable<true[]> {
    return forkJoin(
      Object.entries(this.imageList).map(([name, src]) =>
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
