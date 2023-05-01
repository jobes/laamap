import { createActionGroup, props } from '@ngrx/store';

export const notamsViewActions = createActionGroup({
  source: 'Notams view',
  events: {
    hide: props<{
      notamId: string;
    }>(),
  },
});
