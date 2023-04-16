import { createActionGroup, props } from '@ngrx/store';

import { AllowedNavigationWidgetRowType } from './navigation.feature';

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
    'Widget position moved': props<{ position: { x: number; y: number } }>(),
    'Widget Bg Color Changed': props<{ color: string }>(),
    'Widget Text Color Changed': props<{ color: string }>(),
    'Widget allowed rows': props<{ list: AllowedNavigationWidgetRowType }>(),
  },
});
