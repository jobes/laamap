import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppState } from '../core/core.reducer';

export function localStorageSyncReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return localStorageSync({ keys: ['core'], rehydrate: true })(reducer);
}

export const metaReducers = [localStorageSyncReducer];
