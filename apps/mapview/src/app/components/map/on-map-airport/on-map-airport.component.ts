import { APP_BASE_HREF } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Host,
  Inject,
  Optional,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { ExpressionFilterSpecification } from 'maplibre-gl';
import { forkJoin } from 'rxjs';

import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import {
  EAirportType,
  IAirportResponse,
} from '../../../services/open-aip/airport.interfaces';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { AirportDialogComponent } from '../../airport-dialog/airport-dialog.component';

@Component({
  selector: 'laamap-on-map-airport',
  templateUrl: './on-map-airport.component.html',
  styleUrls: ['./on-map-airport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapAirportComponent {
  airPorts$ = this.openAip.getAirports$();
  EAirportType = EAirportType;
  imageLoaded = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly openAip: OpenAipService,
    private readonly dialog: MatDialog,
    private readonly mapHelper: MapHelperFunctionsService,
    @Inject(APP_BASE_HREF) private readonly baseHref: string,
    @Optional() @Host() private readonly map?: MapComponent
  ) {
    this.loadAirportImages();
  }

  hover(): void {
    if (this.map) {
      this.map.mapInstance.getCanvasContainer().style.cursor = 'pointer';
    }
  }

  hoverEnd(): void {
    if (this.map) {
      this.map.mapInstance.getCanvasContainer().style.cursor = '';
    }
  }

  airportClicked(airPortDef?: import('geojson').GeoJsonProperties): void {
    this.dialog.getDialogById('airspaceDialog')?.close();
    this.dialog.getDialogById('notamDialog')?.close();
    if (airPortDef) {
      const airPort = this.mapHelper.decodeGeoJsonProperties(
        airPortDef
      ) as IAirportResponse;

      this.dialog.open(AirportDialogComponent, {
        width: '100%',
        data: airPort,
        id: 'airportDialog',
        closeOnNavigation: false,
      });
    }
  }

  get zoomLevelBasedFilter(): ExpressionFilterSpecification {
    return [
      'match',
      ['number', ['get', 'type']],
      EAirportType.ULTRA_LIGHT_FLYING_SITE,
      ['>=', ['zoom'], 7.2],
      EAirportType.AERODROME_CLOSED,
      ['>=', ['zoom'], 7.2],
      EAirportType.AIRFIELD_CIVIL,
      ['>=', ['zoom'], 7],
      true,
    ];
  }

  private loadAirportImages(): void {
    if (!this.map) {
      return;
    }
    forkJoin([
      this.mapHelper.loadImageToMap(
        this.map,
        'runway-paved',
        this.baseHref + 'assets/open-aip-images/runway_paved-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'runway-unpaved',
        this.baseHref + 'assets/open-aip-images/runway_unpaved-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'ULTRA_LIGHT_FLYING_SITE', // ULTRA_LIGHT_FLYING_SITE
        this.baseHref + 'assets/open-aip-images/light_aircraft-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'AIRFIELD_CIVIL', // AIRFIELD_CIVIL
        this.baseHref + 'assets/open-aip-images/af_civil-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'INTERNATIONAL_AIRPORT', // INTERNATIONAL_AIRPORT
        this.baseHref + 'assets/open-aip-images/apt-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'MILITARY_AERODROME', // MILITARY_AERODROME
        this.baseHref + 'assets/open-aip-images/ad_mil-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'AERODROME_CLOSED', // AERODROME_CLOSED
        this.baseHref + 'assets/open-aip-images/ad_closed-small.svg'
      ),
      this.mapHelper.loadImageToMap(
        this.map,
        'HELIPORT_CIVIL', // HELIPORT_CIVIL
        this.baseHref + 'assets/open-aip-images/heli_civil-small.svg'
      ),
    ]).subscribe(() => {
      this.imageLoaded = true;
      this.cdr.detectChanges();
    });
  }
}
