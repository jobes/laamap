import { EHeightUnit, EReferenceDatum } from './airport.interfaces';
import { ECountries } from './country.interface';

export enum EAirSpaceType {
  other = 0, // Other
  restricted = 1, // Restricted
  danger = 2, // Danger
  prohibited = 3, // Prohibited
  ctr = 4, // Controlled Tower Region (CTR)
  tmz = 5, // Transponder Mandatory Zone (TMZ)
  rmz = 6, // Radio Mandatory Zone (RMZ)
  tma = 7, // Terminal Maneuvering Area (TMA)
  tra = 8, // Temporary Reserved Area (TRA)
  tsa = 9, // Temporary Segregated Area (TSA)
  fir = 10, // Flight Information Region (FIR)
  uir = 11, // Upper Flight Information Region (UIR)
  adiz = 12, // Air Defense Identification Zone (ADIZ)
  atz = 13, // Airport Traffic Zone (ATZ)
  matz = 14, // Military Airport Traffic Zone (MATZ)
  airway = 15, // Airway
  mtr = 16, // Military Training Route (MTR)
  alertArea = 17, // Alert Area
  warningArea = 18, // Warning Area
  protectedArea = 19, // Protected Area
  htz = 20, // Helicopter Traffic Zone (HTZ)
  gliderSector = 21, // Gliding Sector
  trp = 22, // Transponder Setting (TRP)
  tiz = 23, // Traffic Information Zone (TIZ)
  tia = 24, // Traffic Information Area (TIA)
  mta = 25, // Military Training Area (MTA)
  cta = 26, // Controlled Area (CTA)
  acc = 27, // ACC Sector (ACC)
  sport = 28, // Aerial Sporting Or Recreational Activity
  lowOverflightRestriction = 29, // Low Altitude Overflight Restriction
}

enum EAirSpaceIcaoClass {
  a = 0,
  b = 1,
  c = 2,
  d = 3,
  e = 4,
  f = 5,
  g = 6,
  other = 8, // Unclassified / Special Use Airspace (SUA)
}

enum EAirSpaceActivity {
  none = 0, // None - No specific activity (default)
  parachuting = 1, // Parachuting Activity
  aerobatics = 2, // Aerobatics Activity
  aeroClub = 3, // Aeroclub And Arial Work Area
  ultralight = 4, // Ultra Light Machine (ULM) Activity
  hangParaglider = 5, // Hang Gliding/Paragliding
}
export interface IAirspaceResponse {
  _id: string;
  approved: boolean;
  name: string;
  type: EAirSpaceType;
  icaoClass: EAirSpaceIcaoClass;
  activity: EAirSpaceActivity;
  onDemand: boolean;
  onRequest: boolean;
  byNotam: boolean;
  specialAgreement: boolean;
  requestCompliance: boolean;
  country: ECountries;
  upperLimit: {
    value: number;
    unit: EHeightUnit;
    referenceDatum: EReferenceDatum;
  };
  lowerLimit: {
    value: number;
    unit: EHeightUnit;
    referenceDatum: EReferenceDatum;
  };
  frequencies: {
    value: string;
    unit: 2;
    primary: boolean;
  }[];
}

export interface IAirspace extends IAirspaceResponse {
  lowerLimitMetersMsl: number;
  upperLimitMetersMsl: number;
}
