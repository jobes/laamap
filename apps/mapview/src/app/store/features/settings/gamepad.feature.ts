import { createFeature, createReducer, on } from '@ngrx/store';

import {
  GamePadShortCutName,
  IGamePadActions,
} from '../../../services/gamepad-handler/gamepad-handler.types';
import { gamePadSettingsActions } from '../../actions/settings.actions';
import { gamepadWidgetActions } from '../../actions/widgets.actions';

export const gamepadInitialState: {
  shortCuts: {
    [key in GamePadShortCutName]: IGamePadActions;
  };
  widget: {
    position: { x: number; y: number };
  };
} = {
  shortCuts: {
    xMoveRight: {
      index: 0,
      axes: 0,
      button: 15,
      coefficient: -10,
      axesThreshold: 0.3,
    },
    xMoveLeft: {
      index: 0,
      button: 14,
      coefficient: -10,
    },
    xMoveTop: {
      index: 0,
      axes: 1,
      button: 13,
      coefficient: -10,
      axesThreshold: 0.3,
    },
    xMoveBottom: {
      index: 0,
      button: 12,
      coefficient: -10,
    },
    bearing: {
      index: 0,
      axes: 2,
      coefficient: 1,
      axesThreshold: 0.3,
    },
    bearingOpposite: {
      index: 0,
    },
    pitch: {
      index: 0,
      axes: 3,
      coefficient: -1,
      axesThreshold: 0.3,
    },
    pitchOpposite: {
      index: 0,
      axes: 3,
      coefficient: 1,
      axesThreshold: 0.3,
    },
    pitchBearingReset: {
      index: 0,
      button: 11,
    },
    zoomIn: {
      index: 0,
      button: 7,
      coefficient: 0.05,
    },
    zoomOut: {
      index: 0,
      button: 6,
      coefficient: 0.05,
    },

    followAirplane: {
      index: 0,
      button: 10,
    },

    openNavigation: {
      index: 0,
      button: 9,
    },

    openGlobalSearch: {
      index: 0,
      button: 16,
    },

    mapClick: {
      index: 0,
      button: 0,
    },
    closeDialog: {
      index: 0,
      button: 3,
    },

    dialogDo: {
      index: 0,
      button: 0,
    },

    nextField: {
      index: 0,
      button: 13,
    },

    previousField: {
      index: 0,
      button: 12,
    },
    disabled: {
      index: 0,
      button: 3,
    },
    radioDialog: {
      index: 0,
      button: 8,
    },
  },
  widget: {
    position: {
      x: 400,
      y: 200,
    },
  },
};

export const gamepadFeature = createFeature({
  name: 'settings.gamepad',
  reducer: createReducer(
    gamepadInitialState,
    on(
      gamePadSettingsActions.setShortCuts,
      (state, { value }): typeof gamepadInitialState => ({
        ...state,
        shortCuts: value,
      }),
    ),
    on(
      gamepadWidgetActions.positionMoved,
      (state, { position }): typeof gamepadInitialState => ({
        ...state,
        widget: { ...state.widget, position },
      }),
    ),
  ),
});
