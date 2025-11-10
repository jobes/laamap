const planeInstrumentsBarInitialState = {
  rpm: null as number | null,
  cht1Temp: null as number | null,
  cht2Temp: null as number | null,
  oilTemp: null as number | null,
  oilPressure: null as number | null,
  fuelLevel: null as number | null,
};

export const planeInstrumentsInitialState = {
  ...planeInstrumentsBarInitialState,
  cpuUsage: 12 as number | null, // for checking if instruments are connected
  ramUsage: 8 as number | null,
  cpuTemp: 45 as number | null,
  airPressure: 1013 as number | null,
  ias: 250 as number | null,
  radioActiveFreq: 121.5 as number | null,
  radioActiveFreqName: 'Emergency' as string | null,
  radioStandbyFreq: null as number | null,
  radioStandbyFreqName: null as string | null,
  radioError: null as null | boolean,
  radioRxState: null as null | boolean,
  radioTxState: null as null | boolean,
  airTemperature: null as number | null,
};

export type PlaneInstrumentsBarKeys =
  keyof typeof planeInstrumentsBarInitialState;
export type IPlaneInstruments = typeof planeInstrumentsInitialState;
export type IPlaneInstrumentsType = keyof IPlaneInstruments;
