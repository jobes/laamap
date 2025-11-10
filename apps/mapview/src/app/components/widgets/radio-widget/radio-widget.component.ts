import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { radioWidgetActions } from '../../../store/actions/widgets.actions';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';
import { RadioDialogComponent } from '../../dialogs/radio-dialog/radio-dialog.component';

@Component({
  selector: 'laamap-radio-widget',
  templateUrl: './radio-widget.component.html',
  styleUrls: ['./radio-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag, TranslocoLocaleModule],
})
export class RadioWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private dragging = false;

  safePosition = this.safePositionService.safePositionSignal(
    computed(
      () => this.store.selectSignal(instrumentsFeature.selectRadio)().position,
    ),
    this.containers,
  );

  activeFreq = this.store.selectSignal(
    planeInstrumentsFeature.selectRadioActiveFreq,
  );
  activeName = this.store.selectSignal(
    planeInstrumentsFeature.selectRadioActiveFreqName,
  );
  rxState = this.store.selectSignal(planeInstrumentsFeature.selectRadioRxState);
  txState = this.store.selectSignal(planeInstrumentsFeature.selectRadioTxState);
  errorState = this.store.selectSignal(
    planeInstrumentsFeature.selectRadioError,
  );
  enabled = computed(
    () => this.store.selectSignal(instrumentsFeature.selectRadio)().show,
  );

  dragEnded(event: CdkDragEnd): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);

    this.store.dispatch(
      radioWidgetActions.positionMoved({
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

  openRadioDialog(): void {
    if (this.dragging) {
      return;
    }

    this.dialog
      .open(RadioDialogComponent, {
        maxWidth: '100%',
        id: 'radioFrequencySet',
      })
      .afterClosed();
  }
}
