import { Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Feature, Point } from 'geojson';
import { LngLat } from 'maplibre-gl';

import { IDbInterestPoint } from '../../database/synced-db.service';
import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../services/notams/notams.interface';
import { IAirportResponse } from '../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../services/open-aip/airspaces.interfaces';
import { TrafficEntry } from '../../services/traffic/traffic.service';
import { mapLocationMenuActions } from '../../store/actions/map.actions';
import { AirportDialogComponent } from '../dialogs/airport-dialog/airport-dialog.component';
import { AirspacesDialogComponent } from '../dialogs/airspaces-dialog/airspaces-dialog.component';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../dialogs/create-interest-point-dialog/create-interest-point-dialog.component';
import { NotamsDialogComponent } from '../dialogs/notams-dialog/notams-dialog.component';
import { TrafficDialogComponent } from '../dialogs/traffic-dialog/traffic-dialog.component';

@Component({
  selector: 'laamap-map-location-menu',
  templateUrl: './map-location-menu.component.html',
  styleUrls: ['./map-location-menu.component.scss'],
  imports: [TranslocoModule, MatListModule, MatDialogModule],
})
export class MapLocationMenuComponent {
  private readonly bottomSheetRef =
    inject<MatBottomSheetRef<MapLocationMenuComponent>>(MatBottomSheetRef);
  data = inject<{
    airport?: {
      features: GeoJSON.Feature<Point, IAirportResponse>[];
    };
    airspace?: {
      features: GeoJSON.Feature[];
    };
    lngLat: LngLat;
    notams?: {
      features: GeoJSON.Feature[];
    };
    interestPoint?: {
      features: GeoJSON.Feature<Point, IDbInterestPoint>[];
    };
    traffic?: {
      features: GeoJSON.Feature<Point, TrafficEntry>[];
    };
  }>(MAT_BOTTOM_SHEET_DATA);
  private readonly mapHelper = inject(MapHelperFunctionsService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  showAirport(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const airPort = this.mapHelper.decodeGeoJsonProperties(
      features[0].properties,
    ) as IAirportResponse;

    this.dialog.open(AirportDialogComponent, {
      maxWidth: '100%',
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
      maxWidth: '100%',
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
      maxWidth: '100%',
      data: notams?.map((notam) => notam.decoded),
    });
  }

  showTraffic(features: GeoJSON.Feature[]): void {
    this.bottomSheetRef.dismiss();
    const trafficData = this.mapHelper.decodeGeoJsonProperties(
      features[0].properties,
    ) as TrafficEntry;

    this.dialog.open(TrafficDialogComponent, {
      maxWidth: '100%',
      data: trafficData,
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
      maxWidth: '100%',
      data: { mode: 'create', point } as CreateInterestPointDialogInput,
    });
  }

  editInterestPoint(feature: Feature<Point, IDbInterestPoint>): void {
    this.bottomSheetRef.dismiss();
    this.dialog.open(CreateInterestPointDialogComponent, {
      maxWidth: '100%',
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
