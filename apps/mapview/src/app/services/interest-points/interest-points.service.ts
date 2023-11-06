import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  FeatureCollection,
  Point,
  feature,
  featureCollection,
  point,
} from '@turf/turf';
import { GeoJSONSource, LngLat } from 'maplibre-gl';
// eslint-disable-next-line @typescript-eslint/naming-convention
import PouchDb from 'pouchdb';
import { Observable, forkJoin } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MapHelperFunctionsService } from '../map-helper-functions/map-helper-functions.service';
import { MapService } from '../map/map.service';

export interface IInterestPoint {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

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
  ) {}

  async getPoints(): Promise<GeoJSON.Feature<Point, IInterestPoint>[]> {
    const pointDb = this.getDb();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const pointList = await pointDb.allDocs({ include_docs: true });
    return pointList.rows
      .map((r) => r.doc as NonNullable<typeof r.doc>)
      .filter((doc) => !!doc);
  }

  async getGeoJson(): Promise<FeatureCollection<Point, IInterestPoint>> {
    const points = await this.getPoints();
    return featureCollection(points);
  }

  async addPoint(
    poi: LngLat,
    value: Omit<IInterestPoint, 'id'>,
  ): Promise<void> {
    const id = uuidv4();
    const feat = feature(point([poi.lng, poi.lat]).geometry, { ...value, id });
    const pointDb = this.getDb();
    await pointDb.put({ _id: id, ...feat });
    await this.updateSource();
  }

  async editPoint(properties: IInterestPoint): Promise<void> {
    const pointDb = this.getDb();
    const doc = await pointDb.get(properties.id);
    doc.properties = properties;
    await pointDb.put(doc);
    await this.updateSource();
  }

  async deletePoint(id: string): Promise<void> {
    const pointDb = this.getDb();
    const doc = await pointDb.get(id);
    await pointDb.remove(doc);
    await this.updateSource();
  }

  // eslint-disable-next-line max-lines-per-function
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

  private getDb() {
    return new PouchDb<GeoJSON.Feature<Point, IInterestPoint>>(
      'interestPoints',
    );
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
