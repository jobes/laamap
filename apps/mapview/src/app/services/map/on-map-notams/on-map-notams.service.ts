import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { GeoJSONSource } from 'maplibre-gl';

import { layerNotamsActions } from '../../../store/actions/map.actions';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapNotamsService {
  private readonly mapService = inject(MapService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);
  private readonly store = inject(Store);

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
      },
    );

    const source = this.mapService.instance.getSource(
      'notamsSource',
    ) as GeoJSONSource;
    source.setData(geoJson);
  }

  private addListeners(): void {
    this.mapService.instance.on('click', 'notamsLayer', (event) => {
      this.store.dispatch(
        layerNotamsActions.clicked({
          features: JSON.parse(
            JSON.stringify(event.features ?? []),
          ) as GeoJSON.Feature[],
        }),
      );
    });
  }
}
