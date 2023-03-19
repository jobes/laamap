import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { INotamDecoded } from '../../../services/notams/notams.interface';
import { NotamGeoJson } from '../../../services/notams/notams.service';
import { notamsSettings } from './notams.actions';

const initialState = { hiddenList: [] as string[] };

export const notamsFeature = createFeature({
  name: 'settings.notam',
  reducer: createReducer(
    initialState,
    on(notamsSettings.hide, (state, { notamId }): typeof initialState => ({
      ...state,
      hiddenList: [
        ...state.hiddenList.filter((nId) => nId !== notamId), // to avoid duplicity
        notamId,
      ],
    }))
  ),
});

export const selectNonHiddenNotams = (notams: NotamGeoJson) =>
  createSelector(notamsFeature.selectHiddenList, (hiddenNotamIds) => ({
    ...notams,
    features: notams.features.filter(
      (n) => !(hiddenNotamIds ?? []).includes(n.properties.decoded.id)
    ),
  }));

export const selectNonHiddenDecodedNotams = (notams: INotamDecoded[]) =>
  createSelector(notamsFeature.selectHiddenList, (hiddenNotamIds) =>
    notams.filter((n) => !(hiddenNotamIds ?? []).includes(n.id))
  );
