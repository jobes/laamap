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
  extraSelectors: ({ selectHiddenList }) => ({
    selectNonHiddenNotams: (notams: NotamGeoJson) =>
      createSelector(selectHiddenList, (hiddenNotamIds) => ({
        ...notams,
        features: notams.features.filter(
          (n) => !(hiddenNotamIds ?? []).includes(n.properties.decoded.id)
        ),
      })),
    selectNonHiddenDecodedNotams: (notams: INotamDecoded[]) =>
      createSelector(selectHiddenList, (hiddenNotamIds) =>
        notams.filter((n) => !(hiddenNotamIds ?? []).includes(n.id))
      ),
  }),
});
