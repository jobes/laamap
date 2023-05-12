import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { altimeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetModule,
    NgIf,
    CdkDrag,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    AltitudePipe,
  ],
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
      altimeterWidgetActions.manualGNDAltitudeChanged({
        gndAltitude,
      })
    );
  }

  typeTrack(index: number, type: string): string {
    return type;
  }
}
