import { Injectable } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take, tap } from 'rxjs';

import { BleService } from '../../services/ble/ble.service';
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
        switchMap((deviceId) => this.getBleDevice(deviceId.deviceId)),
        filter((device) => !!device),
        tap((device) => {
          device.addEventListener('gattserverdisconnected', () => {
            this.store.dispatch(bleSensorsEffectsActions.deviceDisconnected());
          });
        }),
        switchMap((device) => this.bleService.processDevice(device)),
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

  private getBleDevice(deviceId: string): Promise<BluetoothDevice | undefined> {
    return navigator.bluetooth
      .getDevices()
      .then((devices) => devices.find((d) => d.id === deviceId));
  }
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly ble: BluetoothCore,
    private readonly bleService: BleService,
  ) {}
}
