import { APP_BASE_HREF } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExpressionFilterSpecification, GeoJSONSource } from 'maplibre-gl';
import { Observable, forkJoin } from 'rxjs';

import {
  layerAirportActions,
  layerInterestPointsActions,
} from '../../../store/actions/map.actions';
import { MapHelperFunctionsService } from '../../map-helper-functions/map-helper-functions.service';
import { EAirportType, IAirport } from '../../open-aip/airport.interfaces';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapAirportsService {
  private readonly mapService = inject(MapService);
  private readonly store = inject(Store);
  private readonly mapHelper = inject(MapHelperFunctionsService);
  private readonly baseHref = inject(APP_BASE_HREF);

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

  private airports?: GeoJSON.FeatureCollection<GeoJSON.Point, IAirport>;

  createLayers(): void {
    this.mapService.instance.addSource('airportSource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.addOrientationLayer();
    this.addAirportTypeLayer();
    this.addListeners();
  }

  setSource(airports: GeoJSON.FeatureCollection<GeoJSON.Point, IAirport>) {
    this.airports = airports;
    const source = this.mapService.instance.getSource(
      'airportSource',
    ) as GeoJSONSource;
    source.setData(airports);
  }

  addRequiredImages$(): Observable<true[]> {
    return forkJoin(
      Object.entries(this.imageList).map(([name, src]) =>
        this.mapHelper.loadImageToMap$(
          this.mapService.instance,
          name,
          `${this.baseHref}public/open-aip-images/${src}`,
        ),
      ),
    );
  }

  searchAirport(
    searchText: string | null,
    limit = 5,
  ): GeoJSON.Feature<GeoJSON.Point, IAirport>[] {
    if (!searchText || !this.airports) {
      return [];
    }
    return this.airports.features
      .filter(
        (airport) =>
          airport.properties.icaoCode
            ?.toUpperCase()
            .includes(searchText.toUpperCase()) ||
          airport.properties.name
            ?.toUpperCase()
            .includes(searchText.toUpperCase()),
      )
      .sort((a, b) => this.sortByAirportName(searchText, a, b))
      .slice(0, limit);
  }

  private addListeners(): void {
    this.addAirportListeners();
    this.addInterestPointsListeners();
  }

  private addAirportListeners(): void {
    this.mapService.instance.on('mouseenter', 'airportTypeLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = 'pointer';
    });

    this.mapService.instance.on('mouseleave', 'airportTypeLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = '';
    });

    this.mapService.instance.on('click', 'airportTypeLayer', (event) => {
      this.store.dispatch(
        layerAirportActions.clicked({
          features: JSON.parse(
            JSON.stringify(event.features ?? []),
          ) as GeoJSON.Feature[],
        }),
      );
    });
  }

  private addInterestPointsListeners(): void {
    this.mapService.instance.on('mouseenter', 'interestPointsLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = 'pointer';
    });

    this.mapService.instance.on('mouseleave', 'interestPointsLayer', () => {
      this.mapService.instance.getCanvasContainer().style.cursor = '';
    });

    this.mapService.instance.on('click', 'interestPointsLayer', (event) => {
      this.store.dispatch(
        layerInterestPointsActions.clicked({
          features: JSON.parse(
            JSON.stringify(event.features ?? []),
          ) as GeoJSON.Feature[],
        }),
      );
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
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          // zoom is 13 (or less) value is 1
          13,
          1,
          // zoom is 22 (or greater) value is 9
          22,
          10,
        ],
        'icon-allow-overlap': true,
        'icon-rotate': ['get', 'trueHeading', ['get', 'mainRunway']],
        'icon-rotation-alignment': 'map',
      },
    });
  }

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
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          // zoom is 13 (or less) value is 1
          13,
          1,
          // zoom is 22 (or greater) value is 9
          22,
          10,
        ],
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

  private sortByAirportName(
    pointName: string,
    a: GeoJSON.Feature<GeoJSON.Geometry, IAirport>,
    b: GeoJSON.Feature<GeoJSON.Geometry, IAirport>,
  ): number {
    if (
      a.properties.name?.toUpperCase().startsWith(pointName.toUpperCase()) &&
      !b.properties.name?.toUpperCase().startsWith(pointName.toUpperCase())
    ) {
      return -1;
    }
    if (
      !a.properties.name?.toUpperCase().startsWith(pointName.toUpperCase()) &&
      b.properties.name?.toUpperCase().startsWith(pointName.toUpperCase())
    ) {
      return 1;
    }
    return a.properties.name
      ?.toUpperCase()
      .localeCompare(b.properties.name?.toUpperCase());
  }
}
