import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { altimeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
})
export class AltimeterWidgetComponent {
  show$ = this.store.select(mapFeature.selectShowInstruments);
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
      altimeterWidgetActions.positionMoved({
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
      altimeterWidgetActions.manualGndAltitudeChanged({
        gndAltitude,
      })
    );
  }

  typeTrack(index: number, type: string): string {
    return type;
  }
}
