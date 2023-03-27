import { createActionGroup, props } from '@ngrx/store';

export const navigationSettings = createActionGroup({
  source: 'Navigation settings',
  events: {
    'Minimum activation speed Changed': props<{
      minActivationSpeedKpH: number;
    }>(),
    'Direction line segment seconds': props<{ seconds: number }>(),
    'Direction line segment count': props<{ count: number }>(),
    'GPS tracking initial zoom': props<{ zoom: number }>(),
    'GPS tracking initial pitch': props<{ pitch: number }>(),
  },
});
