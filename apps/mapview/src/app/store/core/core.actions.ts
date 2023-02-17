import { createActionGroup, props } from '@ngrx/store';

import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';
import { AppState } from './core.reducer';

export const radarSettingsActions = createActionGroup({
  source: 'Radar Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
    'Enabled widget changed': props<{ enabled: boolean }>(),
    'Type changed': props<{ viewType: AppState['core']['radar']['type'] }>(),
    'Color scheme changed': props<{ colorScheme: number }>(),
    'Enabled snow changed': props<{ enabled: boolean }>(),
    'Enabled smooth changed': props<{ enabled: boolean }>(),
    'Animation speed changed': props<{ animationSpeed: number }>(),
    'Opacity changed': props<{ opacity: number }>(),
    'Widget bg color changed': props<{ color: string }>(),
    'Widget text color past changed': props<{ color: string }>(),
    'Widget text color future changed': props<{ color: string }>(),
  },
});

export const rainViewersWidgetSettings = createActionGroup({
  source: 'Radar widget',
  events: { 'Position Moved': props<{ position: { x: number; y: number } }>() },
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
  },
});

export const notamsSettings = createActionGroup({
  source: 'Notams settings',
  events: {
    hide: props<{
      notamId: string;
    }>(),
  },
});

export const generalSettings = createActionGroup({
  source: 'General settings',
  events: {
    'Screen wake lock Enable Changed': props<{ enabled: boolean }>(),
  },
});

export const navigationSettings = createActionGroup({
  source: 'Navigation settings',
  events: {
    'Minimum activation speed Changed': props<{
      minActivationSpeedKpH: number;
    }>(),
    'Direction line segment seconds': props<{ seconds: number }>(),
    'Direction line segment count': props<{ count: number }>(),
  },
});
