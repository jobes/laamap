import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Store } from '@ngrx/store';
import {
  Observable,
  catchError,
  combineLatest,
  filter,
  forkJoin,
  map,
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
  SettingsCharacteristicNames,
  servicesDefinition,
  settingsCharacteristicsDefinition,
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
  gatt = toSignal(this.ble.getGATT$(), { initialValue: null });

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

  readSettingsValue(
    name: SettingsCharacteristicNames,
  ): Signal<string | number | undefined> {
    const config = settingsCharacteristicsDefinition[name];
    const serviceId = servicesDefinition[config.serviceName].id;

    const result$ = this.ble.getPrimaryService$(this.gatt(), serviceId).pipe(
      switchMap((service) => this.ble.getCharacteristic$(service, config.id)),
      filter((characteristic) => !!characteristic),
      switchMap((characteristic) => this.ble.readValue$(characteristic)),
      map((dataView) => this.decodeValue(dataView, config.dataType)),
    );
    return toSignal(result$);
  }

  writeSettingsValue(
    name: SettingsCharacteristicNames,
    value: string | number,
  ): Observable<unknown> {
    const config = settingsCharacteristicsDefinition[name];
    const serviceId = servicesDefinition[config.serviceName].id;
    return this.ble.getPrimaryService$(this.gatt(), serviceId).pipe(
      switchMap((service) => this.ble.getCharacteristic$(service, config.id)),
      filter((characteristic) => !!characteristic),
      switchMap((characteristic) => {
        const buffer = this.encodeValue(value, config.dataType);
        return this.ble.writeValue$(characteristic, buffer);
      }),
    );
  }

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

  private encodeValue(
    value: string | number,
    dataType: BleBinaryDataType,
  ): ArrayBuffer {
    let buffer = new ArrayBuffer(0);
    let view = new DataView(buffer, 0);

    switch (dataType) {
      case BleBinaryDataType.uint32:
        buffer = new ArrayBuffer(4);
        view = new DataView(buffer, 0);
        view.setUint32(0, value as number, true);
        return view.buffer;
      case BleBinaryDataType.uint16:
        buffer = new ArrayBuffer(2);
        view = new DataView(buffer, 0);
        view.setUint16(0, value as number, true);
        return view.buffer;
      case BleBinaryDataType.uint8:
        buffer = new ArrayBuffer(1);
        view = new DataView(buffer, 0);
        view.setUint8(0, value as number);
        return view.buffer;
      case BleBinaryDataType.sint32:
        buffer = new ArrayBuffer(4);
        view = new DataView(buffer, 0);
        view.setInt32(0, value as number, true);
        return view.buffer;
      case BleBinaryDataType.sint16:
        buffer = new ArrayBuffer(2);
        view = new DataView(buffer, 0);
        view.setInt16(0, value as number, true);
        return view.buffer;
      case BleBinaryDataType.sint8:
        buffer = new ArrayBuffer(1);
        view = new DataView(buffer, 0);
        view.setInt8(0, value as number);
        return view.buffer;
      case BleBinaryDataType.string:
        return new TextEncoder().encode(value as string);
      case BleBinaryDataType.float:
        buffer = new ArrayBuffer(4);
        view = new DataView(buffer, 0);
        view.setFloat32(0, value as number, true);
        return view.buffer;
      case BleBinaryDataType.double:
        buffer = new ArrayBuffer(8);
        view = new DataView(buffer, 0);
        view.setFloat64(0, value as number, true);
        return view.buffer;
    }
  }
}
