import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { radarWidgetActions } from '../../../store/actions/widgets.actions';
import { radarFeature } from '../../../store/features/settings/radar.feature';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
  imports: [
    TranslocoModule,
    LetDirective,
    CdkDrag,
    TranslocoLocaleModule,
    PushPipe,
    AsyncPipe,
  ],
})
export class RadarWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly store = inject(Store);
  private readonly rainViewer = inject(RainViewerService);
  private readonly safePositionService = inject(WidgetSafePositionService);
  radarSettings$ = this.store.select(radarFeature['selectSettings.radarState']);
  currentAnimationFrame$ = this.rainViewer.currentAnimationFrame$;
  safePosition$ = this.safePositionService.safePosition$(
    this.radarSettings$.pipe(map((val) => val.widget.position)),
    toObservable(this.containers),
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      radarWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
