export function escapeStringRegexp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export function isPwa() {
  return ['fullscreen', 'standalone', 'minimal-ui'].some(
    (displayMode) =>
      window.matchMedia('(display-mode: ' + displayMode + ')').matches ||
      (window.navigator as unknown as { [key: string]: unknown })[
        'standalone'
      ] ||
      document.referrer.includes('android-app://'),
  );
}

export const flyAnimationDuration = 3000;
export const compassDuration = 1000;
export const bluetoothServiceIdFlyInstruments =
  'e0833334-0e1d-4b79-ae7f-a4e5792819e9';
export const bluetoothFlyInstrumentPressureCharacteristic =
  '1e49540c-448c-44e7-a518-0a28151b3779';
export const bluetoothFlyInstrumentTemperatureCharacteristic =
  '3e5047b4-131a-4b31-8bc3-5e338fed6c08';

export const pressureOnSeaLevel = (pressure: number, altitude: number) =>
  Math.round((pressure ?? 0) / Math.pow(1.0 - altitude / 44330.0, 5.255) / 100);

export const altitudeFromPressure = (pressure: number, qnh: number) =>
  Math.round(
    ((1.0 - Math.pow(pressure / (qnh * 100), 0.190284)) * 287.15) / 0.0065,
  );
