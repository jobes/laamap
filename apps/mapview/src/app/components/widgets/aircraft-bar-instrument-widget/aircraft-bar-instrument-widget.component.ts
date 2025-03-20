import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { aircraftBarInstrumentsWidgetActions } from '../../../store/actions/widgets.actions';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { PlaneInstrumentsBarKeys } from '../../../store/features/plane-instruments.initial-state';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-aircraft-bar-instrument-widget',
  templateUrl: './aircraft-bar-instrument-widget.component.html',
  styleUrls: ['./aircraft-bar-instrument-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag],
})
export class AircraftBarInstrumentWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  readonly type = input.required<PlaneInstrumentsBarKeys>();
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);

  extendedValue = computed(() =>
    this.store.selectSignal(
      planeInstrumentsFeature.selectExtended(this.type()),
    )(),
  );
  barsDefs = computed(() =>
    this.store.selectSignal(
      instrumentsFeature.selectAircraftInstrumentBars(this.type()),
    )(),
  );
  safePosition = this.safePositionService.safePositionSignal(
    computed(() => this.barsDefs().position),
    this.containers,
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      aircraftBarInstrumentsWidgetActions.positionMoved({
        instrumentType: this.type(),
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
