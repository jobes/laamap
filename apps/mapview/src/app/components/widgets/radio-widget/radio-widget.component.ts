import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { radioWidgetActions } from '../../../store/actions/widgets.actions';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

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

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      radioWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
