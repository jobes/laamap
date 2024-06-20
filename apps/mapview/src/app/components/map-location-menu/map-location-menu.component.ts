import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Feature, Point } from '@turf/turf';
import { LngLat } from 'maplibre-gl';

import { IDbInterestPoint } from '../../database/synced-db.service';
import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../services/notams/notams.interface';
import { IAirportResponse } from '../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../services/open-aip/airspaces.interfaces';
import { mapLocationMenuActions } from '../../store/actions/map.actions';
import { AirportDialogComponent } from '../dialogs/airport-dialog/airport-dialog.component';
import { AirspacesDialogComponent } from '../dialogs/airspaces-dialog/airspaces-dialog.component';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../dialogs/create-interest-point-dialog/create-interest-point-dialog.component';
import { NotamsDialogComponent } from '../dialogs/notams-dialog/notams-dialog.component';

@Component({
  selector: 'laamap-map-location-menu',
  templateUrl: './map-location-menu.component.html',
  styleUrls: ['./map-location-menu.component.scss'],
  standalone: true,
  imports: [TranslocoModule, MatListModule, MatDialogModule],
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
      interestPoint?: {
        features: GeoJSON.Feature<Point, IDbInterestPoint>[];
      };
    },
    private readonly mapHelper: MapHelperFunctionsService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
  ) {}

  showAirport(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const airPort = this.mapHelper.decodeGeoJsonProperties(
      features[0].properties,
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
        this.mapHelper.decodeGeoJsonProperties(feature.properties) as IAirspace,
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
          feature.properties,
        ) as INotamDecodedResponse['notamList'][0],
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
        point: this.getPointLocation(point),
        name: this.getPointName(point),
      }),
    );
  }

  addToNavigation(point: LngLat): void {
    this.bottomSheetRef.dismiss();
    this.store.dispatch(
      mapLocationMenuActions.addedPointToNavigation({
        point: this.getPointLocation(point),
        name: this.getPointName(point),
      }),
    );
  }

  newInterestPoint(point: LngLat): void {
    this.bottomSheetRef.dismiss();
    this.dialog.open(CreateInterestPointDialogComponent, {
      width: '100%',
      data: { mode: 'create', point } as CreateInterestPointDialogInput,
    });
  }

  editInterestPoint(feature: Feature<Point, IDbInterestPoint>): void {
    this.bottomSheetRef.dismiss();
    this.dialog.open(CreateInterestPointDialogComponent, {
      width: '100%',
      data: {
        mode: 'edit',
        value: { id: feature.id, properties: feature.properties },
      } as CreateInterestPointDialogInput,
    });
  }

  private getPointLocation(point: LngLat): LngLat {
    if (this.data.airport) {
      return {
        lat: this.data.airport.features[0].geometry.coordinates[1],
        lng: this.data.airport.features[0].geometry.coordinates[0],
      } as LngLat;
    } else if (this.data.interestPoint) {
      return {
        lat: this.data.interestPoint.features[0].geometry.coordinates[1],
        lng: this.data.interestPoint.features[0].geometry.coordinates[0],
      } as LngLat;
    }
    return point;
  }

  private getPointName(point: LngLat): string {
    if (this.data.airport) {
      return (
        `${this.data.airport.features[0].properties?.['name']}` +
        (this.data.airport.features[0].properties?.['icaoCode']
          ? `(${this.data.airport.features[0].properties?.['icaoCode']})`
          : '')
      );
    }
    if (this.data.interestPoint) {
      return this.data.interestPoint.features[0].properties.name;
    }
    return `${point.lat.toFixed(4)} ${point.lng.toFixed(4)}`;
  }
}
