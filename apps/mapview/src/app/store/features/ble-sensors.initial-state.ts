export const bleSensorsInitialState = {
  pressure: undefined as number | undefined,
  temperature: undefined as number | undefined,
  rpm: undefined as number | undefined,
  tc1: undefined as number | undefined,
  tc2: undefined as number | undefined,
  tc3: undefined as number | undefined,
  tc4: undefined as number | undefined,
  um1: undefined as number | undefined,
  um2: undefined as number | undefined,
  um3: undefined as number | undefined,
  um4: undefined as number | undefined,
  um5: undefined as number | undefined,
  um6: undefined as number | undefined,
  at1: undefined as number | undefined,
  at2: undefined as number | undefined,
  at3: undefined as number | undefined,
  at4: undefined as number | undefined,
  au1: undefined as number | undefined,
  au2: undefined as number | undefined,
  au3: undefined as number | undefined,
  rdacTemp: undefined as number | undefined,
  oilPressure: undefined as number | undefined,
  fuelLevel: undefined as number | undefined,
};

export type BleCharacteristicNames = keyof typeof bleSensorsInitialState;
