import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  endWith,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';

import { mapActions } from '../../../store/map/map.actions';
import { mapFeature } from '../../../store/map/map.feature';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';
import { FlyTracingHistoryDialogComponent } from '../../fly-tracing-history-dialog/fly-tracing-history-dialog.component';

@Component({
  selector: 'laamap-tracking-widget',
  templateUrl: './tracking-widget.component.html',
  styleUrls: ['./tracking-widget.component.scss'],
})
export class TrackingWidgetComponent {
  show$ = this.store.select(mapFeature.selectShowInstruments);
  tracking$ = this.store.select(instrumentsFeature.selectTracking);
  currentFlyTime$ = this.actions$.pipe(
    ofType(mapActions.trackSavingStarted),
    switchMap(() =>
      timer(0, 1000).pipe(
        startWith(0),
        map((seconds) => ({
          seconds,
          active: true,
        })),
        // eslint-disable-next-line rxjs/no-unsafe-takeuntil
        takeUntil(this.actions$.pipe(ofType(mapActions.trackSavingEnded))),
        endWith({ seconds: 0, active: false }),
        pairwise(),
        map(([first, second]) =>
          !second.active ? { ...first, active: false } : second
        )
      )
    ),
    startWith({ seconds: 0, active: false })
  );

  private dragging = false;
  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog
  ) {}
  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);
    this.store.dispatch(
      instrumentsSettings.trackingWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }

  dragStarted(): void {
    this.dragging = true;
  }

  openHistory(): void {
    if (this.dragging) {
      return;
    }
    this.dialog
      .open(FlyTracingHistoryDialogComponent, {
        width: '100%',
        id: 'flyHistory',
      })
      .afterClosed();
  }
}
