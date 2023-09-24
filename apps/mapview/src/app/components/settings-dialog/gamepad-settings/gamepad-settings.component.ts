import { AsyncPipe, KeyValuePipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { BehaviorSubject, filter } from 'rxjs';

import {
  ActiveGamePadButtons,
  GamepadHandlerService,
  IGamePaDActions,
} from '../../../services/gamepad-handler/gamepad-handler.service';

@UntilDestroy()
@Component({
  selector: 'laamap-gamepad-settings',
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    LetDirective,
    AsyncPipe,
    KeyValuePipe,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './gamepad-settings.component.html',
  styleUrls: ['./gamepad-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamepadSettingsComponent implements OnInit {
  private readonly gamepadService = inject(GamepadHandlerService);
  private readonly ref = inject(ElementRef);
  settings$ = new BehaviorSubject({
    zoomIn: {
      index: 0,
      axes: 0,
      button: 15,
      coefficient: -10,
      axesThreshold: 0.3,
    },
  }).asObservable();

  valueChanged(): void {
    const result: { [key: string]: IGamePaDActions } = {};
    (this.ref.nativeElement as HTMLDivElement)
      .querySelectorAll('[block-name]')
      .forEach((block) => {
        const name = block.getAttribute('block-name');
        const def = {
          index: this.getAttributeValue(block, 'gamepad-index') || 0,
          axes: this.getAttributeValue(block, 'axis'),
          button: this.getAttributeValue(block, 'button'),
          coefficient: this.getAttributeValue(block, 'coefficient'),
          axesThreshold: this.getAttributeValue(block, 'axes-threshold'),
        };
        result[name ?? ''] = def;
      });
    console.log('changed', result);
  }

  ngOnInit(): void {
    this.gamepadService.gamePadActive$
      .pipe(
        filter((val) => !!val && this.gamepadService.settingMode),
        untilDestroyed(this)
      )
      .subscribe({
        next: (input) => this.processGamePadInput(input),
      });
  }

  expandedChange(value: boolean) {
    this.gamepadService.settingMode = value;
  }

  trackByKey(
    index: number,
    item: { key: string; value: IGamePaDActions }
  ): string {
    return item.key;
  }

  private processGamePadInput(input: ActiveGamePadButtons | null): void {
    if (document.activeElement?.getAttribute('name') === 'gamepad-index') {
      (document.activeElement as HTMLInputElement).value = Object.keys(
        input ?? {}
      ).join(', ');
    } else {
      const gamepadIndex = this.getActiveInputGamePadIndex();
      if (gamepadIndex || gamepadIndex === 0) {
        if (document.activeElement?.getAttribute('name') === 'button') {
          (document.activeElement as HTMLInputElement).value = Object.keys(
            input?.[gamepadIndex]?.buttons ?? {}
          ).join(', ');
        }
        if (document.activeElement?.getAttribute('name') === 'axis') {
          (document.activeElement as HTMLInputElement).value = Object.keys(
            input?.[gamepadIndex]?.axes ?? {}
          ).join(', ');
        }
      }
      this.valueChanged();
    }
  }

  private getAttributeValue(block: Element, name: string): number | undefined {
    const num = Number.parseInt(
      (block.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value,
      10
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
      10
    );
    return gamepadIndex || gamepadIndex === 0 ? gamepadIndex : undefined;
  }
}
