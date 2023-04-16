import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

import { navigationActions } from '../../store/navigation/navigation.actions';
import { navigationFeature } from '../../store/navigation/navigation.feature';
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
    this.store.dispatch(navigationActions.reorderRoute({ route }));
  }

  deleteRoutePoint(index: number): void {
    this.store.dispatch(navigationActions.routeItemDeleted({ index }));
  }

  deleteRoute(): void {
    this.store.dispatch(navigationActions.routeClear());
  }

  startNavigation(): void {
    this.store.dispatch(navigationActions.startNavigation());
  }

  stopNavigation(): void {
    this.store.dispatch(navigationActions.endNavigation());
  }

  showTrackHistory(): void {
    this.dialog
      .open(FlyTracingHistoryDialogComponent, {
        width: '100%',
        id: 'flyHistory',
      })
      .afterClosed();
  }
}
