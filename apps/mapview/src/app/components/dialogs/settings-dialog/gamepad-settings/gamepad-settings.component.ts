import { AsyncPipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil } from 'rxjs';

import { GamepadHandlerService } from '../../../../services/gamepad-handler/gamepad-handler.service';
import {
  ActiveGamePadButtons,
  GamePadShortCutName,
  IGamePadActions,
} from '../../../../services/gamepad-handler/gamepad-handler.types';
import { gamePadSettingsActions } from '../../../../store/actions/settings.actions';
import { gamepadFeature } from '../../../../store/features/settings/gamepad.feature';

@Component({
  selector: 'laamap-gamepad-settings',
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    AsyncPipe,
    KeyValuePipe,
    AsyncPipe,
  ],
  templateUrl: './gamepad-settings.component.html',
  styleUrls: ['./gamepad-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamepadSettingsComponent implements OnInit, OnDestroy {
  private readonly destroyer$ = new Subject();
  private readonly gamepadService = inject(GamepadHandlerService);
  private readonly store = inject(Store);
  private readonly ref = inject(ElementRef);
  settings$ = this.store.select(gamepadFeature.selectShortCuts);

  valueChanged(): void {
    const result = {} as { [key in GamePadShortCutName]: IGamePadActions };
    (this.ref.nativeElement as HTMLDivElement)
      .querySelectorAll('[block-name]')
      .forEach((block) => {
        const name = block.getAttribute('block-name') as GamePadShortCutName;
        const def = {
          index: this.getAttributeValue(block, 'gamepad-index') || 0,
          axes: this.getAttributeValue(block, 'axis'),
          button: this.getAttributeValue(block, 'button'),
          coefficient: this.getAttributeValue(block, 'coefficient'),
          axesThreshold: this.getAttributeValue(block, 'axes-threshold'),
        };
        result[name ?? ''] = def;
      });
    this.store.dispatch(gamePadSettingsActions.setShortCuts({ value: result }));
  }

  ngOnInit(): void {
    this.gamepadService.gamePadActive$
      .pipe(
        filter((val) => !!val && this.gamepadService.settingMode()),
        takeUntil(this.destroyer$),
      )
      .subscribe({
        next: (input) => this.processGamePadInput(input),
      });
  }

  ngOnDestroy(): void {
    this.gamepadService.settingMode.set(false);
    this.destroyer$.next(null);
    this.destroyer$.complete();
  }

  expandedChange(value: boolean) {
    this.gamepadService.settingMode.set(value);
  }

  private processGamePadInput(input: ActiveGamePadButtons | null): void {
    if (document.activeElement?.getAttribute('name') === 'gamepad-index') {
      (document.activeElement as HTMLInputElement).value = Object.keys(
        input ?? {},
      ).join(', ');
    } else {
      const gamepadIndex = this.getActiveInputGamePadIndex();
      if (gamepadIndex || gamepadIndex === 0) {
        if (document.activeElement?.getAttribute('name') === 'button') {
          (document.activeElement as HTMLInputElement).value = Object.keys(
            input?.[gamepadIndex]?.buttons ?? {},
          ).join(', ');
        }
        if (document.activeElement?.getAttribute('name') === 'axis') {
          (document.activeElement as HTMLInputElement).value = Object.keys(
            input?.[gamepadIndex]?.axes ?? {},
          ).join(', ');
        }
      }
      this.valueChanged();
    }
  }

  private getAttributeValue(block: Element, name: string): number | undefined {
    const num = Number.parseFloat(
      (block.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value,
    );
    return isNaN(num) ? undefined : num;
  }

  private getActiveInputGamePadIndex(): number | undefined {
    const gamepadIndex = Number.parseInt(
      (
        document.activeElement
          ?.closest('.mat-expansion-panel-body')
          ?.querySelectorAll('[name="gamepad-index"]')?.[0] as HTMLInputElement
      )?.value,
      10,
    );
    return gamepadIndex || gamepadIndex === 0 ? gamepadIndex : undefined;
  }
}
