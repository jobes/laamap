import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { feature, featureCollection, point } from '@turf/turf';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { Observable, filter, forkJoin } from 'rxjs';

import {
  DexieSyncService,
  IDbInterestPoint,
} from '../../database/synced-db.service';
import { MapHelperFunctionsService } from '../map-helper-functions/map-helper-functions.service';
import { MapService } from '../map/map.service';

@Injectable({
  providedIn: 'root',
})
export class InterestPointsService {
  imageList = Array(26)
    .fill({})
    .map((_, index) => ({
      name: `poi${index + 1}`,
      src: `${this.baseHref}assets/poi/poi${index + 1}.png`,
    }));

  constructor(
    private readonly mapService: MapService,
    private readonly mapHelper: MapHelperFunctionsService,
    @Inject(APP_BASE_HREF) private readonly baseHref: string,
    private readonly dexieDb: DexieSyncService,
  ) {
    this.dexieDb.changes$
      .pipe(filter((c) => c.tables.includes(this.dexieDb.interestPoints.name)))
      .subscribe(() => {
        void this.updateSource();
      });
  }

  async getPoints(): Promise<GeoJSON.Feature<Point, IDbInterestPoint>[]> {
    const pointsFromDexieDb = await this.dexieDb.interestPoints
      .toArray()
      .then((points) => points.map((p) => feature(point(p.point).geometry, p)));
    return pointsFromDexieDb;
  }

  async getGeoJson(): Promise<FeatureCollection<Point, IDbInterestPoint>> {
    const points = await this.getPoints();
    return featureCollection(points);
  }

  async addPoint(value: Omit<IDbInterestPoint, 'id'>): Promise<void> {
    await this.dexieDb.interestPoints.add(value as IDbInterestPoint);
    await this.updateSource();
  }

  async editPoint(properties: Omit<IDbInterestPoint, 'point'>): Promise<void> {
    await this.dexieDb.interestPoints.update(properties.id, properties);
    await this.updateSource();
  }

  async deletePoint(id: string): Promise<void> {
    await this.dexieDb.interestPoints.delete(id);
    await this.updateSource();
  }

  async createLayers(): Promise<void> {
    const interestGeoJson = await this.getGeoJson();
    this.mapService.instance.addSource('interestPointsSource', {
      type: 'geojson',
      data: interestGeoJson,
    });

    this.mapService.instance.addLayer({
      id: 'interestPointsLayer',
      type: 'symbol',
      source: 'interestPointsSource',
      filter: ['>=', ['zoom'], 7.2],
      layout: {
        'icon-image': ['string', ['get', 'icon']],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          // zoom is 13 (or less) value is 1
          13,
          1,
          // zoom is 22 (or greater) value is 9
          22,
          10,
        ],
        'icon-allow-overlap': true,
        'text-field': ['step', ['zoom'], '', 9, ['get', 'name']],
        'text-optional': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -1.2],
        'text-size': 12,
      },
    });
  }

  addRequiredImages$(): Observable<true[]> {
    return forkJoin(
      this.imageList.map((item) =>
        this.mapHelper.loadImageToMap$(
          this.mapService.instance,
          item.name,
          item.src,
        ),
      ),
    );
  }

  getSrcFromIconName(iconName: string | null): string | undefined {
    return this.imageList.find((img) => img.name === iconName)?.src;
  }

  async searchPoints(
    searchText: string | null,
    limit = 5,
  ): Promise<GeoJSON.Feature<Point, IDbInterestPoint>[]> {
    if (!searchText) {
      return [];
    }

    return await this.dexieDb.interestPoints
      .where('name')
      .startsWithIgnoreCase(searchText.trim())
      .limit(limit)
      .toArray()
      .then((points) => points.map((p) => feature(point(p.point).geometry, p)));
  }

  private async updateSource(): Promise<void> {
    const interestGeoJson = await this.getGeoJson();
    (
      this.mapService.instance.getSource(
        'interestPointsSource',
      ) as GeoJSONSource
    ).setData(interestGeoJson);
  }
}
