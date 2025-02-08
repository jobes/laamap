import { Injectable, inject } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Store } from '@ngrx/store';
import {
  Observable,
  catchError,
  combineLatest,
  filter,
  forkJoin,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { bleSensorsEffectsActions } from '../../store/actions/effects.actions';
import { BleCharacteristicNames } from '../../store/features/ble-sensors.initial-state';
import {
  BleBinaryDataType,
  CharacteristicDefinition,
  ServiceNames,
  servicesDefinition,
} from './ble-services-definition';

type GattCharacteristicDefinition = Record<
  BleCharacteristicNames,
  Observable<BluetoothRemoteGATTCharacteristic | null>
>;

@Injectable({
  providedIn: 'root',
})
export class BleService {
  store = inject(Store);
  ble = inject(BluetoothCore);

  // record service definition, [characteristic name]: characteristic definition
  private readonly characteristicsDefinition = Object.entries(
    servicesDefinition,
  ).reduce(
    (acc, [, value]) => ({
      ...acc,
      ...value.characteristics.reduce(
        (subAcc, charDef) => ({
          ...subAcc,
          [charDef.name]: charDef,
        }),
        {} as Record<string, CharacteristicDefinition>,
      ),
    }),
    {} as Record<string, CharacteristicDefinition>,
  );

  processDevice(device: BluetoothDevice): Observable<unknown> {
    return this.ble.connectDevice$(device).pipe(
      filter((gatt) => !!gatt),
      switchMap((gatt) =>
        forkJoin(
          Object.entries(servicesDefinition).reduce(
            (acc, [name, value]) => ({
              ...acc,
              [name]: this.ble.getPrimaryService$(gatt, value.id).pipe(
                catchError(() => {
                  console.warn(`BLE service ${name} not found`);
                  return of(null);
                }),
              ),
            }),
            {} as Record<
              ServiceNames,
              Observable<BluetoothRemoteGATTService | null>
            >,
          ),
        ),
      ),
      switchMap((services) => forkJoin(this.getGattCharacteristics(services))),
      switchMap((characteristics) => {
        console.log(
          'SUBSCRIBING to BLE characteristics',
          Object.entries(characteristics).reduce(
            (acc, [name, characteristic]) => ({
              ...acc,
              [name]: characteristic ? 'OK' : 'N/A',
            }),
            {},
          ),
        );

        // TODO add support for writing values
        return combineLatest(this.processCharacteristics(characteristics));
      }),
    );
  }

  private getGattCharacteristics(gattService: {
    [x in ServiceNames]: BluetoothRemoteGATTService | null;
  }): GattCharacteristicDefinition {
    return (
      Object.entries(gattService).filter(([, service]) => !!service) as [
        ServiceNames,
        BluetoothRemoteGATTService,
      ][]
    ).reduce(
      (acc, [name, service]) => ({
        ...acc,
        ...servicesDefinition[name].characteristics.reduce(
          (subAcc, charDef) => ({
            ...subAcc,
            [charDef.name]: this.ble.getCharacteristic$(service, charDef.id),
          }),
          {} as GattCharacteristicDefinition,
        ),
      }),
      {} as GattCharacteristicDefinition,
    );
  }

  private processCharacteristics(characteristics: {
    [x in BleCharacteristicNames]: BluetoothRemoteGATTCharacteristic | null;
  }): Observable<unknown>[] {
    return (
      Object.entries(characteristics) as [
        BleCharacteristicNames,
        BluetoothRemoteGATTCharacteristic | null,
      ][]
    ).reduce((acc, [characteristicName, characteristic]) => {
      if (!characteristic) {
        return acc;
      }

      return [
        ...acc,
        this.readThenNotify(characteristic).pipe(
          tap((dataView) => {
            this.store.dispatch(
              bleSensorsEffectsActions.characteristicDataChanged({
                characteristicName,
                value: this.decodeValue(
                  dataView,
                  this.characteristicsDefinition[characteristicName].dataType,
                ),
              }),
            );
          }),
        ),
      ];
    }, [] as Observable<unknown>[]);
  }

  private readThenNotify(
    characteristic: BluetoothRemoteGATTCharacteristic,
  ): Observable<DataView> {
    return this.ble
      .readValue$(characteristic)
      .pipe(
        switchMap((value) =>
          this.ble.observeValue$(characteristic).pipe(startWith(value)),
        ),
      );
  }

  private decodeValue(
    value: DataView,
    dataType: BleBinaryDataType,
  ): string | number | undefined {
    if (value.byteLength === 0) {
      return undefined;
    }
    switch (dataType) {
      case BleBinaryDataType.uint32:
        return value.getUint32(0, true);
      case BleBinaryDataType.uint16:
        return value.getUint16(0, true);
      case BleBinaryDataType.uint8:
        return value.getUint8(0);
      case BleBinaryDataType.sint32:
        return value.getInt32(0, true);
      case BleBinaryDataType.sint16:
        return value.getInt16(0, true);
      case BleBinaryDataType.sint8:
        return value.getInt8(0);
      case BleBinaryDataType.string:
        return new TextDecoder('utf-8').decode(value);
      case BleBinaryDataType.float:
        return value.getFloat32(0, true);
      case BleBinaryDataType.double:
        return value.getFloat64(0, true);
    }
  }
}
