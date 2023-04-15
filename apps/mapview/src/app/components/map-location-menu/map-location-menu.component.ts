import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { LngLat } from 'maplibre-gl';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../services/notams/notams.interface';
import { IAirportResponse } from '../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../services/open-aip/airspaces.interfaces';
import { AirportDialogComponent } from '../airport-dialog/airport-dialog.component';
import { AirspacesDialogComponent } from '../airspaces-dialog/airspaces-dialog.component';
import { NotamsDialogComponent } from '../notams-dialog/notams-dialog.component';

@Component({
  selector: 'laamap-map-location-menu',
  templateUrl: './map-location-menu.component.html',
  styleUrls: ['./map-location-menu.component.scss'],
})
export class MapLocationMenuComponent {
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<MapLocationMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      airport?: { features: GeoJSON.Feature[] };
      airspace?: { features: GeoJSON.Feature[] };
      lngLat: LngLat;
      notams?: { features: GeoJSON.Feature[] };
    },
    private readonly mapHelper: MapHelperFunctionsService,
    private readonly dialog: MatDialog
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
    console.log(point);
  }
}
