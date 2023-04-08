import { createActionGroup, props } from '@ngrx/store';

export const generalSettings = createActionGroup({
  source: 'General settings',
  events: {
    'Screen wake lock Enable changed': props<{ enabled: boolean }>(),
    'Widget font size ratio changed': props<{ value: number }>(),
    'Map font size ratio changed': props<{ value: number }>(),
    'Set airplane name': props<{ airplaneName: string }>(),
  },
});
