import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { varioMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { colorsByClimbing } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-variometer-widget',
  templateUrl: './variometer-widget.component.html',
  styleUrls: ['./variometer-widget.component.scss'],
  imports: [
    TranslocoModule,
    LetDirective,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
  ],
})
export class VariometerWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly store = inject(Store);
  private readonly safePositionService = inject(WidgetSafePositionService);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  private varioMeterSettings$ = this.store.select(
    instrumentsFeature.selectVarioMeter,
  );

  colorsByClimbing$ = this.varioMeterSettings$.pipe(
    switchMap((settings) => this.store.pipe(colorsByClimbing(settings))),
  );

  safePosition$ = this.safePositionService.safePosition$(
    this.varioMeterSettings$.pipe(map((val) => val.position)),
    toObservable(this.containers),
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      varioMeterWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
