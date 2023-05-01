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
        [airspaceType]: { ...state[airspaceType], enabled },
      })
    ),
    on(
      airspacesSettingsActions.colorChanged,
      (state, { airspaceType, color }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], color },
      })
    ),
    on(
      airspacesSettingsActions.opacityChanged,
      (state, { airspaceType, opacity }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], opacity },
      })
    ),
    on(
      airspacesSettingsActions.minZoomChanged,
      (state, { airspaceType, minZoom }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], minZoom },
      })
    )
  ),
  extraSelectors: (selectors) => ({
    selectAirspacesSettingsArray: createSelector(
      selectors['selectSettings.airSpacesState'],
      (state) => {
        const x = Object.entries(state).reduce(
          (acc, item) => [
            ...acc,
            { ...item[1], id: Number(item[0]) as EAirSpaceType },
          ],
          [] as (IAirSpaceSettings & { id: EAirSpaceType })[]
        );
        return x;
      }
    ),
  }),
});
