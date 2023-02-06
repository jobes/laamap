import { createSelector } from '@ngrx/store';

import { INotamDecoded } from '../../services/notams/notams.interface';
import { NotamGeoJson } from '../../services/notams/notams.service';
import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';
import { IAirSpaceSettings } from './airspaces-defauls';
import { AppState } from './core.reducer';

const selectCore = (state: object) => (state as AppState).core;

export const selectRadar = createSelector(selectCore, (state) => state?.radar);

export const selectAirspacesSettings = createSelector(
  selectCore,
  (state) => state?.airSpaces
);

export const selectAirspacesSettingsArray = createSelector(
  selectAirspacesSettings,
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

export const selectHiddenNotamsIds = createSelector(
  selectCore,
  (state) => state?.notams?.hiddenList ?? []
);

export const selectNonHiddenNotams = (notams: NotamGeoJson) =>
  createSelector(selectHiddenNotamsIds, (hiddenNotamIds) => ({
    ...notams,
    features: notams.features.filter(
      (n) => !hiddenNotamIds.includes(n.properties.decoded.id)
    ),
  }));

export const selectNonHiddenDecodedNotams = (notams: INotamDecoded[]) =>
  createSelector(selectHiddenNotamsIds, (hiddenNotamIds) =>
    notams.filter((n) => !hiddenNotamIds.includes(n.id))
  );

export const selectScreenWakeLockEnabled = createSelector(
  selectCore,
  (state) => state?.screenWakeLock.enabled
);
