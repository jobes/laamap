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

export type GamePadShortCutName =
  | 'xMoveRight'
  | 'xMoveLeft'
  | 'xMoveTop'
  | 'xMoveBottom'
  | 'bearing'
  | 'bearingOpposite'
  | 'pitch'
  | 'pitchOpposite'
  | 'pitchBearingReset'
  | 'mapClick'
  | 'zoomIn'
  | 'zoomOut'
  | 'followAirplane'
  | 'openNavigation'
  | 'openGlobalSearch'
  | 'closeDialog'
  | 'dialogDo'
  | 'nextField'
  | 'disabled'
  | 'previousField'
  | 'radioDialog';
