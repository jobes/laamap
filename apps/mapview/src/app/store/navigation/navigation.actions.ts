import { createActionGroup, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

export const navigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'Started new route navigation': props<{ point: LngLat; name: string }>(),
    'Added point to navigation': props<{ point: LngLat; name: string }>(),
    'Navigation failed': props<{ reason: 'NO_GPS' | 'NO_ROUTE' }>(),
  },
});
