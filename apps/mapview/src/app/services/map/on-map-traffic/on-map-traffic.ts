import { APP_BASE_HREF } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import * as turf from '@turf/turf';
import { GeoJSONSource, LngLat, LngLatLike } from 'maplibre-gl';
import { Observable, forkJoin } from 'rxjs';

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
        'icon-image': ['concat', 'type', ['get', 'objectType']],
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
        'text-field': [
          'concat',
          ['get', 'label'],
          ['get', 'rego'],
          '  ',
          ['get', 'callsign'],
          '\n',
          ['get', 'displayAltitude'],
        ],
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
