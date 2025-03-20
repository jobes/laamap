import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { GamepadHandlerService } from '../../../services/gamepad-handler/gamepad-handler.service';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { gamepadWidgetActions } from '../../../store/actions/widgets.actions';
import { gamepadFeature } from '../../../store/features/settings/gamepad.feature';

@Component({
  selector: 'laamap-gamepad-widget',
  templateUrl: './gamepad-widget.component.html',
  styleUrls: ['./gamepad-widget.component.scss'],
  imports: [TranslocoModule, CdkDrag, TranslocoLocaleModule, MatIconModule],
  host: { '[style.visibility]': 'gamePadService.gamePadVisibility()' },
})
export class GamepadWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);
  readonly gamePadService = inject(GamepadHandlerService);

  disabled = this.gamePadService.disabled.asReadonly();
  safePosition = this.safePositionService.safePosition(
    this.store
      .select(gamepadFeature.selectWidget)
      .pipe(map((val) => val.position)),
    this.containers,
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      gamepadWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
