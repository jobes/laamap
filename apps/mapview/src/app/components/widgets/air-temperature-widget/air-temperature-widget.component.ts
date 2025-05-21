import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { airTemperatureWidgetActions } from '../../../store/actions/widgets.actions';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-air-temperature-widget',
  templateUrl: './air-temperature-widget.component.html',
  styleUrls: ['./air-temperature-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag, TranslocoLocaleModule, MatIconModule],
})
export class AirTemperatureWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);

  safePosition = this.safePositionService.safePosition(
    this.store
      .select(instrumentsFeature.selectAirTemperature)
      .pipe(map((val) => val.widgetPosition)),
    this.containers,
  );

  show = computed(
    () =>
      this.store.selectSignal(instrumentsFeature.selectAirTemperature)().show &&
      this.store.selectSignal(planeInstrumentsFeature.selectConnected)(),
  );
  settings = this.store.selectSignal(instrumentsFeature.selectAirTemperature);
  temperature = this.store.selectSignal(
    planeInstrumentsFeature.selectAirTemperature,
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      airTemperatureWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
