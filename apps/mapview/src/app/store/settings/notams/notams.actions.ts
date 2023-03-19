import { createActionGroup, props } from '@ngrx/store';

export const notamsSettings = createActionGroup({
  source: 'Notams settings',
  events: {
    hide: props<{
      notamId: string;
    }>(),
  },
});
