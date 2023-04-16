import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import maplibregl from 'maplibre-gl';
import { Map } from 'maplibre-gl';
import { take } from 'rxjs';

import { NavigationDialogComponent } from '../../components/navigation-dialog/navigation-dialog.component';
import { SettingsDialogComponent } from '../../components/settings-dialog/settings-dialog.component';
import { mapActions } from '../../store/map/map.actions';
import { CompassService } from '../compass/compass.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  instance: Map;
  private tileStyleUrl = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${
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

  setMapFontSizeRatio(ratio: number) {
    this.setTownFontSizeRatio(ratio);
    this.setCityFontSizeRatio(ratio);
    this.setVillageFontSizeRatio(ratio);
    this.setCapitalFontSizeRatio(ratio);
    this.setPlaceOtherFontSizeRatio(ratio);
    this.setWaterFontSizeRatio(ratio);
  }

  private setupEvents(): void {
    this.instance.on('rotate', (event) => {
      this.store.dispatch(
        mapActions.rotated({ bearing: event.target.getBearing() })
      );
    });

    this.instance.on('move', (moved) => {
      this.store.dispatch(
        mapActions.moved({
          center: {
            lng: moved.target.getCenter().lng,
            lat: moved.target.getCenter().lat,
          },
        })
      );
    });

    this.instance.on('load', () => {
      this.store.dispatch(mapActions.loaded());
    });

    this.instance.on('click', (e) => {
      this.store.dispatch(
        mapActions.clicked({ lngLat: { lat: e.lngLat.lat, lng: e.lngLat.lng } })
      );
    });

    this.instance.on('dblclick', () => {
      this.store.dispatch(mapActions.doubleClicked());
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
            'NavigationControl.Navigation': translations.navigation,
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
    const navigationControl = new maplibregl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true,
    });
    this.overrideNavigationControl(navigationControl);
    this.instance.addControl(navigationControl);
    this.addNavigationControl();

    this.instance.addControl(
      new maplibregl.AttributionControl({
        customAttribution:
          '<a href="https://www.rainviewer.com/"; target="_blank">Rain viewer</a>',
      }),
      'bottom-right'
    );
    this.instance.addControl(new maplibregl.ScaleControl({}), 'bottom-right');
  }

  private overrideNavigationControl(
    control: maplibregl.NavigationControl
  ): void {
    // remove listeners
    const clonedZoomIn = control._zoomInButton.cloneNode(
      true
    ) as HTMLButtonElement;
    control._zoomInButton.replaceWith(clonedZoomIn);
    control._zoomInButton = clonedZoomIn;

    const clonedZoomOut = control._zoomOutButton.cloneNode(
      true
    ) as HTMLButtonElement;
    control._zoomOutButton.replaceWith(clonedZoomOut);
    control._zoomOutButton = clonedZoomOut;

    // add new listener
    control._zoomInButton.addEventListener('click', (e) =>
      this.instance.zoomIn({}, { originalEvent: e, geolocateSource: true })
    );
    control._zoomOutButton.addEventListener('click', (e) =>
      this.instance.zoomOut({}, { originalEvent: e, geolocateSource: true })
    );
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
          geoLocation: this.deepCopyGeoLocation(geoLocation),
        })
      )
    );
    control.on('trackuserlocationstart', () =>
      this.store.dispatch(mapActions.geolocationTrackingStaring())
    );
    control.on('trackuserlocationend', () => {
      if (control._watchState === 'OFF') {
        this.store.dispatch(mapActions.geolocationTrackingEnded());
      }
    });
    this.overrideGeoLocationControl(control);
    this.instance.addControl(control);
  }

  private overrideGeoLocationControl(
    control: maplibregl.GeolocateControl
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    control._updateCamera = () => {}; // disable auto updating camera, do it through effects
  }

  private deepCopyGeoLocation(
    geoLocation: GeolocationPosition | null
  ): GeolocationPosition | null {
    if (!geoLocation) {
      return null;
    }
    return {
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
    };
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

  private addNavigationControl(): void {
    const box = document.createElement('div');
    const button = document.createElement('button');
    box.appendChild(button);

    box.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    button.style.fontFamily = 'Material Icons';
    button.style.fontSize = '20px';
    button.textContent = 'navigation';
    button.title = this.instance._getUIString(
      'NavigationControl.Navigation'
    ) as string;
    button.addEventListener('click', () => this.navigationClicked());

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

  private navigationClicked(): void {
    this.dialog
      .open(NavigationDialogComponent, { width: '100%', id: 'settingDialog' })
      .afterClosed();
  }

  private setTownFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('place_town', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCityFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('place_city', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setVillageFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('place_village', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setPlaceOtherFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('place_other', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCapitalFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('place_capital', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setWaterFontSizeRatio(ratio: number) {
    this.instance.setLayoutProperty('water_way_name', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    this.instance.setLayoutProperty('water_name_line', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    this.instance.setLayoutProperty('water_name_point', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }
}
