import { createAction, createActionGroup, props } from '@ngrx/store';
import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';
import { IRainViewerUrls } from '../../services/rain-viewer.interface';
import { AppState } from './core.reducer';

export const RadarSettingsActions = createActionGroup({
  source: 'Radar Settings',
  events: {
    'Enabled Changed': props<{ enabled: boolean }>(),
    'Enabled widget changed': props<{ enabled: boolean }>(),
    'Type changed': props<{ viewType: AppState['core']['radar']['type'] }>(),
    'Color scheme changed': props<{ colorScheme: number }>(),
    'Enabled snow changed': props<{ enabled: boolean }>(),
    'Enabled smooth changed': props<{ enabled: boolean }>(),
    'Animation speed': props<{ animationSpeed: number }>(),
    'Opacity changed': props<{ opacity: number }>(),
    'Widget bg color changed': props<{ color: string }>(),
    'Widget text color past changed': props<{ color: string }>(),
    'Widget text color future changed': props<{ color: string }>(),
  },
});

export const rainViewersUrlsLoaded = createAction(
  '[core effect] Rain viewer URLs loaded',
  props<{ data: IRainViewerUrls }>()
);

export const rainViewersWidgetSettings = createActionGroup({
  source: 'Radar widget',
  events: { Moved: props<{ position: { x: number; y: number } }>() },
});

export const airspacesSettings = createActionGroup({
  source: 'Airspaces settings',
  events: {
    'Enabled Changed': props<{
      airspaceType: EAirSpaceType;
      enabled: boolean;
    }>(),
    'Color changed': props<{ airspaceType: EAirSpaceType; color: string }>(),
    'Opacity changed': props<{
      airspaceType: EAirSpaceType;
      opacity: number;
    }>(),
    'Min zoom changed': props<{
      airspaceType: EAirSpaceType;
      minZoom: number;
    }>(),
    'Max zoom changed': props<{
      airspaceType: EAirSpaceType;
      maxZoom: number;
    }>(),
  },
});
