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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExpressionFilterSpecification } from 'maplibre-gl';
import { forkJoin } from 'rxjs';

import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import {
  EAirportType,
  IAirportResponse,
} from '../../../services/open-aip/airport.interfaces';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { AirportDialogComponent } from '../../airport-dialog/airport-dialog.component';

@UntilDestroy()
@Component({
  selector: 'laamap-on-map-airport',
  templateUrl: './on-map-airport.component.html',
  styleUrls: ['./on-map-airport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapAirportComponent {
  airPorts$ = this.openAip.getAirports$();
  eAirportType = EAirportType;
  imageLoaded = false;
  imageList = {
    runwayPaved: 'runway_paved-small.svg',
    runwayUnpaved: 'runway_unpaved-small.svg',
    ultralightFlyingSite: 'light_aircraft-small.svg',
    airfieldCivil: 'af_civil-small.svg',
    internationalAirport: 'apt-small.svg',
    militaryAerodrome: 'ad_mil-small.svg',
    aerodromeClosed: 'ad_closed-small.svg',
    heliportCivil: 'heli_civil-small.svg',
  };

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
      EAirportType.ultralightFlyingSite,
      ['>=', ['zoom'], 7.2],
      EAirportType.aerodromeClosed,
      ['>=', ['zoom'], 7.2],
      EAirportType.airfieldCivil,
      ['>=', ['zoom'], 7],
      true,
    ];
  }

  private loadAirportImages(): void {
    if (!this.map) {
      return;
    }
    const mapCmp = this.map;

    forkJoin(
      Object.entries(this.imageList).map(([name, src]) =>
        this.mapHelper.loadImageToMap$(
          mapCmp,
          name,
          `${this.baseHref}assets/open-aip-images/${src}`
        )
      )
    )
      .pipe(untilDestroyed(this))
      .subscribe({
        complete: () => {
          this.imageLoaded = true;
          this.cdr.detectChanges();
        },
      });
  }
}
