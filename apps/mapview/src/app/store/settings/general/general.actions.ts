import { createActionGroup, props } from '@ngrx/store';

export const generalSettings = createActionGroup({
  source: 'General settings',
  events: {
    'Screen wake lock Enable Changed': props<{ enabled: boolean }>(),
  },
});
