import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';
import { IAirSpaceSettings, airspacesInitValue } from './air-spaces-init-value';
import { airspacesSettings } from './air-spaces.actions';

export const airSpacesFeature = createFeature({
  name: 'settings.airSpaces',
  reducer: createReducer(
    airspacesInitValue,
    on(
      airspacesSettings.enabledChanged,
      (state, { airspaceType, enabled }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], enabled },
      })
    ),
    on(
      airspacesSettings.colorChanged,
      (state, { airspaceType, color }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], color },
      })
    ),
    on(
      airspacesSettings.opacityChanged,
      (state, { airspaceType, opacity }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], opacity },
      })
    ),
    on(
      airspacesSettings.minZoomChanged,
      (state, { airspaceType, minZoom }): typeof airspacesInitValue => ({
        ...state,
        [airspaceType]: { ...state[airspaceType], minZoom },
      })
    )
  ),
});

export const selectAirspacesSettingsArray = createSelector(
  airSpacesFeature['selectSettings.airSpacesState'],
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
);
