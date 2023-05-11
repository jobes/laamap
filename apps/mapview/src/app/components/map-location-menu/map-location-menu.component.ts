import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Point } from '@turf/turf';
import { LngLat } from 'maplibre-gl';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../services/notams/notams.interface';
import { IAirportResponse } from '../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../services/open-aip/airspaces.interfaces';
import { mapLocationMenuActions } from '../../store/actions/map.actions';
import { AirportDialogComponent } from '../airport-dialog/airport-dialog.component';
import { AirspacesDialogComponent } from '../airspaces-dialog/airspaces-dialog.component';
import { NotamsDialogComponent } from '../notams-dialog/notams-dialog.component';

@Component({
  selector: 'laamap-map-location-menu',
  templateUrl: './map-location-menu.component.html',
  styleUrls: ['./map-location-menu.component.scss'],
  standalone: true,
  imports: [TranslocoModule, MatListModule, NgIf, MatDialogModule],
})
export class MapLocationMenuComponent {
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<MapLocationMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      airport?: {
        features: GeoJSON.Feature<Point, IAirportResponse>[];
      };
      airspace?: { features: GeoJSON.Feature[] };
      lngLat: LngLat;
      notams?: { features: GeoJSON.Feature[] };
    },
    private readonly mapHelper: MapHelperFunctionsService,
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  showAirport(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const airPort = this.mapHelper.decodeGeoJsonProperties(
      features[0].properties
    ) as IAirportResponse;

    this.dialog.open(AirportDialogComponent, {
      width: '100%',
      data: airPort,
      closeOnNavigation: false,
    });
  }

  showAirspaces(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const airspaces = features?.map(
      (feature) =>
        this.mapHelper.decodeGeoJsonProperties(feature.properties) as IAirspace
    );

    this.dialog.open(AirspacesDialogComponent, {
      width: '100%',
      data: airspaces,
    });
  }

  showNotams(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const notams = features?.map(
      (feature) =>
        this.mapHelper.decodeGeoJsonProperties(
          feature.properties
        ) as INotamDecodedResponse['notamList'][0]
    );

    this.dialog.open(NotamsDialogComponent, {
      width: '100%',
      data: notams?.map((notam) => notam.decoded),
    });
  }

  newNavigation(point: LngLat): void {
    this.bottomSheetRef.dismiss();
    this.store.dispatch(
      mapLocationMenuActions.startedNewRouteNavigation({
        point,
        name: this.getPointName(point),
      })
    );
  }

  addToNavigation(point: LngLat): void {
    this.bottomSheetRef.dismiss();
    this.store.dispatch(
      mapLocationMenuActions.addedPointToNavigation({
        point,
        name: this.getPointName(point),
      })
    );
  }

  private getPointName(point: LngLat): string {
    return this.data.airport
      ? `${this.data.airport.features[0].properties?.['name']}` +
          (this.data.airport.features[0].properties?.['icaoCode']
            ? `(${this.data.airport.features[0].properties?.['icaoCode']})`
            : '')
      : `${point.lat.toFixed(4)} ${point.lng.toFixed(4)}`;
  }
}
