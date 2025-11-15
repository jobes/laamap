import { Injectable, NgZone, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { GeolocateControl, LngLat, ScaleControl } from 'maplibre-gl';
import { AttributionControl, Map, NavigationControl } from 'maplibre-gl';
import { take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mapActions } from '../../store/actions/map.actions';
import { CompassService } from '../compass/compass.service';
import { GamepadHandlerService } from '../gamepad-handler/gamepad-handler.service';
import { MapFontSizeService } from './map-font-size.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly transloco = inject(TranslocoService);
  private readonly compassService = inject(CompassService);
  private readonly store = inject(Store);
  private readonly mapFontSize = inject(MapFontSizeService);
  private readonly gamepadHandlerService = inject(GamepadHandlerService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);
  private readonly zone = inject(NgZone);

  instance: Map;
  private tileStyleUrl = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${environment.mapTilesKey}`;

  constructor() {
    this.instance = new Map({
      container: 'map',
      style: this.tileStyleUrl,
      center: [19.471558112191815, 48.704923970323705],
      zoom: 7,
      attributionControl: false,
      maxPitch: 85,
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.instance._finalizeElevation = () => {}; // stop changing elevation, makes smoother animation
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
      this.zone.run(() => {
        this.store.dispatch(
          mapActions.moved({
            center: {
              lng: moved.target.getCenter().lng,
              lat: moved.target.getCenter().lat,
            },
          }),
        );
      });
    });

    this.instance.on('error', (error) => {
      console.warn(error);
      this.snackBar.open(
        this.translocoService.translate('mapView.mapError'),
        undefined,
        { duration: 5000 },
      );
    });

    this.setupClickEvents();
  }

  private setupClickEvents(): void {
    this.instance.on('load', () => {
      this.store.dispatch(mapActions.loaded());
    });

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
          const locale = {
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
          this.instance._locale = locale;
          this.addControlsToMap();
        },
      });
  }

  private addControlsToMap(): void {
    this.addSettingsControl();
    this.addGeoLocateControl();
    const navigationControl = new NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true,
    });
    this.overrideNavigationControl(navigationControl);
    this.instance.addControl(navigationControl);
    this.addNavigationControl();

    this.instance.addControl(
      new AttributionControl({
        customAttribution:
          '<a href="https://www.rainviewer.com/"; target="_blank">Rain viewer</a>',
      }),
      'bottom-right',
    );
    this.instance.addControl(new ScaleControl({}), 'bottom-right');
  }

  private overrideNavigationControl(control: NavigationControl): void {
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
    const control = new GeolocateControl({
      trackUserLocation: true,
      positionOptions: { enableHighAccuracy: true },
      showUserLocation: true,
      showAccuracyCircle: true,
    });

    control.on('geolocate', (geoLocation: GeolocationPosition | null) =>
      this.store.dispatch(
        mapActions.geolocationChanged({
          geoLocation: this.deepCopyGeoLocation(geoLocation),
          terrainElevation: this.terrainElevation(geoLocation),
        }),
      ),
    );
    control.on('trackuserlocationstart', () =>
      this.store.dispatch(mapActions.geolocationTrackingStarted()),
    );
    control.on('trackuserlocationend', () => {
      this.store.dispatch(
        mapActions.geolocationTrackingEnded({
          background: control._watchState !== 'OFF',
        }),
      );
    });
    this.overrideGeoLocationControl(control);
    this.instance.addControl(control);
  }

  private terrainElevation(
    geoLocation: GeolocationPosition | null,
  ): number | null {
    if (!this.instance.terrain || !geoLocation) {
      return null;
    }
    return (
      this.instance.terrain.getElevationForLngLatZoom(
        new LngLat(geoLocation.coords.longitude, geoLocation.coords.latitude),
        this.instance.transform.tileZoom,
      ) / this.instance.terrain.exaggeration
    );
  }

  private overrideGeoLocationControl(control: GeolocateControl): void {
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
    } as GeolocationPosition;
  }

  private addSettingsControl(): void {
    const button = this.createButton();
    button.textContent = 'settings';
    button.title = this.instance._getUIString(
      'SettingControl.Settings' as 'FullscreenControl.Enter',
    );
    button.addEventListener('click', () => this.settingsClicked());
  }

  private addNavigationControl(): void {
    const button = this.createButton();
    button.textContent = 'navigation';
    button.setAttribute('navigation-dialog', '');
    button.title = this.instance._getUIString(
      'NavigationControl.Navigation' as 'FullscreenControl.Enter',
    );
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
