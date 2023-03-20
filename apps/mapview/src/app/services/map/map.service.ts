import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import maplibregl from 'maplibre-gl';
import { Map } from 'maplibre-gl';
import { take } from 'rxjs';

import { SettingsDialogComponent } from '../../components/settings-dialog/settings-dialog.component';
import { mapActions } from '../../store/map/map.actions';
import { CompassService } from '../compass/compass.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  instance: Map;
  private tileStyleUrl = `https://api.maptiler.com/maps/topo-v2/style.json?key=${
    process.env['NX_MAP_TILES_KEY'] ?? 'MISSING_KEY'
  }`;

  constructor(
    private readonly transloco: TranslocoService,
    private readonly dialog: MatDialog,
    private readonly compassService: CompassService,
    private readonly store: Store
  ) {
    this.instance = new Map({
      container: 'map',
      style: this.tileStyleUrl,
      center: [19.471558112191815, 48.704923970323705],
      zoom: 7,
      attributionControl: false,
      maxPitch: 85,
    });
    this.addTranslatedControlsToMap();
    this.setupEvents();
    this.compassService.init();
  }

  private setupEvents(): void {
    this.instance.on('rotate', (event) => {
      this.store.dispatch(
        mapActions.rotated({ bearing: event.target.getBearing() })
      );
    });

    this.instance?.on('move', (moved) => {
      this.store.dispatch(
        mapActions.moved({
          center: {
            lng: moved.target.getCenter().lng,
            lat: moved.target.getCenter().lat,
          },
        })
      );
    });

    this.instance?.on('load', () => {
      this.store.dispatch(mapActions.loaded());
    });
  }

  private addTranslatedControlsToMap(): void {
    this.transloco
      .selectTranslateObject('mapView')
      .pipe(take(1))
      .subscribe({
        next: (translations) => {
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          this.instance._locale = {
            ...this.instance._locale,
            'GeolocateControl.FindMyLocation': translations.findMyLocation,
            'GeolocateControl.LocationNotAvailable':
              translations.locationNotAvailable,
            'NavigationControl.ResetBearing': translations.resetBearing,
            'NavigationControl.ZoomIn': translations.zoomIn,
            'NavigationControl.ZoomOut': translations.zoomOut,
            'SettingControl.Settings': translations.settings,
          };
          this.addControlsToMap();
        },
      });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  private addControlsToMap(): void {
    this.addSettingsControl();
    this.addGeoLocateControl();

    this.instance.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      })
    );

    this.instance.addControl(
      new maplibregl.AttributionControl({
        customAttribution:
          '<a href="https://www.rainviewer.com/"; target="_blank">Rain viewer</a>',
      }),
      'bottom-right'
    );

    this.instance.addControl(new maplibregl.ScaleControl({}), 'bottom-right');
  }

  private addGeoLocateControl(): void {
    const control = new maplibregl.GeolocateControl({
      trackUserLocation: true,
      positionOptions: { enableHighAccuracy: true },
      showUserLocation: true,
      showAccuracyCircle: true,
    });

    control.on('geolocate', (geoLocation: GeolocationPosition | null) =>
      this.store.dispatch(
        mapActions.geolocationChanged({
          geoLocation: geoLocation
            ? {
                coords: {
                  accuracy: geoLocation.coords.accuracy,
                  altitude: geoLocation.coords.altitude,
                  altitudeAccuracy: geoLocation.coords.altitudeAccuracy,
                  heading: geoLocation.coords.heading,
                  latitude: geoLocation.coords.latitude,
                  longitude: geoLocation.coords.longitude,
                  speed: geoLocation.coords.speed,
                },
                timestamp: geoLocation.timestamp,
              }
            : null,
        })
      )
    );
    this.instance.addControl(control);
  }

  private addSettingsControl(): void {
    const box = document.createElement('div');
    const button = document.createElement('button');
    box.appendChild(button);

    box.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    button.style.fontFamily = 'Material Icons';
    button.style.fontSize = '20px';
    button.textContent = 'settings';
    button.title = this.instance._getUIString(
      'SettingControl.Settings'
    ) as string;
    button.addEventListener('click', () => this.settingsClicked());

    this.instance.addControl({
      onAdd: () => box,
      onRemove: () => box.parentNode?.removeChild(box),
      getDefaultPosition: () => 'top-right',
    });
  }

  private settingsClicked(): void {
    this.dialog
      .open(SettingsDialogComponent, { width: '100%', id: 'settingDialog' })
      .afterClosed();
  }
}
