import { createFeature, createReducer, on } from '@ngrx/store';
import { terrainSettingsActions } from '../../actions/settings.actions';

const initialState = {
  enabled: false,
  gndHeightCalculateUsingTerrain: true,
  exaggeration: 1,
};

export const terrainFeature = createFeature({
  name: 'settings.terrain',
  reducer: createReducer(
    initialState,
    on(
      terrainSettingsActions.enabledChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        enabled,
      }),
    ),
    on(
      terrainSettingsActions.exaggerationChanged,
      (state, { exaggeration }): typeof initialState => ({
        ...state,
        exaggeration,
      }),
    ),
    on(
      terrainSettingsActions.gndHeightCalculateUsingTerrainChanged,
      (state, { enabled }): typeof initialState => ({
        ...state,
        gndHeightCalculateUsingTerrain: enabled,
      }),
    ),
  ),
});
