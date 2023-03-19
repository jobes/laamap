import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';

export interface IAirSpaceSettings {
  enabled: boolean;
  color: string;
  opacity: number;
  minZoom: number;
}

export type IAirSpaceSettingsObject = {
  [key in EAirSpaceType]: IAirSpaceSettings;
};

export const airspacesInitValue: IAirSpaceSettingsObject = {
  [EAirSpaceType.other]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.restricted]: {
    enabled: true,
    color: '#ffa500',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.danger]: {
    enabled: true,
    color: '#a52a2a',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.prohibited]: {
    enabled: true,
    color: '#ff0000',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.ctr]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tmz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.rmz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tma]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tra]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tsa]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.fir]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.uir]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.adiz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.atz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.matz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.airway]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.mtr]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.alertArea]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.warningArea]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.protectedArea]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.htz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.gliderSector]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.trp]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tiz]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.tia]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.mta]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.cta]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.acc]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.sport]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
  [EAirSpaceType.lowOverflightRestriction]: {
    enabled: true,
    color: '#808080',
    opacity: 0.1,
    minZoom: 5,
  },
};
