import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Point, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';

import {
  IDbCustomRoute,
  IDbInterestPoint,
} from '../../database/synced-db.service';
import { GlobalMenuInput } from '../../services/global-search/global-search.service';
import { MapService } from '../../services/map/map.service';
import { IAirport } from '../../services/open-aip/airport.interfaces';
import { globalSearchMenu } from '../../store/actions/navigation.actions';
import { AirportDialogComponent } from '../dialogs/airport-dialog/airport-dialog.component';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../dialogs/create-interest-point-dialog/create-interest-point-dialog.component';

@Component({
  selector: 'laamap-global-search-menu',
  standalone: true,
  imports: [TranslocoModule, MatListModule],
  templateUrl: './global-search-menu.component.html',
  styleUrl: './global-search-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchMenuComponent {
  private readonly bottomSheetRef = inject(
    MatBottomSheetRef<GlobalSearchMenuComponent>,
  );
  readonly data = inject(MAT_BOTTOM_SHEET_DATA) as GlobalMenuInput;
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly map = inject(MapService);

  activateRoute(route: IDbCustomRoute): void {
    this.store.dispatch(globalSearchMenu.activateRoute({ route }));
    this.bottomSheetRef.dismiss();
  }

  showPointDetails(point: GeoJSON.Feature<Point, IDbInterestPoint>): void {
    this.bottomSheetRef.dismiss();
    this.dialog
      .open(CreateInterestPointDialogComponent, {
        maxWidth: '100%',
        data: {
          mode: 'edit',
          value: { id: point.id, properties: point.properties },
        } as CreateInterestPointDialogInput,
      })
      .afterClosed();
  }

  showAirportDetails(point: GeoJSON.Feature<Point, IAirport>): void {
    this.bottomSheetRef.dismiss();
    this.dialog
      .open(AirportDialogComponent, {
        maxWidth: '100%',
        data: point.properties,
        closeOnNavigation: false,
      })
      .afterClosed();
  }

  showOnMap(point: Position): void {
    this.bottomSheetRef.dismiss();
    this.map.instance.flyTo({
      center: this.positionToLngLat(point),
      zoom: 12,
      bearing: 0,
      pitch: 0,
    });
  }

  addPointToNavigation(point: Position, name: string): void {
    this.store.dispatch(
      globalSearchMenu.addedPointToNavigation({
        point: this.positionToLngLat(point),
        name,
      }),
    );
    this.bottomSheetRef.dismiss();
  }

  startedNewRouteNavigation(point: Position, name: string): void {
    this.store.dispatch(
      globalSearchMenu.startedNewRouteNavigation({
        point: this.positionToLngLat(point),
        name,
      }),
    );
    this.bottomSheetRef.dismiss();
  }

  private positionToLngLat(pos: Position): LngLat {
    return {
      lng: pos[0],
      lat: pos[1],
    } as LngLat;
  }
}
