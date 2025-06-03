import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  GamePadShortCutName,
  IGamePadActions,
} from '../../services/gamepad-handler/gamepad-handler.types';
import { EHeightUnit } from '../../services/open-aip/airport.interfaces';
import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';
import { PlaneInstrumentsBarKeys } from '../features/plane-instruments.initial-state';
import {
  AllowedNavigationGoalWidgetRowType,
  AllowedNavigationNextPointWidgetRowType,
} from '../features/settings/navigation.feature';

export const airspacesActivity = [
  'unknown',
  'activated',
  'deactivated',
] as const;

export const airspacesSettingsActions = createActionGroup({
  source: 'Airspaces settings',
  events: {
    'Enabled Changed': props<{
      airspaceType: EAirSpaceType;
      enabled: boolean;
    }>(),
    'Color changed': props<{
      airspaceType: EAirSpaceType;
      color: string;
      airspacesActivity: (typeof airspacesActivity)[number];
    }>(),
    'Opacity changed': props<{
      airspaceType: EAirSpaceType;
      opacity: number;
      airspacesActivity: (typeof airspacesActivity)[number];
    }>(),
    'Min zoom changed': props<{
      airspaceType: EAirSpaceType;
      minZoom: number;
    }>(),
    'Activation airspace list changed': props<{
      activationAirspaceList: string[];
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
    'Notam FIR changed': props<{ firs: string[] }>(),
    'Notam radius changed': props<{ radius: number }>(),
    'Territories changed': props<{ territories: string[] }>(),
    'Language changed': props<{ language: string }>(),
    'Log out': emptyProps(),
  },
});

export const instrumentSettingsActions = createActionGroup({
  source: 'Instrument settings',
  events: {
    'Visible on gps tracking changed': props<{
      showOnlyOnActiveGps: boolean;
    }>(),
    'Airplane instruments URL changed': props<{
      url: string;
    }>(),
  },
});

export const instrumentAltimeterSettingsActions = createActionGroup({
  source: 'Instrument altimeter settings',
  events: {
    'Manual GND Altitude Changed': props<{
      gndAltitude: number;
    }>(),
    'Altitude Gps Error Changed': props<{
      gpsAltitudeError: number;
    }>(),
    'qfe Changed': props<{
      qfe: number;
    }>(),
    'Qnh Changed': props<{
      qnh: number;
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

export const AircraftBarInstrumentWidgetSettingsActions = createActionGroup({
  source: 'Aircraft bar instrument settings',
  events: {
    show: props<{ show: boolean; instrumentType: PlaneInstrumentsBarKeys }>(),
    'Bg Color Changed': props<{
      bgColor: string;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Text Color Changed': props<{
      textColor: string;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Min shown value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Max shown value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Lower alert value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Lower caution value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Upper caution value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
    }>(),
    'Upper alert value Changed': props<{
      value: number;
      instrumentType: PlaneInstrumentsBarKeys;
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
    'relative Height Source Changed': props<{
      source: 'gps' | 'pressure';
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
    'Average speed changed': props<{ speed: number }>(),
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

export const terrainSettingsActions = createActionGroup({
  source: 'Terrain Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
    'Gnd height calculate using terrain changed': props<{ enabled: boolean }>(),
    'Exaggeration changed': props<{ exaggeration: number }>(),
  },
});

export const trafficSettingsActions = createActionGroup({
  source: 'Traffic Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
    'Is rego changed': props<{ isRego: boolean }>(),
    'Rego or label changed': props<{ regoOrLabel: string }>(),
    'Aircraft type changed': props<{ aircraftType: number }>(),
    'Puretrack key set': props<{ accessKey: string }>(),
    'Puretrack key deleted': emptyProps(),
    'Max age changed': props<{ maxAge: number }>(),
    'Max height above me changed': props<{ maxHeightAboveMe: number }>(),
    'Altitude display unit changed': props<{
      altitudeDisplayUnit: EHeightUnit;
    }>(),
    'Actualization period changed': props<{ actualizationPeriod: number }>(),
  },
});

export const altimeterQuickSettingsActions = createActionGroup({
  source: 'Altimeter Quick Settings',
  events: {
    'Manual GND Altitude changed': props<{ gndAltitude: number }>(),
    'Automatic GND Altitude requested': emptyProps(),
    'Manual Qnh changed': props<{ qnh: number }>(),
    'Automatic Qnh requested': emptyProps(),
    'Manual Qfe changed': props<{ qfe: number }>(),
    'Automatic Qfe requested': emptyProps(),
    'Gps altitude error changed': props<{ gpsAltitudeError: number }>(),
    'Automatic Gps altitude error requested': emptyProps(),
  },
});

export const compassSettingsActions = createActionGroup({
  source: 'Compass Settings',
  events: {
    'Widget enabled changed': props<{ enabled: boolean }>(),
    'Circle enabled changed': props<{ enabled: boolean }>(),
    'Circle moved from bottom': props<{ value: number }>(),
    'Circle moved from center': props<{ value: number }>(),
    'Circle relative size changed': props<{ value: number }>(),
  },
});

export const airTemperatureSettingsActions = createActionGroup({
  source: 'Air temperature Settings',
  events: {
    'Enabled changed': props<{ enabled: boolean }>(),
  },
});
