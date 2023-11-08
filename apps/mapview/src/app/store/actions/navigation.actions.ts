import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LngLat } from 'maplibre-gl';
import { ICustomFlyRoute } from '../../services/custom-fly-routes/custom-fly-routes.service';

export const navigationDialogActions = createActionGroup({
  source: 'Navigation dialog',
  events: {
    'Route reordered': props<{ route: { point: LngLat; name: string }[] }>(),
    'Route item deleted': props<{ index: number }>(),
    'Route cleared': emptyProps(),
    'Route saved': props<{ name: string }>(),
    'Navigation started': emptyProps(),
    'Navigation ended': emptyProps(),
  },
});

export const poiListDialogActions = createActionGroup({
  source: 'POI list dialog',
  events: {
    'Added point to navigation': props<{ point: LngLat; name: string }>(),
  },
});

export const customFlyRouteListDialogActions = createActionGroup({
  source: 'custom fly route list dialog',
  events: {
    'Route used': props<{ route: ICustomFlyRoute }>(),
  },
});
