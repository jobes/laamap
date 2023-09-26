import { createFeature, createReducer, on } from '@ngrx/store';

import { IGamePadActions } from '../../../services/gamepad-handler/gamepad-handler.service';
import { gamePadSettingsActions } from '../../actions/settings.actions';

const initialState: {
  shortCuts: {
    [key: string]: IGamePadActions;
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
  },
};

export const gamepadFeature = createFeature({
  name: 'settings.gamepad',
  reducer: createReducer(
    initialState,
    on(
      gamePadSettingsActions.setShortCuts,
      (state, { value }): typeof initialState => ({
        ...state,
        shortCuts: value,
      })
    )
  ),
});
