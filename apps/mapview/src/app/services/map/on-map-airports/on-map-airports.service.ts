import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpressionFilterSpecification } from 'maplibre-gl';
import { Observable, forkJoin } from 'rxjs';

import { AirportDialogComponent } from '../../../components/airport-dialog/airport-dialog.component';
import { MapHelperFunctionsService } from '../../map-helper-functions/map-helper-functions.service';
import {
  EAirportType,
  IAirport,
  IAirportResponse,
} from '../../open-aip/airport.interfaces';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapAirportsService {
  readonly fontSize = 12;
  private imageList = {
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
    private readonly mapService: MapService,
    private readonly dialog: MatDialog,
    private readonly mapHelper: MapHelperFunctionsService,
    @Inject(APP_BASE_HREF) private readonly baseHref: string
  ) {}

  createLayers(
    airports: GeoJSON.FeatureCollection<GeoJSON.Geometry, IAirport>
  ): void {
    this.mapService.instance.addSource('airportSource', {
      type: 'geojson',
      data: airports,
    });

    this.addOrientationLayer();
    this.addAirportTypeLayer();
    this.addListeners();
  }

  addRequiredImages$(): Observable<true[]> {
    return forkJoin(
      Object.entries(this.imageList).map(([name, src]) =>
        this.mapHelper.loadImageToMap$(
          this.mapService.instance,
          name,
          `${this.baseHref}assets/open-aip-images/${src}`
        )
      )
    );
  }

  private addListeners(): void {
    this.mapService.instance.on('mouseenter', 'airportTypeLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = 'pointer';
    });

    this.mapService.instance.on('mouseleave', 'airportTypeLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = '';
    });

    this.mapService.instance.on('click', 'airportTypeLayer', (event) => {
      this.dialog.getDialogById('airspaceDialog')?.close();
      this.dialog.getDialogById('notamDialog')?.close();
      if (event.features?.[0]?.properties) {
        const airPort = this.mapHelper.decodeGeoJsonProperties(
          event.features?.[0]?.properties
        ) as IAirportResponse;

        this.dialog.open(AirportDialogComponent, {
          width: '100%',
          data: airPort,
          id: 'airportDialog',
          closeOnNavigation: false,
        });
      }
    });
  }

  private get zoomLevelBasedFilter(): ExpressionFilterSpecification {
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

  // eslint-disable-next-line max-lines-per-function
  private addOrientationLayer(): void {
    this.mapService.instance.addLayer({
      id: 'airportOrientationLayer',
      type: 'symbol',
      source: 'airportSource',
      filter: [
        'all',
        [
          'in',
          ['get', 'type'],
          [
            'literal',
            [
              EAirportType.airport,
              EAirportType.airfieldCivil,
              EAirportType.internationalAirport,
              EAirportType.militaryAerodrome,
              EAirportType.ultralightFlyingSite,
              EAirportType.ifr,
              EAirportType.landingStrip,
              EAirportType.agriculturalLandingStrip,
              EAirportType.altiport,
            ],
          ],
        ],
        this.zoomLevelBasedFilter,
      ],
      layout: {
        'icon-image': [
          'case',
          ['get', 'paved', ['get', 'mainRunway']],
          'runwayPaved',
          'runwayUnpaved',
        ],
        'icon-size': 1,
        'icon-allow-overlap': true,
        'icon-rotate': ['get', 'trueHeading', ['get', 'mainRunway']],
        'icon-rotation-alignment': 'map',
      },
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private addAirportTypeLayer(): void {
    this.mapService.instance.addLayer({
      id: 'airportTypeLayer',
      type: 'symbol',
      source: 'airportSource',
      filter: this.zoomLevelBasedFilter,
      layout: {
        'icon-image': [
          'match',
          ['number', ['get', 'type']],
          EAirportType.internationalAirport,
          'internationalAirport',
          EAirportType.ultralightFlyingSite,
          'ultralightFlyingSite',
          EAirportType.airfieldCivil,
          'airfieldCivil',
          EAirportType.militaryAerodrome,
          'militaryAerodrome',
          EAirportType.aerodromeClosed,
          'aerodromeClosed',
          EAirportType.heliportCivil,
          'heliportCivil',
          'airfieldCivil',
        ],
        'icon-size': 1,
        'icon-allow-overlap': true,
        'text-field': [
          'step',
          ['zoom'],
          '',
          9,
          ['get', 'name'],
          11,
          [
            'concat',
            ['get', 'name'],
            '\n',
            [
              'case',
              ['has', 'value', ['get', 'mainFrequency']],
              ['concat', ['get', 'value', ['get', 'mainFrequency']], 'MHz'],
              '',
            ],
          ],
        ],
        'text-optional': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -1.2],
        'text-size': this.fontSize,
        'icon-rotation-alignment': 'map',
      },
    });
  }
}
