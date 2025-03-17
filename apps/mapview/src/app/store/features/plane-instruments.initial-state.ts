const planeInstrumentsBarInitialState = {
  rpm: null as number | null,
  cht1Temp: null as number | null,
  cht2Temp: null as number | null,
  oilTemp: null as number | null,
  oilPressure: null as number | null,
  fuel1: null as number | null,
  fuel2: null as number | null,
};

export const planeInstrumentsInitialState = {
  ...planeInstrumentsBarInitialState,
  cpuUsage: null as number | null, // for checking if instruments are connected
  oilPressure: null as number | null,
  outsideTemperature: null as number | null,
  airPressure: null as number | null,
  airPressureTemperature: null as number | null,
  ias: null as number | null,
  thermoCouple1: null as number | null,
};

export type PlaneInstrumentsBarKeys =
  keyof typeof planeInstrumentsBarInitialState;
export type IPlaneInstruments = typeof planeInstrumentsInitialState;
export type IPlaneInstrumentsType = keyof IPlaneInstruments;
