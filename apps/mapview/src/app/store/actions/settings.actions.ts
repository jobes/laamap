import { createActionGroup, props } from '@ngrx/store';

import {
  GamePadShortCutName,
  IGamePadActions,
} from '../../services/gamepad-handler/gamepad-handler.types';
import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';
import {
  AllowedNavigationGoalWidgetRowType,
  AllowedNavigationNextPointWidgetRowType,
} from '../features/settings/navigation.feature';

export const airspacesSettingsActions = createActionGroup({
  source: 'Airspaces settings',
  events: {
    'Enabled Changed': props<{
      airspaceType: EAirSpaceType;
      enabled: boolean;
    }>(),
    'Color changed': props<{ airspaceType: EAirSpaceType; color: string }>(),
    'Opacity changed': props<{
      airspaceType: EAirSpaceType;
      opacity: number;
    }>(),
    'Min zoom changed': props<{
      airspaceType: EAirSpaceType;
      minZoom: number;
    }>(),
  },
});

export const generalSettingsActions = createActionGroup({
  source: 'General settings',
  events: {
    'Screen wake lock Enable changed': props<{ enabled: boolean }>(),
    'Widget font size ratio changed': props<{ value: number }>(),
    'Map font size ratio changed': props<{ value: number }>(),
    'Airplane name changed': props<{ airplaneName: string }>(),
  },
});

export const instrumentSettingsActions = createActionGroup({
  source: 'Instrument settings',
  events: {
    'Visible on gps tracking changed': props<{
      showOnlyOnActiveGps: boolean;
    }>(),
  },
});

export const instrumentAltimeterSettingsActions = createActionGroup({
  source: 'Instrument altimeter settings',
  events: {
    'Manual GND Altitude Changed': props<{
      gndAltitude: number;
    }>(),
    'Bg Color Changed': props<{
      bgColor: string;
    }>(),
    'Text Color Changed': props<{
      textColor: string;
    }>(),
    'Show Type Changed': props<{
      show: ('altitudeM' | 'gndM' | 'altitudeFt' | 'gndFt')[];
    }>(),
  },
});

export const instrumentSpeedSettingsActions = createActionGroup({
  source: 'Instrument speed settings',
  events: {
    'Widget Colors Changed': props<{
      colorsBySpeed: { minSpeed: number; bgColor: string; textColor: string }[];
    }>(),
  },
});

export const trackingSettingsActions = createActionGroup({
  source: 'Tracking settings',
  events: {
    'active text Color Changed': props<{
      activeText: string;
    }>(),

    'inactive text Color Changed': props<{
      inactiveText: string;
    }>(),

    'active bg Color Changed': props<{
      activeBg: string;
    }>(),

    'inactive bg Color Changed': props<{
      inactiveBg: string;
    }>(),
  },
});

export const varioSettingsActions = createActionGroup({
  source: 'Vario settings',
  events: {
    'Diff Time Changed': props<{
      diffTime: number;
    }>(),
    'Widget Colors Changed': props<{
      colorsByClimbingSpeed: {
        minClimbing: number;
        bgColor: string;
        textColor: string;
      }[];
    }>(),
  },
});

export const navigationSettingsActions = createActionGroup({
  source: 'Navigation settings',
  events: {
    'Minimum activation speed Changed': props<{
      minActivationSpeedKpH: number;
    }>(),
    'Direction line segment seconds changed': props<{ seconds: number }>(),
    'Direction line segment count changed': props<{ count: number }>(),
    'gps tracking initial zoom changed': props<{ zoom: number }>(),
    'gps tracking initial pitch changed': props<{ pitch: number }>(),
    'Widget Goal Bg Color Changed': props<{ color: string }>(),
    'Widget Goal Text Color Changed': props<{ color: string }>(),
    'Widget Goal allowed rows changed': props<{
      list: AllowedNavigationGoalWidgetRowType;
    }>(),
    'Widget Next Point Bg Color Changed': props<{ color: string }>(),
    'Widget Next Point Text Color Changed': props<{ color: string }>(),
    'Widget Next Point allowed rows changed': props<{
      list: AllowedNavigationNextPointWidgetRowType;
    }>(),
  },
});

export type RadarTypes = 'radar' | 'satellite' | 'coverage';

export const radarSettingsActions = createActionGroup({
  source: 'Radar Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
    'Widget enabled': props<{ enabled: boolean }>(),
    'Type changed': props<{ viewType: RadarTypes }>(),
    'Color scheme changed': props<{ colorScheme: number }>(),
    'Enabled snow changed': props<{ enabled: boolean }>(),
    'Enabled smooth changed': props<{ enabled: boolean }>(),
    'Animation speed changed': props<{ animationSpeed: number }>(),
    'Opacity changed': props<{ opacity: number }>(),
    'Widget bg color changed': props<{ color: string }>(),
    'Widget text color past changed': props<{ color: string }>(),
    'Widget text color future changed': props<{ color: string }>(),
    'Pause on end changed': props<{ time: number }>(),
  },
});

export const gamePadSettingsActions = createActionGroup({
  source: 'GamePad Settings',
  events: {
    'set short cuts': props<{
      value: { [key in GamePadShortCutName]: IGamePadActions };
    }>(),
  },
});
