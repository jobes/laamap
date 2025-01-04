import { Injectable } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import {
  bluetoothFlyInstrumentPressureCharacteristic,
  bluetoothFlyInstrumentTemperatureCharacteristic,
  bluetoothServiceIdFlyInstruments,
} from '../../helper';
import { bleSensorsEffectsActions } from '../actions/effects.actions';
import { bleSensorsSettingsActions } from '../actions/settings.actions';
import { mapFeature } from '../features/map.feature';
import { bleSensorsSettingsFeature } from '../features/settings/ble-sensors-settings.feature';

@Injectable()
export class BleSensorsEffects {
  firstGeolocationFixed$ = createEffect(() => {
    return this.store.select(mapFeature.selectLoaded).pipe(
      filter((loaded) => loaded),
      switchMap(() =>
        this.store.select(bleSensorsSettingsFeature.selectDeviceId),
      ),
      take(1),
      filter((deviceId) => !!deviceId),
      map((deviceId) => bleSensorsEffectsActions.connectDevice({ deviceId })),
    );
  });

  connectDevice$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          bleSensorsSettingsActions.deviceChanged,
          bleSensorsEffectsActions.connectDevice,
        ),
        switchMap((deviceId) => {
          return navigator.bluetooth.getDevices().then((devices) => {
            return devices.find((d) => d.id === deviceId.deviceId);
          });
        }),
        filter((device) => !!device),
        tap((device) => {
          device.addEventListener('gattserverdisconnected', () => {
            this.store.dispatch(bleSensorsEffectsActions.deviceDisconnected());
          });
        }),
        switchMap((device) => this.ble.connectDevice$(device)),
        filter((gatt) => !!gatt),
        switchMap((gatt) =>
          forkJoin({
            flyInstruments: this.ble.getPrimaryService$(
              gatt,
              bluetoothServiceIdFlyInstruments,
            ),
          }),
        ),
        switchMap(({ flyInstruments }) =>
          forkJoin({
            pressure: this.ble.getCharacteristic$(
              flyInstruments,
              bluetoothFlyInstrumentPressureCharacteristic,
            ),
            temperature: this.ble.getCharacteristic$(
              flyInstruments,
              bluetoothFlyInstrumentTemperatureCharacteristic,
            ),
          }),
        ),
        switchMap(({ pressure, temperature }) => {
          const observables = [];
          console.log('SUBSCRIBING!!!', pressure);
          if (pressure) {
            observables.push(
              this.ble.observeValue$(pressure).pipe(
                tap((value) => {
                  this.store.dispatch(
                    bleSensorsEffectsActions.pressureChanged({
                      value: this.toNumber(value),
                    }),
                  );
                }),
              ),
            );
          }
          if (temperature) {
            observables.push(
              this.ble.observeValue$(temperature).pipe(
                tap((value) => {
                  this.store.dispatch(
                    bleSensorsEffectsActions.temperatureChanged({
                      value: this.toNumber(value),
                    }),
                  );
                }),
              ),
            );
          }
          return combineLatest(observables);
        }),
      );
    },
    { dispatch: false },
  );

  disconnectDevice$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bleSensorsSettingsActions.deviceDeleted),
        tap(() => {
          this.ble.disconnectDevice();
        }),
      );
    },
    { dispatch: false },
  );
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly ble: BluetoothCore,
  ) {}

  private enc = new TextDecoder('utf-8');

  private toString(val: DataView): string {
    return this.enc.decode(val);
  }
  private toNumber(val: DataView): number {
    return parseFloat(this.toString(val));
  }
}
