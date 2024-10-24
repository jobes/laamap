import { createFeature, createReducer, on } from '@ngrx/store';

import { navigationSettingsActions } from '../../actions/settings.actions';
import {
  navigationGoalWidgetActions,
  navigationNextPointWidgetActions,
} from '../../actions/widgets.actions';

export type AllowedNavigationGoalWidgetRowType = (
  | 'GOAL_DISTANCE'
  | 'GOAL_DURATION_LEFT'
  | 'GOAL_ARRIVE_TIME'
)[];

export type AllowedNavigationNextPointWidgetRowType = (
  | 'NEXT_POINT_DISTANCE'
  | 'NEXT_POINT_DURATION_LEFT'
  | 'NEXT_POINT_ARRIVE_TIME'
)[];

const initialState = {
  minActivationSpeedKpH: 30,
  directionLineSegmentSeconds: 60,
  directionLineSegmentCount: 5,
  gpsTrackingInitZoom: 13,
  gpsTrackingInitPitch: 60,
  averageSpeed: 100,
  widgetGoal: {
    position: {
      x: 200,
      y: 200,
    },
    bgColor: '#ffffff',
    textColor: '#000000',
    allowedRow: [
      'GOAL_DISTANCE',
      'GOAL_DURATION_LEFT',
      'GOAL_ARRIVE_TIME',
    ] as AllowedNavigationGoalWidgetRowType,
  },
  widgetNextPoint: {
    position: {
      x: 300,
      y: 300,
    },
    bgColor: '#ffffff',
    textColor: '#000000',
    allowedRow: [
      'NEXT_POINT_DISTANCE',
      'NEXT_POINT_DURATION_LEFT',
      'NEXT_POINT_ARRIVE_TIME',
    ] as AllowedNavigationNextPointWidgetRowType,
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
      }),
    ),
    on(
      navigationSettingsActions.directionLineSegmentCountChanged,
      (state, { count }): typeof initialState => ({
        ...state,
        directionLineSegmentCount: count,
      }),
    ),
    on(
      navigationSettingsActions.minimumActivationSpeedChanged,
      (state, { minActivationSpeedKpH }): typeof initialState => ({
        ...state,
        minActivationSpeedKpH,
      }),
    ),
    on(
      navigationSettingsActions.averageSpeedChanged,
      (state, { speed }): typeof initialState => ({
        ...state,
        averageSpeed: speed,
      }),
    ),
    on(
      navigationSettingsActions.gpsTrackingInitialPitchChanged,
      (state, { pitch }): typeof initialState => ({
        ...state,
        gpsTrackingInitPitch: pitch,
      }),
    ),
    on(
      navigationSettingsActions.gpsTrackingInitialZoomChanged,
      (state, { zoom }): typeof initialState => ({
        ...state,
        gpsTrackingInitZoom: zoom,
      }),
    ),
    on(
      navigationGoalWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        widgetGoal: { ...state.widgetGoal, position },
      }),
    ),
    on(
      navigationNextPointWidgetActions.positionMoved,
      (state, { position }): typeof initialState => ({
        ...state,
        widgetNextPoint: { ...state.widgetNextPoint, position },
      }),
    ),
    on(
      navigationSettingsActions.widgetGoalAllowedRowsChanged,
      (state, { list }): typeof initialState => ({
        ...state,
        widgetGoal: { ...state.widgetGoal, allowedRow: list },
      }),
    ),
    on(
      navigationSettingsActions.widgetGoalBgColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widgetGoal: { ...state.widgetGoal, bgColor: color },
      }),
    ),
    on(
      navigationSettingsActions.widgetGoalTextColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widgetGoal: { ...state.widgetGoal, textColor: color },
      }),
    ),
    on(
      navigationSettingsActions.widgetNextPointAllowedRowsChanged,
      (state, { list }): typeof initialState => ({
        ...state,
        widgetNextPoint: { ...state.widgetNextPoint, allowedRow: list },
      }),
    ),
    on(
      navigationSettingsActions.widgetNextPointBgColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widgetNextPoint: { ...state.widgetNextPoint, bgColor: color },
      }),
    ),
    on(
      navigationSettingsActions.widgetNextPointTextColorChanged,
      (state, { color }): typeof initialState => ({
        ...state,
        widgetNextPoint: { ...state.widgetNextPoint, textColor: color },
      }),
    ),
  ),
});
