import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { GeoJSONSource } from 'maplibre-gl';

import { NotamsDialogComponent } from '../../../components/notams-dialog/notams-dialog.component';
import { MapHelperFunctionsService } from '../../map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../notams/notams.interface';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapNotamsService {
  constructor(
    private readonly mapService: MapService,
    private readonly dialog: MatDialog,
    private readonly mapHelper: MapHelperFunctionsService,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  createLayers(): void {
    this.mapService.instance.addSource('notamsSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    this.mapService.instance.addLayer({
      id: 'notamsLayer',
      type: 'fill',
      source: 'notamsSource',
      paint: {
        'fill-color': '#0000ff',
        'fill-opacity': 0.1,
        'fill-outline-color': '#0000ff',
      },
    });

    this.addListeners();
  }

  setNotamsGeoJson(geoJson: GeoJSON.GeoJSON): void {
    this.snackBar.open(
      this.translocoService.translate('notams.loaded'),
      undefined,
      {
        duration: 5000,
        politeness: 'polite',
      }
    );

    const source = this.mapService.instance.getSource(
      'notamsSource'
    ) as GeoJSONSource;
    source.setData(geoJson);
  }

  private addListeners(): void {
    this.mapService.instance.on('click', 'notamsLayer', (event) => {
      const notams = event.features?.map(
        (feature) =>
          this.mapHelper.decodeGeoJsonProperties(
            feature.properties
          ) as INotamDecodedResponse['notamList'][0]
      );

      this.dialog.open(NotamsDialogComponent, {
        width: '100%',
        data: notams?.map((notam) => notam.decoded),
        id: 'notamDialog',
      });
    });
  }
}
