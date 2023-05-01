import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';

export const navigationDialogActions = createActionGroup({
  source: 'Navigation dialog',
  events: {
    'Route reordered': props<{ route: { point: LngLat; name: string }[] }>(),
    'Route item deleted': props<{ index: number }>(),
    'Route cleared': emptyProps(),
    'Navigation started': emptyProps(),
    'Navigation ended': emptyProps(),
  },
});
