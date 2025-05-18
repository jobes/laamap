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
import { compassWidgetActions } from '../../../store/actions/widgets.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-compass-widget',
  templateUrl: './compass-widget.component.html',
  styleUrls: ['./compass-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag, TranslocoLocaleModule, MatIconModule],
})
export class CompassWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);

  safePosition = this.safePositionService.safePosition(
    this.store
      .select(instrumentsFeature.selectCompass)
      .pipe(map((val) => val.widgetPosition)),
    this.containers,
  );

  show = this.store.selectSignal(mapFeature.selectShowInstruments);
  settings = this.store.selectSignal(instrumentsFeature.selectCompass);
  heading = computed(() =>
    (
      '000' +
      Math.round(this.store.selectSignal(mapFeature.selectHeading)() ?? 0)
    ).slice(-3),
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      compassWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
