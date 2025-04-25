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
  cpuUsage: null as number | null, // for checking if instruments are connected
  ramUsage: null as number | null,
  cpuTemp: null as number | null,
  airPressure: null as number | null,
  ias: null as number | null,
  radioActiveFreq: null as number | null,
  radioActiveFreqName: null as string | null,
  radioStandbyFreq: null as number | null,
  radioStandbyFreqName: null as string | null,
  radioError: null as null | boolean,
  radioRxState: null as null | boolean,
  radioTxState: null as null | boolean,
};

export type PlaneInstrumentsBarKeys =
  keyof typeof planeInstrumentsBarInitialState;
export type IPlaneInstruments = typeof planeInstrumentsInitialState;
export type IPlaneInstrumentsType = keyof IPlaneInstruments;
