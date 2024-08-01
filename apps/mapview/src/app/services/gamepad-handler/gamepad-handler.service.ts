import { Injectable, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { emulateTab } from 'emulate-tab';
import maplibregl, { Map, PointLike } from 'maplibre-gl';
import {
  Subject,
  animationFrameScheduler,
  distinctUntilChanged,
  filter,
  map,
  of,
  pairwise,
  repeat,
  scheduled,
  switchMap,
} from 'rxjs';

import { gamepadFeature } from '../../store/features/settings/gamepad.feature';
import { GamepadGlobalMenuHandler } from './gamepad-global-menu-handler';
import {
  actionDefToNumber,
  actionFirstTime,
} from './gamepad-handler.functions';
import {
  ActiveGamePadButtons,
  GamePadShortCutName,
  IGamePadActions,
} from './gamepad-handler.types';

@Injectable({
  providedIn: 'root',
})
export class GamepadHandlerService {
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly store = inject(Store);
  private readonly globalMenuHandler = inject(GamepadGlobalMenuHandler);
  private readonly gamePadSubj$ = new Subject<Gamepad[]>();

  settingMode = false;
  gamePadChangingView = false;
  gamePadFrame$ = this.gamePadSubj$.asObservable();
  gamePadChange$ = this.gamePadFrame$.pipe(
    distinctUntilChanged(
      (previous, next) =>
        previous.map((g) => g.timestamp).join(' ') ===
        next.map((g) => g.timestamp).join(' '),
    ),
  );
  gamePadActive$ = this.gamePadChange$.pipe(
    map((gamepads) => {
      const gps = gamepads
        .map((gp) => ({
          index: gp.index,
          buttons: gp.buttons.reduce(
            (acc, val, index) =>
              val.pressed ? { ...acc, [index]: val.value } : acc,
            {} as { [key: number]: number },
          ),
          axes: gp.axes.reduce(
            (acc, val, index) =>
              Math.abs(val) > 0.09 ? { ...acc, [index]: val } : acc,
            {} as { [key: number]: number },
          ),
        }))
        .filter(
          (gp) =>
            Object.keys(gp.buttons).length > 0 ||
            Object.keys(gp.axes).length > 0,
        );
      return gps.length === 0 ? null : gps;
    }),
  );

  gamePadDoAnimationAction$ = this.gamePadActive$.pipe(
    switchMap((active) =>
      active
        ? scheduled([active], animationFrameScheduler).pipe(repeat())
        : of(active),
    ),
  );

  private map!: Map;

  init(map: Map) {
    this.map = map;
    window.addEventListener('gamepadconnected', () => {
      this.catchGamepadEvents();
    });
    this.initAnimationActions();
  }

  private initAnimationActions(): void {
    this.gamePadDoAnimationAction$
      .pipe(
        pairwise(),
        filter(([, active]) => !!active && !this.settingMode),
        concatLatestFrom(() =>
          this.store.select(gamepadFeature.selectShortCuts),
        ),
      )
      .subscribe({
        next: ([[old, active], definition]) => {
          if (this.globalMenuHandler.searchComponent?.isOpen()) {
            this.globalMenuHandler.reactOnGlobalSearchEvents(
              old,
              active,
              definition,
            );
          } else if (
            this.dialog.openDialogs.length === 0 &&
            !this.bottomSheet._openedBottomSheetRef
          ) {
            this.reactOnMapEvents(old, active, definition);
          } else {
            this.reactOnDialogEvents(old, active, definition);
          }
        },
      });
  }

  private catchGamepadEvents(): void {
    const gamepads = navigator.getGamepads().filter((gamepad) => !!gamepad);
    this.gamePadSubj$.next(gamepads);
    requestAnimationFrame(() => this.catchGamepadEvents());
  }

  private reactOnMapEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    if (this.processFollowAirplane(old, active, definition)) {
      return;
    }
    if (this.globalMenuHandler.processGlobalSearch(old, active, definition)) {
      return;
    }
    if (
      actionFirstTime(definition.openNavigation, active, old, () => {
        (
          document.querySelectorAll(
            '[navigation-dialog]',
          )?.[0] as HTMLButtonElement
        )?.click();
      })
    ) {
      return;
    }

    if (this.processMapClick(old, active, definition)) {
      return;
    }

    this.mapManipulation(active, definition);
  }

  private processFollowAirplane(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): boolean {
    if (
      actionFirstTime(definition.followAirplane, active, old, () => {
        const control = this.map._controls.find(
          (c) => c instanceof maplibregl.GeolocateControl,
        ) as maplibregl.GeolocateControl;
        if (control._watchState !== 'ACTIVE_LOCK') {
          // only when not following airplane
          control.trigger();
          this.gamePadChangingView = false;
        }
      })
    ) {
      return true;
    }
    return false;
  }

  private processMapClick(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): boolean {
    if (
      actionFirstTime(definition.mapClick, active, old, () => {
        this.map._canvas.dispatchEvent(
          new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: this.map._canvas.offsetWidth / 2,
            clientY: this.map._canvas.offsetHeight / 2,
          }),
        );
        setTimeout(() => {
          emulateTab.backwards();
        }, 1000);
      })
    ) {
      return true;
    }
    return false;
  }

  private mapManipulation(
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    this.gamePadChangingView = true;
    this.map.easeTo({
      duration: 0,
      easeId: 'gamepadHandler',
      easing: (t) => t * (2 - t),
      offset: this.mapManipulationOffset(active, definition),
      bearing: actionDefToNumber(definition.pitchBearingReset, active)
        ? 0
        : this.map.getBearing() +
          actionDefToNumber(definition.bearing, active) -
          actionDefToNumber(definition.bearingOpposite, active),
      pitch: actionDefToNumber(definition.pitchBearingReset, active)
        ? 0
        : this.map.getPitch() +
          actionDefToNumber(definition.pitch, active) -
          actionDefToNumber(definition.pitchOpposite, active),
      zoom:
        this.map.getZoom() +
        actionDefToNumber(definition.zoomIn, active) -
        actionDefToNumber(definition.zoomOut, active),
      center: this.map.getCenter(),
    });
  }

  private mapManipulationOffset(
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): PointLike {
    return [
      actionDefToNumber(definition.xMoveRight, active) -
        actionDefToNumber(definition.xMoveLeft, active),
      actionDefToNumber(definition.xMoveTop, active) -
        actionDefToNumber(definition.xMoveBottom, active),
    ];
  }

  private reactOnDialogEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    if (
      actionFirstTime(definition.closeDialog, active, old, () => {
        this.bottomSheet.dismiss();
        this.dialog.closeAll();
      })
    ) {
      return;
    }

    if (
      actionFirstTime(definition.dialogDo, active, old, () => {
        if ((document.activeElement as HTMLDivElement)?.click) {
          (document.activeElement as HTMLDivElement).click();
        }
      })
    ) {
      return;
    }

    this.reactOnDialogFieldFocusEvents(old, active, definition);
  }

  private reactOnDialogFieldFocusEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null,
    definition: { [key in GamePadShortCutName]: IGamePadActions },
  ): void {
    if (
      actionFirstTime(definition.nextField, active, old, () => {
        emulateTab();
      })
    ) {
      return;
    }

    if (
      actionFirstTime(definition.previousField, active, old, () => {
        emulateTab.backwards();
      })
    ) {
      return;
    }
    false;
  }
}
