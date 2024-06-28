import { createActionGroup, props } from '@ngrx/store';

export const account = createActionGroup({
  source: 'Account',
  events: {
    'Logged in': props<{ jwtToken: string; userChanged: boolean }>(),
  },
});
