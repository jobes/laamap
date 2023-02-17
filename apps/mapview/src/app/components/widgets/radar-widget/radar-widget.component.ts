import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { rainViewersWidgetSettings } from '../../../store/core/core.actions';
import { selectRadar } from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
})
export class RadarWidgetComponent {
  radarSettings$ = this.store.select(selectRadar);
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
      rainViewersWidgetSettings.positionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
