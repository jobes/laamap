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
      Unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      Activated: {
        color: '#808080',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#808080',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.restricted]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      Deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.danger]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.prohibited]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.75,
      },
      Deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.ctr]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#00ccff',
        opacity: 0.5,
      },
      Activated: {
        color: '#00ccff',
        opacity: 0.5,
      },
      Deactivated: {
        color: '#00ccff',
        opacity: 0.5,
      },
    },
    [EAirSpaceType.tmz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.rmz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tma]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tra]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tsa]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.fir]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.uir]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.adiz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#db2100',
        opacity: 0.25,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.25,
      },
      Deactivated: {
        color: '#db2100',
        opacity: 0.25,
      },
    },
    [EAirSpaceType.atz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      Activated: {
        color: '#808080',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#d8d8d8',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.matz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#db2100',
        opacity: 0.35,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.35,
      },
      Deactivated: {
        color: '#db2100',
        opacity: 0.35,
      },
    },
    [EAirSpaceType.airway]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.mtr]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#db2100',
        opacity: 0.1,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#db2100',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.alertArea]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.warningArea]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.protectedArea]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffa500',
        opacity: 0.1,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      Deactivated: {
        color: '#fb00ff',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.htz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ff2500',
        opacity: 0.1,
      },
      Activated: {
        color: '#ff2500',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ff2500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.gliderSector]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.trp]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.tiz]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#925449',
        opacity: 0.1,
      },
      Activated: {
        color: '#925449',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#925449',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.tia]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#925449',
        opacity: 0.1,
      },
      Activated: {
        color: '#925449',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#925449',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.mta]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffa500',
        opacity: 0.2,
      },
      Activated: {
        color: '#db2100',
        opacity: 0.5,
      },
      Deactivated: {
        color: '#ffa500',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.cta]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.acc]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#000000',
        opacity: 0.0,
      },
      Activated: {
        color: '#000000',
        opacity: 0.0,
      },
      Deactivated: {
        color: '#000000',
        opacity: 0.0,
      },
    },
    [EAirSpaceType.sport]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#808080',
        opacity: 0.1,
      },
      Activated: {
        color: '#808080',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#808080',
        opacity: 0.1,
      },
    },
    [EAirSpaceType.lowOverflightRestriction]: {
      enabled: true,
      minZoom: 5,
      Unknown: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Activated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
      Deactivated: {
        color: '#ffdd00',
        opacity: 0.1,
      },
    },
  },
};
