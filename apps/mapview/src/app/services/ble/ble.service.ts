import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

interface BluetoothRequestDeviceOptions {
  filters: Array<{
    services?: (string | number)[];
    name?: string;
    namePrefix?: string;
  }>;
  optionalServices?: (string | number)[];
  acceptAllDevices?: boolean;
}

declare global {
  // Extend the Navigator interface to include the Web Bluetooth API
  interface Navigator {
    bluetooth?: {
      requestDevice(
        options: BluetoothRequestDeviceOptions,
      ): Promise<BluetoothDevice>;
    };
  }

  // Define the BluetoothDevice interface if not already defined
  interface BluetoothDevice extends EventTarget {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
  }

  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(
      service: string | number,
    ): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(
      characteristic: string | number,
    ): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class BleService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();
  private bleIpServiceId = '11fafbd4-f9c7-4098-880d-6ce9c9138872';
  private bleIpCharacteristicId = '1c17dcf4-3689-49cd-b462-ec5ccddf0c7a';

  /**
   * Simulates getting IP address from a BLE device
   * In a real implementation, this would use the Web Bluetooth API
   */
  /**
   * Attempts to connect to a BLE device and retrieve its IP address
   * @returns A promise that resolves to the IP address or null if unsuccessful
   */
  async getIpFromDevice(): Promise<string | null> {
    this._isLoading.set(true);

    try {
      // Check if Web Bluetooth is supported
      if (!('bluetooth' in navigator)) {
        this.showError('settingDialog.instruments.ble.notSupported');
        return null;
      }
      const device = await navigator.bluetooth?.requestDevice({
        filters: [{ services: ['11fafbd4-f9c7-4098-880d-6ce9c9138872'] }],
      });
      if (!device || !device.gatt) {
        return null;
      }

      const server = await device.gatt.connect();
      const service = await server?.getPrimaryService(this.bleIpServiceId);
      const characteristic = await service?.getCharacteristic(
        this.bleIpCharacteristicId,
      );
      const value = await characteristic?.readValue();
      const ipAddress = new TextDecoder().decode(value?.buffer);
      return ipAddress;
    } catch (error) {
      console.error('Error getting IP from BLE:', error);
      this.showError('settingDialog.instruments.ble.connectionError');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  private showError(translationKey: string): void {
    const message = this.transloco.translate(translationKey);
    this.snackBar.open(message, undefined, {
      duration: 5000,
      politeness: 'polite',
    });
  }
}
