import { createActionGroup, props } from '@ngrx/store';

export type RadarTypes = 'radar' | 'satellite' | 'coverage';

export const radarSettingsActions = createActionGroup({
  source: 'Radar Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
    'Enabled widget changed': props<{ enabled: boolean }>(),
    'Type changed': props<{ viewType: RadarTypes }>(),
    'Color scheme changed': props<{ colorScheme: number }>(),
    'Enabled snow changed': props<{ enabled: boolean }>(),
    'Enabled smooth changed': props<{ enabled: boolean }>(),
    'Animation speed changed': props<{ animationSpeed: number }>(),
    'Opacity changed': props<{ opacity: number }>(),
    'Widget bg color changed': props<{ color: string }>(),
    'Widget text color past changed': props<{ color: string }>(),
    'Widget text color future changed': props<{ color: string }>(),
    'Widget Position Moved': props<{ position: { x: number; y: number } }>(),
  },
});
