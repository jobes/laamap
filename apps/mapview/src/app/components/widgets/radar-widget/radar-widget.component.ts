import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { radarSettingsActions } from '../../../store/settings/radar/radar.actions';
import { radarFeature } from '../../../store/settings/radar/radar.feature';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
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
      radarSettingsActions.widgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
