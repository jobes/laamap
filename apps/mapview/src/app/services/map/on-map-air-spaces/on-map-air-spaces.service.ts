import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import {
  ColorSpecification,
  DataDrivenPropertyValueSpecification,
  ExpressionFilterSpecification,
  ExpressionSpecification,
  GeoJSONSource,
} from 'maplibre-gl';

import { layerAirSpacesActions } from '../../../store/actions/map.actions';
import { IAirSpaceSettingsObject } from '../../../store/features/settings/air-spaces-init-value';
import { EAirSpaceType, IAirspace } from '../../open-aip/airspaces.interfaces';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapAirSpacesService {
  constructor(
    private readonly mapService: MapService,
    private store: Store,
  ) {}

  createLayers(): void {
    this.mapService.instance.addSource('airspacesSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.mapService.instance.addLayer(
      {
        id: 'airspacesLayerBorder',
        type: 'line',
        source: 'airspacesSource',
      },
      'notamsLayer',
    );

    this.mapService.instance.addLayer(
      {
        id: 'airspacesLayerClick',
        type: 'fill',
        source: 'airspacesSource',
      },
      'notamsLayer',
    );

    this.addClickListener();
  }

  setSource(
    airSpaces: GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirspace>,
  ): void {
    const source = this.mapService.instance.getSource(
      'airspacesSource',
    ) as GeoJSONSource;
    source.setData(airSpaces);
  }

  async setActiveState(activationAirspaceList: string[]): Promise<void> {
    const source = this.mapService.instance.getSource(
      'airspacesSource',
    ) as GeoJSONSource;
    const data = (await source.getData()) as GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      IAirspace
    >;

    source.updateData({
      update: data.features.map((feature) => ({
        id: feature.id!,
        addOrUpdateProperties: [
          {
            key: 'activityState',
            value: activationAirspaceList.find(
              (airspaceName) =>
                feature.properties.name === airspaceName ||
                feature.properties.name.startsWith(airspaceName + ' '),
            )
              ? 'Activated'
              : 'Deactivated',
          },
        ],
      })),
    });
  }

  async setErrorState(): Promise<void> {
    const source = this.mapService.instance.getSource(
      'airspacesSource',
    ) as GeoJSONSource;
    const data = (await source.getData()) as GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      IAirspace
    >;

    source.updateData({
      update: data.features.map((feature) => ({
        id: feature.id!,
        removeProperties: ['activityState'],
      })),
    });
  }

  reloadSettings(settings: IAirSpaceSettingsObject): void {
    this.mapService.instance.setFilter(
      'airspacesLayerBorder',
      this.createFilter(settings),
    );

    this.mapService.instance.setFilter(
      'airspacesLayerClick',
      this.createFilter(settings),
    );

    this.mapService.instance.setPaintProperty(
      'airspacesLayerClick',
      'fill-color',
      this.colors(settings),
    );
    this.mapService.instance.setPaintProperty(
      'airspacesLayerClick',
      'fill-opacity',
      this.opacity(settings),
    );
  }

  private addClickListener(): void {
    this.mapService.instance.on(
      'click',
      'airspacesLayerClick',
      (event: {
        features?: Feature<Geometry, GeoJsonProperties>[] | undefined;
      }) => {
        this.store.dispatch(
          layerAirSpacesActions.clicked({
            features: JSON.parse(
              JSON.stringify(event.features ?? []),
            ) as GeoJSON.Feature[],
          }),
        );
      },
    );
  }

  private createFilter(
    value: IAirSpaceSettingsObject,
  ): ExpressionFilterSpecification {
    const filterInTypes = Object.entries(value)
      .filter(([, value]) => value.enabled)
      .map(([key]) => Number.parseInt(key));

    const x = Object.entries(value).reduce<ExpressionSpecification>(
      (acc, [key, value]) =>
        [
          ...acc,
          Number(key),
          ['>=', ['zoom'], value.minZoom],
        ] as ExpressionSpecification,
      [
        'match',
        ['number', ['get', 'type']],
      ] as unknown as ExpressionSpecification,
    );

    return [
      'all',
      ['in', ['get', 'type'], ['literal', filterInTypes]],
      [...(x as unknown[]), true] as ExpressionSpecification,
    ];
  }

  private colors(
    value: IAirSpaceSettingsObject,
  ): DataDrivenPropertyValueSpecification<ColorSpecification> {
    return [
      ...Object.keys(value)
        .map((key) => Number.parseInt(key) as EAirSpaceType)
        .reduce(
          (acc, key) => [
            ...acc,
            [
              'all',
              ['==', ['get', 'type'], key],
              ['==', ['get', 'activityState'], 'Activated'],
            ],
            value[key]['Activated']?.color ?? 'grey',
            [
              'all',
              ['==', ['get', 'type'], key],
              ['==', ['get', 'activityState'], 'Deactivated'],
            ],
            value[key]['Deactivated']?.color ?? 'grey',
            ['all', ['==', ['get', 'type'], key]],
            value[key]['Unknown']?.color ?? 'grey',
          ],
          ['case'] as unknown[],
        ),
      'grey',
    ] as DataDrivenPropertyValueSpecification<ColorSpecification>;
  }

  private opacity(
    value: IAirSpaceSettingsObject,
  ): DataDrivenPropertyValueSpecification<number> {
    return [
      ...Object.keys(value)
        .map((key) => Number.parseInt(key) as EAirSpaceType)
        .reduce(
          (acc, key) => [
            ...acc,
            [
              'all',
              ['==', ['get', 'type'], key],
              ['==', ['get', 'activityState'], 'Activated'],
            ],
            value[key]['Activated']?.opacity ?? 0.1,
            [
              'all',
              ['==', ['get', 'type'], key],
              ['==', ['get', 'activityState'], 'Deactivated'],
            ],
            value[key]['Deactivated']?.opacity ?? 0.1,
            ['all', ['==', ['get', 'type'], key]],
            value[key]['Unknown']?.opacity ?? 0.1,
          ],
          ['case'] as unknown[],
        ),
      0.1,
    ] as DataDrivenPropertyValueSpecification<number>;
  }
}
