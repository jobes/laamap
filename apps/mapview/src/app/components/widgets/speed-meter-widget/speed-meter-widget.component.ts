import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { speedMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectColorsBySpeed } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
  standalone: true,
  imports: [TranslocoModule, LetModule, NgIf, CdkDrag, AsyncPipe],
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
      speedMeterWidgetActions.positionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
