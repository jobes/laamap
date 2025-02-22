import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { servicesDefinition } from '../../../../services/ble/ble-services-definition';
import { bleSensorsSettingsActions } from '../../../../store/actions/settings.actions';
import { bleSensorsFeature } from '../../../../store/features/ble-sensors.feature';
import { bleSensorsSettingsFeature } from '../../../../store/features/settings/ble-sensors-settings.feature';
import { BleEditComponent } from './ble-edit/ble-edit.component';

@Component({
  selector: 'laamap-ble-sensors-settings',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    TranslocoModule,
    MatButtonModule,
    BleEditComponent,
  ],
  templateUrl: './ble-sensors-settings.component.html',
  styleUrls: ['./ble-sensors-settings.component.scss'],
})
export class BleSettingsComponent {
  private readonly store = inject(Store);
  private readonly ble = inject(BluetoothCore);

  deviceId = this.store.selectSignal(bleSensorsSettingsFeature.selectDeviceId);
  deviceName = this.store.selectSignal(
    bleSensorsSettingsFeature.selectDeviceName,
  );

  sensors = computed(() =>
    Object.entries(
      this.store.selectSignal(bleSensorsFeature.selectBleSensorsState)(),
    ),
  );

  findDevice() {
    this.ble
      .discover$({
        filters: [
          {
            services: Object.values(servicesDefinition)
              .filter((value) => value.required)
              .map((value) => value.id),
          },
        ],
        optionalServices: Object.values(servicesDefinition)
          .filter((value) => !value.required)
          .map((value) => value.id),
      })
      .pipe(
        take(1),
        filter((gatt) => !!gatt),
      )
      .subscribe((value) => {
        this.store.dispatch(
          bleSensorsSettingsActions.deviceChanged({
            deviceId: value.device.id,
            deviceName: value.device.name ?? value.device.id,
          }),
        );
      });
  }

  deleteDevice() {
    this.store.dispatch(bleSensorsSettingsActions.deviceDeleted());
  }
}
