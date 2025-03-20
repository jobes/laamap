import { isDevMode } from '@angular/core';
import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { airSpacesFeature } from '../features/settings/air-spaces.feature';
import { gamepadFeature } from '../features/settings/gamepad.feature';
import { generalFeature } from '../features/settings/general.feature';
import { instrumentsFeature } from '../features/settings/instruments.feature';
import { navigationSettingsFeature } from '../features/settings/navigation.feature';
import { notamsFeature } from '../features/settings/notams.feature';
import { radarFeature } from '../features/settings/radar.feature';
import { terrainFeature } from '../features/settings/terrain.feature';
import { logRocketMiddleware } from './logrocket';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>,
): ActionReducer<any> {
  return localStorageSync({
    keys: [
      'core',
      notamsFeature.name,
      radarFeature.name,
      navigationSettingsFeature.name,
      airSpacesFeature.name,
      instrumentsFeature.name,
      generalFeature.name,
      gamepadFeature.name,
      terrainFeature.name,
    ],
    rehydrate: true,
  })(reducer);
}

export const metaReducers = [
  localStorageSyncReducer,
  ...(isDevMode() ? [] : [logRocketMiddleware]),
];
