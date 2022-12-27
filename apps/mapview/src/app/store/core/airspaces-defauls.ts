import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';

export interface IAirSpaceSettings {
  enabled: boolean;
  color: string;
  opacity: number;
  minZoom: number;
  maxZoom: number;
}

export type IAirSpaceSettingsObject = {
  [key in EAirSpaceType]: IAirSpaceSettings;
};

export const AirspacesDefault: IAirSpaceSettingsObject = {
  [EAirSpaceType.OTHER]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.RESTRICTED]: {
    enabled: true,
    color: '#ffa500',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.DANGER]: {
    enabled: true,
    color: '#a52a2a',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.PROHIBITED]: {
    enabled: true,
    color: '#ff0000',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.CTR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TMZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.RMZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TMA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TRA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TSA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.FIR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.UIR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.ADIZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.ATZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.MATZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.AIRWAY]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.MTR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.ALERT_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.WARNING_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.PROTECTED_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.HTZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.GLIDER_SECTOR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TRP]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TIZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.TIA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.MTA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.CTA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.ACC]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.SPORT]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
  [EAirSpaceType.LOW_OVERFLIGHT_RESTRICTION]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 0,
    maxZoom: 24,
  },
};
