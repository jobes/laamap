import { Injectable, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { emulateTab } from 'emulate-tab';
import maplibregl, { Map } from 'maplibre-gl';
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

export type ActiveGamePadButtons = {
  index: number;
  buttons: { [key: number]: number };
  axes: { [key: number]: number };
}[];
export interface IGamePadActions {
  index: number;
  axes?: number;
  button?: number;
  coefficient?: number;
  axesThreshold?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GamepadHandlerService {
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly gamePadSubj$ = new Subject<Gamepad[]>();
  settingMode = false;
  gamePadChangingView = false;
  gamePadFrame$ = this.gamePadSubj$.asObservable();
  gamePadChange$ = this.gamePadFrame$.pipe(
    distinctUntilChanged(
      (previous, next) =>
        previous.map((g) => g.timestamp).join(' ') ===
        next.map((g) => g.timestamp).join(' ')
    )
  );
  gamePadActive$ = this.gamePadChange$.pipe(
    map((gamepads) => {
      const gps = gamepads
        .map((gp) => ({
          index: gp.index,
          buttons: gp.buttons.reduce(
            (acc, val, index) =>
              val.pressed ? { ...acc, [index]: val.value } : acc,
            {} as { [key: number]: number }
          ),
          axes: gp.axes.reduce(
            (acc, val, index) =>
              Math.abs(val) > 0.09 ? { ...acc, [index]: val } : acc,
            {} as { [key: number]: number }
          ),
        }))
        .filter(
          (gp) =>
            Object.keys(gp.buttons).length > 0 ||
            Object.keys(gp.axes).length > 0
        );
      return gps.length === 0 ? null : gps;
    })
  );
  gamePadDoAnimationAction$ = this.gamePadActive$.pipe(
    switchMap((active) =>
      active
        ? scheduled([active], animationFrameScheduler).pipe(repeat())
        : of(active)
    )
  );

  private map!: Map;

  init(map: Map) {
    this.map = map;
    window.addEventListener('gamepadconnected', () => {
      this.catchGamepadEvents();
    });

    this.gamePadDoAnimationAction$
      .pipe(
        pairwise(),
        filter(([, active]) => !!active && !this.settingMode)
      )
      .subscribe(([old, active]) => {
        if (
          this.dialog.openDialogs.length === 0 &&
          !this.bottomSheet._openedBottomSheetRef
        ) {
          this.reactOnMapEvents(old, active);
        } else {
          this.reactOnBottomSheetEvents(old, active);
        }
      });
  }

  private catchGamepadEvents(): void {
    const gamepads = navigator
      .getGamepads()
      .filter((gamepad) => !!gamepad) as Gamepad[];
    this.gamePadSubj$.next(gamepads);
    requestAnimationFrame(() => this.catchGamepadEvents());
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  private reactOnMapEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null
  ): void {
    const xMoveRightDef = {
      index: 0,
      axes: 0,
      button: 15,
      coefficient: -10,
      axesThreshold: 0.3,
    };
    const xMoveLeftDef = {
      index: 0,
      button: 14,
      coefficient: -10,
    };
    const xMoveTopDef = {
      index: 0,
      axes: 1,
      button: 13,
      coefficient: -10,
      axesThreshold: 0.3,
    };
    const xMoveBottomDef = {
      index: 0,
      button: 12,
      coefficient: -10,
    };
    const bearingDef = {
      index: 0,
      axes: 2,
      coefficient: 1,
      axesThreshold: 0.3,
    };
    const bearingOppositeDef = {
      index: 0,
    };
    const pitchDef = {
      index: 0,
      axes: 3,
      coefficient: -1,
      axesThreshold: 0.3,
    };
    const pitchOppositeDef = {
      index: 0,
      axes: 3,
      coefficient: 1,
      axesThreshold: 0.3,
    };
    const pitchBearingResetDef = {
      index: 0,
      button: 11,
    };
    const zoomInDef = {
      index: 0,
      button: 7,
      coefficient: 0.05,
    };
    const zoomOutDef = {
      index: 0,
      button: 6,
      coefficient: 0.05,
    };

    const followAirplane = {
      index: 0,
      button: 10,
    };

    const openNavigation = {
      index: 0,
      button: 9,
    };

    const mapClick = {
      index: 0,
      button: 0,
    };

    if (
      this.actionFirstTime(followAirplane, active, old, () => {
        const control = this.map._controls.find(
          (c) => c instanceof maplibregl.GeolocateControl
        ) as maplibregl.GeolocateControl;
        if (control._watchState !== 'ACTIVE_LOCK') {
          // only when not following airplane
          control.trigger();
          this.gamePadChangingView = false;
        }
      })
    ) {
      return;
    }

    if (
      this.actionFirstTime(openNavigation, active, old, () => {
        (
          document.querySelectorAll(
            '[navigation-dialog]'
          )?.[0] as HTMLButtonElement
        )?.click();
      })
    ) {
      return;
    }

    if (
      this.actionFirstTime(mapClick, active, old, () => {
        this.map._canvas.dispatchEvent(
          new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: this.map._canvas.offsetWidth / 2,
            clientY: this.map._canvas.offsetHeight / 2,
          })
        );
        setTimeout(() => {
          emulateTab.backwards();
        }, 1000);
      })
    ) {
      return;
    }

    this.gamePadChangingView = true;
    this.map.easeTo({
      duration: 0,
      easeId: 'gamepadHandler',
      easing: (t) => t * (2 - t),
      offset: [
        this.actionDefToNumber(xMoveRightDef, active) -
          this.actionDefToNumber(xMoveLeftDef, active),
        this.actionDefToNumber(xMoveTopDef, active) -
          this.actionDefToNumber(xMoveBottomDef, active),
      ],
      bearing: this.actionDefToNumber(pitchBearingResetDef, active)
        ? 0
        : this.map.getBearing() +
          this.actionDefToNumber(bearingDef, active) -
          this.actionDefToNumber(bearingOppositeDef, active),
      pitch: this.actionDefToNumber(pitchBearingResetDef, active)
        ? 0
        : this.map.getPitch() +
          this.actionDefToNumber(pitchDef, active) -
          this.actionDefToNumber(pitchOppositeDef, active),
      zoom:
        this.map.getZoom() +
        this.actionDefToNumber(zoomInDef, active) -
        this.actionDefToNumber(zoomOutDef, active),
      center: this.map.getCenter(),
    });
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  private reactOnBottomSheetEvents(
    old: ActiveGamePadButtons | null,
    active: ActiveGamePadButtons | null
  ): void {
    const close = {
      index: 0,
      button: 3,
    };

    const enter = {
      index: 0,
      button: 0,
    };

    const next = {
      index: 0,
      button: 13,
    };

    const previous = {
      index: 0,
      button: 12,
    };

    if (
      this.actionFirstTime(close, active, old, () => {
        this.bottomSheet.dismiss();
        this.dialog.closeAll();
      })
    ) {
      return;
    }

    if (
      this.actionFirstTime(enter, active, old, () => {
        if ((document.activeElement as HTMLDivElement)?.click) {
          (document.activeElement as HTMLDivElement).click();
        }
      })
    ) {
      return;
    }

    if (
      this.actionFirstTime(next, active, old, () => {
        emulateTab();
      })
    ) {
      return;
    }

    if (
      this.actionFirstTime(previous, active, old, () => {
        emulateTab.backwards();
      })
    ) {
      return;
    }
  }

  private actionDefToNumber(
    def: {
      index: number;
      axes?: number;
      button?: number;
      coefficient?: number;
      axesThreshold?: number;
    },
    active: ActiveGamePadButtons | null
  ): number {
    if (!active) {
      return 0;
    }
    const axesVal =
      def.axes !== undefined &&
      Math.abs(active[def.index].axes[def.axes]) > (def.axesThreshold ?? 0.01)
        ? active[def.index].axes[def.axes] ?? 0
        : 0;
    const buttonVal =
      def.button !== undefined ? active[def.index].buttons[def.button] ?? 0 : 0;
    return (def.coefficient ?? 1) * (buttonVal + axesVal);
  }

  private actionActive(
    def: {
      index: number;
      axes?: number;
      button?: number;
      coefficient?: number;
      axesThreshold?: number;
    },
    active: ActiveGamePadButtons | null
  ): boolean {
    if (!active) {
      return false;
    }
    return def.button !== undefined && !!active[def.index].buttons[def.button];
  }

  private actionFirstTime(
    def: {
      index: number;
      axes?: number;
      button?: number;
      coefficient?: number;
      axesThreshold?: number;
    },
    active: ActiveGamePadButtons | null,
    old: ActiveGamePadButtons | null,
    fn: () => void
  ): boolean {
    if (this.actionActive(def, active)) {
      // while button active, return true to do not do other actions
      if (!this.actionActive(def, old)) {
        // only once do action
        fn();
      }
      return true;
    }
    return false;
  }
}
