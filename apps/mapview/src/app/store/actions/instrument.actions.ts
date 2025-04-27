import { createActionGroup, props } from '@ngrx/store';

export const radioActions = createActionGroup({
  source: 'Radio',
  events: {
    'Set frequency': props<{
      frequency: number;
      name: string;
    }>(),
  },
});
