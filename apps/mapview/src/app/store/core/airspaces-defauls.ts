import { EAirSpaceType } from '../../services/open-aip/airspaces.interfaces';

export interface IAirSpaceSettings {
  enabled: boolean;
  color: string;
  opacity: number;
  minZoom: number;
}

export type IAirSpaceSettingsObject = {
  [key in EAirSpaceType]: IAirSpaceSettings;
};

export const AirspacesDefault: IAirSpaceSettingsObject = {
  [EAirSpaceType.OTHER]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.RESTRICTED]: {
    enabled: true,
    color: '#ffa500',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.DANGER]: {
    enabled: true,
    color: '#a52a2a',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.PROHIBITED]: {
    enabled: true,
    color: '#ff0000',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.CTR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TMZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.RMZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TMA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TRA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TSA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.FIR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.UIR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.ADIZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.ATZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.MATZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.AIRWAY]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.MTR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.ALERT_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.WARNING_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.PROTECTED_AREA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.HTZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.GLIDER_SECTOR]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TRP]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TIZ]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.TIA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.MTA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.CTA]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.ACC]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.SPORT]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.LOW_OVERFLIGHT_RESTRICTION]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
};
