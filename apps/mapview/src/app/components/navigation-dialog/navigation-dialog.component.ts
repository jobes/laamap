import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationDialogActions } from '../../store/actions/navigation.actions';
import { navigationFeature } from '../../store/features/navigation.feature';
import { FlyTracingHistoryDialogComponent } from '../fly-tracing-history-dialog/fly-tracing-history-dialog.component';
import { ListInterestPointsDialogComponent } from '../list-interest-points-dialog/list-interest-points-dialog.component';

@Component({
  selector: 'laamap-navigation-dialog',
  templateUrl: './navigation-dialog.component.html',
  styleUrls: ['./navigation-dialog.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogModule,
    NgIf,
    MatListModule,
    CdkDropList,
    NgFor,
    CdkDrag,
    MatIconModule,
    MatDividerModule,
    LetModule,
    MatButtonModule,
    PushModule,
  ],
})
export class NavigationDialogComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  currentRoute$ = this.store.select(navigationFeature.selectRoute);
  running$ = this.store.select(navigationFeature.selectRunning);

  drop(
    event: CdkDragDrop<string[]>,
    oldRoute: { point: LngLat; name: string }[],
  ) {
    const route = [...oldRoute];
    moveItemInArray(route, event.previousIndex, event.currentIndex);
    this.store.dispatch(navigationDialogActions.routeReordered({ route }));
  }

  deleteRoutePoint(index: number): void {
    this.store.dispatch(navigationDialogActions.routeItemDeleted({ index }));
  }

  deleteRoute(): void {
    this.store.dispatch(navigationDialogActions.routeCleared());
  }

  startNavigation(): void {
    this.store.dispatch(navigationDialogActions.navigationStarted());
  }

  stopNavigation(): void {
    this.store.dispatch(navigationDialogActions.navigationEnded());
  }

  showTrackHistory(): void {
    this.dialog
      .open(FlyTracingHistoryDialogComponent, {
        width: '100%',
        id: 'flyHistory',
      })
      .afterClosed();
  }

  showPoiList(): void {
    this.dialog
      .open(ListInterestPointsDialogComponent, {
        width: '100%',
        id: 'poiList',
      })
      .afterClosed();
  }

  routeTrack(index: number, item: { name: string; point: LngLat }): string {
    return `${index}${item.point.lat};${item.point.lng}`;
  }
}
