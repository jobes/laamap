import { Injectable, WritableSignal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { emulateTab } from 'emulate-tab';

import { RadioDialogComponent } from '../../components/dialogs/radio-dialog/radio-dialog.component';
import { actionFirstTime } from './gamepad-handler.functions';
import {
  ActiveGamePadButtons,
  GamePadShortCutName,
  IGamePadActions,
} from './gamepad-handler.types';

@Injectable({
  providedIn: 'root',
})
export class GamepadGlobalMenuHandler {
  private readonly dialog = inject(MatDialog);
  searchComponent?: {
    isOpen: WritableSignal<boolean>;
    keyDown: (event: KeyboardEvent) => void;
    searchBoxClicked: () => void;
  };

  processGlobalSearch(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): boolean {
    if (
      actionFirstTime(definition.openGlobalSearch, active, old, () =>
        this.searchComponent?.searchBoxClicked(),
      )
    ) {
      return true;
    }
    return false;
  }

  processRadioDialog(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): boolean {
    if (
      actionFirstTime(definition.radioDialog, active, old, () =>
        this.dialog
          .open(RadioDialogComponent, {
            maxWidth: '100%',
            id: 'radioFrequencySet',
            data: { fromGamepad: true },
          })
          .afterClosed(),
      )
    ) {
      return true;
    }
    return false;
  }

  reactOnGlobalSearchEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    if (
      actionFirstTime(definition.closeDialog, active, old, () => {
        this.sendKeyDown('Escape');
      })
    ) {
      return;
    }

    if (
      actionFirstTime(definition.dialogDo, active, old, () => {
        this.sendKeyDown('Enter');
        setTimeout(() => {
          emulateTab.backwards();
        }, 1000);
      })
    ) {
      return;
    }

    this.reactOnArrows(old, active, definition);
  }

  private reactOnArrows(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    if (
      actionFirstTime(definition.nextField, active, old, () => {
        this.sendKeyDown('ArrowDown');
      })
    ) {
      return;
    }

    if (
      actionFirstTime(definition.previousField, active, old, () => {
        this.sendKeyDown('ArrowUp');
      })
    ) {
      return;
    }
  }

  private sendKeyDown(code: string): void {
    this.searchComponent?.keyDown({
      code: code,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      preventDefault: () => {},
    } as KeyboardEvent);
  }
}
