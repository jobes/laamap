import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import {
  ColorSpecification,
  DataDrivenPropertyValueSpecification,
  ExpressionFilterSpecification,
  ExpressionSpecification,
  FillLayerSpecification,
} from 'maplibre-gl';
import { map } from 'rxjs';
import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import {
  EAirSpaceType,
  IAirspace,
} from '../../../services/open-aip/airspaces.interfaces';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { IAirSpaceSettingsObject } from '../../../store/core/airspaces-defauls';
import { selectAirspacesSettings } from '../../../store/core/core.selectors';
import { AirspacesDialogComponent } from '../../airspaces-dialog/airspaces-dialog.component';

@Component({
  selector: 'laamap-on-map-air-spaces',
  templateUrl: './on-map-air-spaces.component.html',
  styleUrls: ['./on-map-air-spaces.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapAirSpacesComponent {
  airSpaces$ = this.openAip.getAirSPaces$();
  settings$ = this.store.select(selectAirspacesSettings);
  filter$ = this.settings$.pipe(map((settings) => this.toFilter(settings)));
  paint2D$ = this.settings$.pipe(map((settings) => this.toPaint2D(settings)));

  constructor(
    private readonly openAip: OpenAipService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly mapHelper: MapHelperFunctionsService
  ) {}

  airspaceClicked(event: {
    features?: Feature<Geometry, GeoJsonProperties>[] | undefined;
  }): void {
    const airspaces = event.features?.map(
      (feature) =>
        this.mapHelper.decodeGeoJsonProperties(feature.properties) as IAirspace
    );

    this.dialog.open(AirspacesDialogComponent, {
      width: '100%',
      data: airspaces,
      id: 'airspaceDialog',
    });
  }

  private toFilter(
    value: IAirSpaceSettingsObject
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
      ] as unknown as ExpressionSpecification
    );

    return [
      'all',
      ['in', ['get', 'type'], ['literal', filterInTypes]],
      [...(x as unknown[]), true] as ExpressionSpecification,
    ];
  }

  private toPaint2D(
    value: IAirSpaceSettingsObject
  ): FillLayerSpecification['paint'] {
    return {
      'fill-color': this.colors(value),
      'fill-opacity': this.opacity(value),
    };
  }

  private colors(
    value: IAirSpaceSettingsObject
  ): DataDrivenPropertyValueSpecification<ColorSpecification> {
    return [
      ...Object.keys(value)
        .map((key) => Number.parseInt(key) as EAirSpaceType)
        .reduce(
          (acc, key) => [
            ...acc,
            ['==', ['get', 'type'], key],
            value[key]?.color ?? 'grey',
          ],
          ['case'] as unknown[]
        ),
      'grey',
    ] as DataDrivenPropertyValueSpecification<ColorSpecification>;
  }

  private opacity(
    value: IAirSpaceSettingsObject
  ): DataDrivenPropertyValueSpecification<number> {
    return [
      ...Object.keys(value)
        .map((key) => Number.parseInt(key) as EAirSpaceType)
        .reduce(
          (acc, key) => [
            ...acc,
            ['==', ['get', 'type'], key],
            value[key]?.opacity ?? 0.1,
          ],
          ['case'] as unknown[]
        ),
      0.1,
    ] as DataDrivenPropertyValueSpecification<number>;
  }
}
