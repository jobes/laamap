import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { altimeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
  standalone: true,
  imports: [TranslocoModule, LetDirective, CdkDrag, AsyncPipe, AltitudePipe],
})
export class AltimeterWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  eHeightUnit = EHeightUnit;
  heighWithSettings$ = this.store.select(selectHeighSettings);
  safePosition$ = this.safePositionService.safePosition$(
    this.heighWithSettings$.pipe(map((val) => val.position)),
    toObservable(this.containers),
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

  resetGnd(gndAltitude: number): void {
    if (this.dragging) {
      return;
    }

    this.store.dispatch(
      altimeterWidgetActions.manualGNDAltitudeChanged({
        gndAltitude,
      }),
    );
  }
}
