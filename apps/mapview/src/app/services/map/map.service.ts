import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import maplibregl from 'maplibre-gl';
import { Map } from 'maplibre-gl';
import { take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mapActions } from '../../store/actions/map.actions';
import { CompassService } from '../compass/compass.service';
import { GamepadHandlerService } from '../gamepad-handler/gamepad-handler.service';
import { MapFontSizeService } from './map-font-size.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  instance: Map;
  private tileStyleUrl = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${environment.mapTilesKey}`;

  constructor(
    private readonly transloco: TranslocoService,
    private readonly compassService: CompassService,
    private readonly store: Store,
    private readonly mapFontSize: MapFontSizeService,
    private readonly gamepadHandlerService: GamepadHandlerService,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
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
    this.gamepadHandlerService.init(this.instance);
  }

  setMapFontSizeRatio(ratio: number) {
    this.mapFontSize.setMapFontSizeRatio(ratio, this.instance);
  }

  private setupEvents(): void {
    this.instance.on('rotate', (event) => {
      this.store.dispatch(
        mapActions.rotated({ bearing: event.target.getBearing() }),
      );
    });

    this.instance.on('move', (moved) => {
      this.store.dispatch(
        mapActions.moved({
          center: {
            lng: moved.target.getCenter().lng,
            lat: moved.target.getCenter().lat,
          },
        }),
      );
    });

    this.instance.on('load', () => {
      this.store.dispatch(mapActions.loaded());
    });
    this.instance.on('error', () => {
      this.snackBar.open(
        this.translocoService.translate('mapView.mapError'),
        undefined,
        { duration: 5000 },
      );
    });
    this.setupClickEvents();
  }

  private setupClickEvents(): void {
    this.instance.on('click', (e) => {
      this.store.dispatch(
        mapActions.clicked({
          lngLat: { lat: e.lngLat.lat, lng: e.lngLat.lng },
        }),
      );
    });

    this.instance.on('zoom', () => {
      this.store.dispatch(mapActions.zoom());
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
      'bottom-right',
    );
    this.instance.addControl(new maplibregl.ScaleControl({}), 'bottom-right');
  }

  private overrideNavigationControl(
    control: maplibregl.NavigationControl,
  ): void {
    // remove listeners
    const clonedZoomIn = control._zoomInButton.cloneNode(
      true,
    ) as HTMLButtonElement;
    control._zoomInButton.replaceWith(clonedZoomIn);
    control._zoomInButton = clonedZoomIn;

    const clonedZoomOut = control._zoomOutButton.cloneNode(
      true,
    ) as HTMLButtonElement;
    control._zoomOutButton.replaceWith(clonedZoomOut);
    control._zoomOutButton = clonedZoomOut;

    // add new listener
    control._zoomInButton.addEventListener('click', (e) =>
      this.instance.zoomIn({}, { originalEvent: e, geolocateSource: true }),
    );
    control._zoomOutButton.addEventListener('click', (e) =>
      this.instance.zoomOut({}, { originalEvent: e, geolocateSource: true }),
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
        }),
      ),
    );
    control.on('trackuserlocationstart', () =>
      this.store.dispatch(mapActions.geolocationTrackingStarted()),
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
    control: maplibregl.GeolocateControl,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    control._updateCamera = () => {}; // disable auto updating camera, do it through effects
  }

  private deepCopyGeoLocation(
    geoLocation: GeolocationPosition | null,
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
    const button = this.createButton();
    button.textContent = 'settings';
    button.title = this.instance._getUIString(
      'SettingControl.Settings',
    ) as string;
    button.addEventListener('click', () => this.settingsClicked());
  }

  private addNavigationControl(): void {
    const button = this.createButton();
    button.textContent = 'navigation';
    button.setAttribute('navigation-dialog', '');
    button.title = this.instance._getUIString(
      'NavigationControl.Navigation',
    ) as string;
    button.addEventListener('click', () => this.navigationClicked());
  }

  private createButton(): HTMLButtonElement {
    const box = document.createElement('div');
    const button = document.createElement('button');
    box.appendChild(button);

    box.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    button.style.fontFamily = 'Material Icons';
    button.style.fontSize = '20px';

    this.instance.addControl({
      onAdd: () => box,
      onRemove: () => box.parentNode?.removeChild(box),
      getDefaultPosition: () => 'top-right',
    });

    return button;
  }

  private settingsClicked(): void {
    this.store.dispatch(mapActions.settingsClicked());
  }

  private navigationClicked(): void {
    this.store.dispatch(mapActions.navigationClicked());
  }
}
