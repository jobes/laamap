import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { altimeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { AltimeterQuickSetDialogComponent } from '../../dialogs/altimeter-quick-set-dialog/altimeter-quick-set-dialog.component';

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag, AltitudePipe],
})
export class AltimeterWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly dialog = inject(MatDialog);
  private readonly safePositionService = inject(WidgetSafePositionService);
  show = this.store.selectSignal(mapFeature.selectShowInstruments);
  eHeightUnit = EHeightUnit;
  heighWithSettings = this.store.selectSignal(selectHeighSettings);
  safePosition = this.safePositionService.safePosition(
    toObservable(this.heighWithSettings).pipe(map((val) => val.position)),
    this.containers,
  );

  private dragging = false;
  constructor(private readonly store: Store) {}

  dragStarted(): void {
    this.dragging = true;
  }
  dragEnded(event: CdkDragEnd): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);

    this.store.dispatch(
      altimeterWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }

  openQuickSettings(): void {
    if (this.dragging) {
      return;
    }

    this.dialog
      .open(AltimeterQuickSetDialogComponent, {
        maxWidth: '100%',
        id: 'altimeterQuickSet',
      })
      .afterClosed();
  }
}
