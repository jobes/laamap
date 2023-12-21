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
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { radarWidgetActions } from '../../../store/actions/widgets.actions';
import { radarFeature } from '../../../store/features/settings/radar.feature';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { map } from 'rxjs';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetDirective,
    NgIf,
    CdkDrag,
    TranslocoLocaleModule,
    PushPipe,
    AsyncPipe,
  ],
})
export class RadarWidgetComponent {
  @ViewChildren(CdkDrag, { read: ElementRef })
  readonly containers!: QueryList<ElementRef<HTMLElement>>;
  private readonly safePositionService = inject(WidgetSafePositionService);
  radarSettings$ = this.store.select(radarFeature['selectSettings.radarState']);
  currentAnimationFrame$ = this.rainViewer.currentAnimationFrame$;
  safePosition$ = this.safePositionService.safePosition$(
    this.radarSettings$.pipe(map((val) => val.widget.position)),
    this,
  );

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService,
  ) {}

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
