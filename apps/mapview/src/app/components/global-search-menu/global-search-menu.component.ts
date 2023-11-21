import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { ICustomFlyRoute } from '../../services/custom-fly-routes/custom-fly-routes.service';
import { globalSearchMenu } from '../../store/actions/navigation.actions';
import { Store } from '@ngrx/store';
import { IInterestPoint } from '../../services/interest-points/interest-points.service';
import { Point, Position } from '@turf/turf';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../dialogs/create-interest-point-dialog/create-interest-point-dialog.component';
import { MapService } from '../../services/map/map.service';
import { LngLat } from 'maplibre-gl';
import { IAirport } from '../../services/open-aip/airport.interfaces';
import { AirportDialogComponent } from '../dialogs/airport-dialog/airport-dialog.component';
import { GlobalMenuInput } from '../../services/global-search/global-search.service';

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

  activateRoute(route: ICustomFlyRoute): void {
    this.store.dispatch(globalSearchMenu.activateRoute({ route }));
    this.bottomSheetRef.dismiss();
  }

  showPointDetails(point: GeoJSON.Feature<Point, IInterestPoint>): void {
    this.bottomSheetRef.dismiss();
    this.dialog
      .open(CreateInterestPointDialogComponent, {
        width: '100%',
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
        width: '100%',
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
