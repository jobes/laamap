import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  endWith,
  last,
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
          hours: Math.floor(seconds / 3600),
          minutes: Math.floor(seconds / 60) % 60,
          seconds: seconds % 60,
          active: true,
        })),
        // eslint-disable-next-line rxjs/no-unsafe-takeuntil
        takeUntil(this.actions$.pipe(ofType(mapActions.trackSavingEnded))),
        endWith({ hours: 0, minutes: 0, seconds: 0, active: false }),
        pairwise(),
        map(([first, second]) =>
          !second.active ? { ...first, active: false } : second
        )
      )
    ),
    startWith({ hours: 0, minutes: 0, seconds: 0, active: false })
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}
  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      instrumentsSettings.trackingWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
