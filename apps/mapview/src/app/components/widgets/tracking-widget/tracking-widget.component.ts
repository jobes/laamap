import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
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

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { mapEffectsActions } from '../../../store/actions/effects.actions';
import { trackingWidgetActions } from '../../../store/actions/widgets.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';
import { FlyTracingHistoryDialogComponent } from '../../dialogs/fly-tracing-history-dialog/fly-tracing-history-dialog.component';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';

@Component({
  selector: 'laamap-tracking-widget',
  templateUrl: './tracking-widget.component.html',
  styleUrls: ['./tracking-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetDirective,
    NgIf,
    CdkDrag,
    AsyncPipe,
    DigitalTimePipe,
    MatDialogModule,
  ],
})
export class TrackingWidgetComponent {
  @ViewChildren(CdkDrag, { read: ElementRef })
  readonly containers!: QueryList<ElementRef<HTMLElement>>;
  private readonly safePositionService = inject(WidgetSafePositionService);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  tracking$ = this.store.select(instrumentsFeature.selectTracking);
  currentFlyTime$ = this.actions$.pipe(
    ofType(mapEffectsActions.trackSavingStarted),
    switchMap(() =>
      timer(0, 1000).pipe(
        startWith(0),
        map((seconds) => ({
          seconds,
          active: true,
        })),
        // eslint-disable-next-line rxjs/no-unsafe-takeuntil
        takeUntil(
          this.actions$.pipe(ofType(mapEffectsActions.trackSavingEnded)),
        ),
        endWith({ seconds: 0, active: false }),
        pairwise(),
        map(([first, second]) =>
          !second.active ? { ...first, active: false } : second,
        ),
      ),
    ),
    startWith({ seconds: 0, active: false }),
  );
  safePosition$ = this.safePositionService.safePosition$(
    this.tracking$.pipe(map((val) => val.position)),
    this,
  );

  private dragging = false;
  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
  ) {}
  dragEnded(event: CdkDragEnd): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);
    this.store.dispatch(
      trackingWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
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
