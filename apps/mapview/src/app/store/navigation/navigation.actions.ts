import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

export const navigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'Started new route navigation': props<{ point: LngLat; name: string }>(),
    'Added point to navigation': props<{ point: LngLat; name: string }>(),
    'Navigation failed': props<{ reason: 'NO_GPS' | 'NO_ROUTE' }>(),
    'Reorder route': props<{ route: { point: LngLat; name: string }[] }>(),
    'Route item deleted': props<{ index: number }>(),
    'Route clear': emptyProps(),
    'Start navigation': emptyProps(),
    'End navigation': emptyProps(),
    'Next point reached': emptyProps(),
  },
});
