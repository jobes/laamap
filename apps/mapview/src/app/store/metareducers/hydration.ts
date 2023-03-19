/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { airSpacesFeature } from '../settings/air-spaces/air-spaces.feature';
import { generalFeature } from '../settings/general/general.feature';
import { instrumentsFeature } from '../settings/instruments/instruments.feature';
import { navigationFeature } from '../settings/navigation/navigation.feature';
import { notamsFeature } from '../settings/notams/notams.feature';
import { radarFeature } from '../settings/radar/radar.feature';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: [
      'core',
      notamsFeature.name,
      radarFeature.name,
      navigationFeature.name,
      airSpacesFeature.name,
      instrumentsFeature.name,
      generalFeature.name,
    ],
    rehydrate: true,
  })(reducer);
}

export const metaReducers = [localStorageSyncReducer];
