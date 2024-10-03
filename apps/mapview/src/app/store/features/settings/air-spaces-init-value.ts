import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';
import { airspacesActivity } from '../../actions/settings.actions';

export type IAirSpaceSettings = {
  [key in (typeof airspacesActivity)[number]]: {
    color: string;
    opacity: number;
  };
} & { enabled: boolean; minZoom: number };

export type IAirSpaceSettingsObject = {
  [key in EAirSpaceType]: IAirSpaceSettings;
};

export const airspacesInitValue: {
  activationAirspaceList: string[];
  airspacesDef: IAirSpaceSettingsObject;
} = {
  activationAirspaceList: [],
  airspacesDef: {
    [EAirSpaceType.other]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      activated: {
        color: '#808080',
        opacity: 0.1,
      },
      deactivated: {
        color: '#808080',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.restricted]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.danger]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.prohibited]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      activated: {
        color: '#db2100',
        opacity: 0.75,
      },
      deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.ctr]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#00ccff',
        opacity: 0.5,
      },
      activated: {
        color: '#00ccff',
        opacity: 0.5,
      },
      deactivated: {
        color: '#00ccff',
        opacity: 0.5,
      },
    },
    [EAirSpaceType.tmz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.rmz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tma]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tra]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tsa]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.fir]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.uir]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.adiz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#db2100',
        opacity: 0.25,
      },
      activated: {
        color: '#db2100',
        opacity: 0.25,
      },
      deactivated: {
        color: '#db2100',
        opacity: 0.25,
      },
    },
    [EAirSpaceType.atz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      activated: {
        color: '#808080',
        opacity: 0.1,
      },
      deactivated: {
        color: '#d8d8d8',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.matz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#db2100',
        opacity: 0.35,
      },
      activated: {
        color: '#db2100',
        opacity: 0.35,
      },
      deactivated: {
        color: '#db2100',
        opacity: 0.35,
      },
    },
    [EAirSpaceType.airway]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.mtr]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      activated: {
        color: '#db2100',
        opacity: 0.1,
      },
      deactivated: {
        color: '#db2100',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.alertArea]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.warningArea]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.protectedArea]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.htz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ff2500',
        opacity: 0.1,
      },
      activated: {
        color: '#ff2500',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ff2500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.gliderSector]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.trp]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.tiz]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#925449',
        opacity: 0.1,
      },
      activated: {
        color: '#925449',
        opacity: 0.1,
      },
      deactivated: {
        color: '#925449',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tia]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#925449',
        opacity: 0.1,
      },
      activated: {
        color: '#925449',
        opacity: 0.1,
      },
      deactivated: {
        color: '#925449',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.mta]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffa500',
        opacity: 0.2,
      },
      activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.cta]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.acc]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      activated: {
        color: '#000000',
        opacity: 0.0,
      },
      deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.sport]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      activated: {
        color: '#808080',
        opacity: 0.1,
      },
      deactivated: {
        color: '#808080',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.lowOverflightRestriction]: {
      enabled: true,
      minZoom: 5,
      unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
  },
};
