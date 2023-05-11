import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule, PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { radarWidgetActions } from '../../../store/actions/widgets.actions';
import { radarFeature } from '../../../store/features/settings/radar.feature';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetModule,
    NgIf,
    CdkDrag,
    TranslocoLocaleModule,
    PushModule,
  ],
})
export class RadarWidgetComponent {
  radarSettings$ = this.store.select(radarFeature['selectSettings.radarState']);
  currentAnimationFrame$ = this.rainViewer.currentAnimationFrame$;

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService
  ) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      radarWidgetActions.positionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
