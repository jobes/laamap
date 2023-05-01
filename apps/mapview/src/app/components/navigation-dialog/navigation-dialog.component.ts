import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationDialogActions } from '../../store/actions/navigation.actions';
import { navigationFeature } from '../../store/features/navigation.feature';
import { FlyTracingHistoryDialogComponent } from '../fly-tracing-history-dialog/fly-tracing-history-dialog.component';

@Component({
  selector: 'laamap-navigation-dialog',
  templateUrl: './navigation-dialog.component.html',
  styleUrls: ['./navigation-dialog.component.scss'],
})
export class NavigationDialogComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  currentRoute$ = this.store.select(navigationFeature.selectRoute);
  running$ = this.store.select(navigationFeature.selectRunning);

  drop(
    event: CdkDragDrop<string[]>,
    oldRoute: { point: LngLat; name: string }[]
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

  routeTrack(index: number, item: { name: string; point: LngLat }): string {
    return `${index}${item.point.lat};${item.point.lng}`;
  }
}
