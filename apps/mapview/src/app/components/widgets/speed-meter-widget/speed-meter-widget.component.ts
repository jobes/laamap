import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { speedMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { selectColorsBySpeed } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { map } from 'rxjs';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
  standalone: true,
  imports: [TranslocoModule, LetDirective, NgIf, CdkDrag, AsyncPipe],
})
export class SpeedMeterWidgetComponent {
  @ViewChildren(CdkDrag, { read: ElementRef })
  readonly containers!: QueryList<ElementRef<HTMLElement>>;
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  colorsBySpeed$ = this.store.select(selectColorsBySpeed);
  safePosition$ = this.safePositionService.safePosition$(
    this.colorsBySpeed$.pipe(map((val) => val.position)),
    this,
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      speedMeterWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
