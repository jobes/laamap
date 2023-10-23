import { ActiveGamePadButtons, IGamePadActions } from './gamepad-handler.types';

export function actionDefToNumber(
  def: IGamePadActions,
  active: ActiveGamePadButtons | null,
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

export function actionActive(
  def: IGamePadActions,
  active: ActiveGamePadButtons | null,
): boolean {
  if (!active) {
    return false;
  }
  return def.button !== undefined && !!active[def.index].buttons[def.button];
}

export function actionFirstTime(
  def: IGamePadActions,
  active: ActiveGamePadButtons | null,
  old: ActiveGamePadButtons | null,
  fn: () => void,
): boolean {
  if (actionActive(def, active)) {
    // while button active, return true to do not do other actions
    if (!actionActive(def, old)) {
      // only once do action
      fn();
    }
    return true;
  }
  return false;
}
