import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
})
export class AltimeterWidgetComponent {
  eHeightUnit = EHeightUnit;
  heighWithSettings$ = this.store.select(selectHeighSettings);

  private dragging = false;
  constructor(private readonly store: Store) {}

  dragStarted(): void {
    this.dragging = true;
  }
  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);

    this.store.dispatch(
      instrumentsSettings.altimeterWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }

  resetGnd(gndAltitude: number): void {
    if (this.dragging) {
      return;
    }

    this.store.dispatch(
      instrumentsSettings.altimeterManualGndAltitudeChanged({
        gndAltitude,
      })
    );
  }

  typeTrack(index: number, type: string): string {
    return type;
  }
}
