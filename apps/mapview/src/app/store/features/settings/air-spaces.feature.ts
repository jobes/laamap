import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';
import { airspacesSettingsActions } from '../../actions/settings.actions';
import { IAirSpaceSettings, airspacesInitValue } from './air-spaces-init-value';

export const airSpacesFeature = createFeature({
  name: 'settings.airSpaces',
  reducer: createReducer(
    airspacesInitValue,
    on(
      airspacesSettingsActions.enabledChanged,
      (state, { airspaceType, enabled }): typeof airspacesInitValue => ({
        ...state,
        airspacesDef: {
          ...state.airspacesDef,
          [airspaceType]: { ...state.airspacesDef[airspaceType], enabled },
        },
      }),
    ),
    on(
      airspacesSettingsActions.colorChanged,
      (
        state,
        { airspaceType, color, airspacesActivity },
      ): typeof airspacesInitValue => ({
        ...state,
        airspacesDef: {
          ...state.airspacesDef,
          [airspaceType]: {
            ...state.airspacesDef[airspaceType],
            [airspacesActivity]: {
              ...state.airspacesDef[airspaceType][airspacesActivity],
              color,
            },
          },
        },
      }),
    ),
    on(
      airspacesSettingsActions.opacityChanged,
      (
        state,
        { airspaceType, opacity, airspacesActivity },
      ): typeof airspacesInitValue => ({
        ...state,
        airspacesDef: {
          ...state.airspacesDef,
          [airspaceType]: {
            ...state.airspacesDef[airspaceType],
            [airspacesActivity]: {
              ...state.airspacesDef[airspaceType][airspacesActivity],
              opacity,
            },
          },
        },
      }),
    ),
    on(
      airspacesSettingsActions.minZoomChanged,
      (state, { airspaceType, minZoom }): typeof airspacesInitValue => ({
        ...state,
        airspacesDef: {
          ...state.airspacesDef,
          [airspaceType]: {
            ...state.airspacesDef[airspaceType],
            minZoom,
          },
        },
      }),
    ),
    on(
      airspacesSettingsActions.activationAirspaceListChanged,
      (state, { activationAirspaceList }): typeof airspacesInitValue => ({
        ...state,
        activationAirspaceList,
      }),
    ),
  ),
  extraSelectors: (selectors) => ({
    selectAirspacesSettingsArray: createSelector(
      selectors['selectSettings.airSpacesState'],
      (state) => {
        const x = Object.entries(state.airspacesDef).reduce(
          (acc, item) => [
            ...acc,
            { ...item[1], id: Number(item[0]) as EAirSpaceType },
          ],
          [] as (IAirSpaceSettings & { id: EAirSpaceType })[],
        );
        return x;
      },
    ),
  }),
});
