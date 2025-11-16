import { ECountries } from './country.interface';

export enum EAirportType {
  airport = 0, // civil/military
  gliderSite = 1,
  airfieldCivil = 2,
  internationalAirport = 3,
  heliportMilitary = 4,
  militaryAerodrome = 5,
  ultralightFlyingSite = 6,
  heliportCivil = 7,
  aerodromeClosed = 8,
  ifr = 9, // Airport resp. Airfield IFR
  airfieldWater = 10,
  landingStrip = 11,
  agriculturalLandingStrip = 12,
  altiport = 13,
}

export enum EHeightUnit {
  meter = 0,
  feet = 1,
  flightLevel = 6,
}

export enum ESpeedUnit {
  mps = 'mps',
  kph = 'kph',
}

export enum EFrequencyUnit {
  mhz = 2,
}

enum EWeightUnit {
  ton = 9,
}

export enum EReferenceDatum {
  gnd = 0,
  msl = 1,
  std = 2,
}

export enum ETrafficType {
  vfr = 0,
  ifr = 1,
}

enum EFuelType {
  superPlus = 0,
  avGas = 1,
  jetA = 2,
  jetA1 = 3,
  jetB = 4,
  diesel = 5,
  avGasUL91 = 6,
}

enum EGliderTowing {
  selfLaunch = 0,
  winch = 1,
  toe = 2,
  autoTow = 3,
  bungee = 4,
  gravityPowered = 5,
}

enum EHandlingFacilities {
  cargoHandling = 0,
  deicing = 1,
  maintenance = 2,
  security = 3,
  shelter = 4,
}

enum EPassengerFacilities {
  bankOffice = 0,
  postOffice = 1,
  customs = 2,
  lodging = 3,
  medicalFacility = 4,
  restaurant = 5,
  sanitation = 6,
  transportation = 7,
  laundryService = 8,
  camping = 9,
}

enum EFrequencyType {
  approach = 0,
  apron = 1,
  arrival = 2,
  center = 3,
  ctaf = 4,
  delivery = 5,
  departure = 6,
  fis = 7,
  gliding = 8,
  ground = 9,
  info = 10,
  multicom = 11,
  unicom = 12,
  radar = 13,
  tower = 14,
  atis = 15,
  radio = 16,
  other = 17,
  airmet = 18,
  awos = 19,
  lights = 20,
  volmet = 21,
}

enum ERunwayOperations {
  active = 0,
  temporaryClose = 1,
  closed = 2,
}

enum ETurnDirection {
  right = 0,
  left = 1,
  both = 2,
}

export enum ERunwayComposition {
  asphalt = 0, // Asphalt
  concrete = 1, // Concrete
  grass = 2, // Grass
  sand = 3, // Sand
  water = 4, // Water
  bituminousTar = 5, // Bituminous tar or asphalt ("earth cement")
  brick = 6, // Brick
  macadam = 7, // Macadam or tarmac surface consisting of water-bound crushed rock
  stone = 8, // Stone
  coral = 9, // Coral
  clay = 10, // Clay
  laterite = 11, // Laterite - a high iron clay formed in tropical areas
  gravel = 12, // Gravel
  earth = 13, // Earth
  ice = 14, // Ice
  snow = 15, // Snow
  laminate = 16, // Protective laminate usually made of rubber
  metal = 17, // Metal
  portable = 18, // Landing mat portable system usually made of aluminum
  piercedSteelPlanking = 19, // Pierced steel planking
  wood = 20, // Wood
  nonBituminousMix = 21, // Non Bituminous mix
  unknown = 22, // Unknown
}

enum ERunwayCondition {
  good = 0,
  fair = 1,
  poor = 2,
  unsafe = 3,
  deformed = 4,
  unknown = 5,
}

enum EExclusiveAircraftType {
  singleEnginePiston = 0,
  singleEngineTurbine = 1,
  multiEnginePiston = 2,
  multiEngine = 3,
  highPerformanceAircraft = 4,
  touringMotorGlider = 5,
  experimental = 6,
  veryLightAircrafr = 7,
  glider = 8,
  lightSportAircraft = 9,
  ultralightAircraft = 10,
  hangGlider = 11,
  paraglider = 12,
  baloon = 13,
}

export interface IAirportFrequency {
  _id: string;
  value: string; // pattern: ^\d{3}\.\d{3}$
  unit: EFrequencyUnit;
  type: EFrequencyType;
  primary: boolean;
  name: string;
  publicUse: boolean;
  remarks: string;
}

export interface IRunway {
  _id: string;
  designator: string; // ^(0[1-9]|[1-2]\d|3[0-6])[LCR]?$
  trueHeading: number; // 0 - 360
  alignedTrueNorth: boolean;
  operations: ERunwayOperations;
  mainRunway: boolean;
  turnDirection: ETurnDirection;
  landingOnly: boolean;
  takeOffOnly: boolean;
  surface: {
    composition: ERunwayComposition[];
    mainComposite: ERunwayComposition;
    condition: ERunwayCondition;
    mtow: {
      value: number;
      unit: EWeightUnit.ton;
    };
    pcn: string; //^([1-9]|0?[1-9][0-9]|1[0-9][0-9]|2[0][0])/([fF,rR]{1})/([aA,bB,cC,dD]{1})/([wW,xX,yY,zZ]{1})/([tT,uU]{1})$
  };
  dimension: {
    length: { value: number; unit: EHeightUnit.meter };
    width: { value: number; unit: EHeightUnit.meter };
  };
  exclusiveAircraftType: EExclusiveAircraftType[];
  pilotCtrlLighting: boolean;
  remarks: string;
}

export interface IAirportResponse {
  _id: string;
  approved: boolean;
  name: string;
  icaoCode: string; // pattern: ^[A-Z]{4}$
  iataCode: string; // pattern: ^[A-Z]{3}$
  altIdentifier: string;
  type: EAirportType;
  country: ECountries;
  elevation: {
    value: number;
    unit: EHeightUnit.meter;
    referenceDatum: EReferenceDatum.msl;
  };
  elevationGeoid: {
    hae: number; // Height above ellipsoid in meters.
    geoidHeight: number; // Height of geoid in meters.
  };
  trafficType: ETrafficType[];
  magneticDeclination: number;
  ppr: boolean;
  private: boolean;
  skydiveActivity: boolean;
  winchOnly: boolean;
  services: {
    fuelTypes: EFuelType[];
    gliderTowing: EGliderTowing[];
    handlingFacilities: EHandlingFacilities[];
    passengerFacilities: EPassengerFacilities[];
  };
  frequencies: IAirportFrequency[];

  runways: IRunway[];

  contact: string;
  remarks: string;
  images: { _id: string; filename: string; description: string }[];
}

export interface IAirport extends IAirportResponse {
  mainRunway: (IRunway & { paved: boolean }) | Record<string, never>;
  mainFrequency: IAirportFrequency | Record<string, never>;
}
