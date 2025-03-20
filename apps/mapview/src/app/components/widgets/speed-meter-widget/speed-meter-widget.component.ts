import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { speedMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectColorsBySpeed } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
  imports: [TranslocoModule, LetDirective, CdkDrag, AsyncPipe],
})
export class SpeedMeterWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  colorsBySpeed$ = this.store.select(selectColorsBySpeed);
  safePosition$ = this.safePositionService.safePosition$(
    this.colorsBySpeed$.pipe(map((val) => val.position)),
    toObservable(this.containers),
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      speedMeterWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
