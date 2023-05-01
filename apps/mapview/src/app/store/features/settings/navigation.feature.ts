import { createFeature, createReducer, on } from '@ngrx/store';

import { navigationSettingsActions } from '../../actions/settings.actions';
import { navigationWidgetActions } from '../../actions/widgets.actions';

export type AllowedNavigationWidgetRowType = (
  | 'NEXT_POINT_DISTANCE'
  | 'NEXT_POINT_DURATION_LEFT'
  | 'NEXT_POINT_ARRIVE_TIME'
  | 'GOAL_DISTANCE'
  | 'GOAL_DURATION_LEFT'
  | 'GOAL_ARRIVE_TIME'
)[];

const initialState = {
  minActivationSpeedKpH: 30,
  directionLineSegmentSeconds: 60,
  directionLineSegmentCount: 5,
  gpsTrackingInitZoom: 13,
  gpsTrackingInitPitch: 60,
  widget: {
    position: {
      x: 200,
      y: 200,
    },
    bgColor: '#ffffff',
    textColor: '#000000',
    allowedRow: [
      'NEXT_POINT_DISTANCE',
      'NEXT_POINT_DURATION_LEFT',
      'NEXT_POINT_ARRIVE_TIME',
      'GOAL_DISTANCE',
      'GOAL_DURATION_LEFT',
      'GOAL_ARRIVE_TIME',
    ] as AllowedNavigationWidgetRowType,
  },
};

export const navigationSettingsFeature = createFeature({
  name: 'settings.navigation',
  reducer: createReducer(
    initialState,
    on(
      navigationSettingsActions.directionLineSegmentSecondsChanged,
      (state, { seconds }): typeof initialState => ({
        ...state,
        directionLineSegmentSeconds: seconds,
      })
    ),
    on(
      navigationSettingsActions.directionLineSegmentCountChanged,
      (state, { count }): typeof initialState => ({
        ...state,
        directionLineSegmentCount: count,
      })
    ),
    on(
      navigationSettingsActions.minimumActivationSpeedChanged,
      (state, { minActivationSpeedKpH }): typeof initialState => ({
        ...state,
        minActivationSpeedKpH,
      })
    ),
    on(
      navigationSettingsActions.gpsTrackingInitialPitchChanged,
      (state, { pitch }): typeof initialState => ({
        ...state,
        gpsTrackingInitPitch: pitch,
      })
    ),
    on(
      navigationSettingsActions.gpsTrackingInitialZoomChanged,
      (state, { zoom }): typeof initialState => ({
        ...state,
        gpsTrackingInitZoom: zoom,
      })
    ),
    on(
      navigationWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        widget: { ...state.widget, position },
      })
    ),
    on(
      navigationSettingsActions.widgetAllowedRowsChanged,
      (state, { list }): typeof initialState => ({
        ...state,
        widget: { ...state.widget, allowedRow: list },
      })
    ),
    on(
      navigationSettingsActions.widgetBgColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widget: { ...state.widget, bgColor: color },
      })
    ),
    on(
      navigationSettingsActions.widgetTextColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widget: { ...state.widget, textColor: color },
      })
    )
  ),
});
