import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { GeoJSONSource } from 'maplibre-gl';

import { mapActions } from '../../../store/map/map.actions';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapNotamsService {
  constructor(
    private readonly mapService: MapService,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly store: Store
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
      this.store.dispatch(
        mapActions.notamLayerClicked({
          features: JSON.parse(
            JSON.stringify(event.features ?? [])
          ) as GeoJSON.Feature[],
        })
      );
    });
  }
}
