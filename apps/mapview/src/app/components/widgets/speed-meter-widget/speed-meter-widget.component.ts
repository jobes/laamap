import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectColorsBySpeed } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/map/map.feature';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
})
export class SpeedMeterWidgetComponent {
  show$ = this.store.select(mapFeature.selectShowInstruments);
  colorsBySpeed$ = this.store.select(selectColorsBySpeed);

  constructor(private readonly store: Store) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      instrumentsSettings.speedMeterWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
