import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import {
  SettingsCharacteristicNames,
  settingsCharacteristicsDefinition,
} from '../../../../../services/ble/ble-services-definition';
import { BleService } from '../../../../../services/ble/ble.service';

@Component({
  selector: 'laamap-ble-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    TranslocoModule,
  ],
  templateUrl: './ble-edit.component.html',
  styleUrls: ['./ble-edit.component.scss'],
})
export class BleEditComponent {
  private readonly bleService = inject(BleService);
  editList = (
    Object.keys(
      settingsCharacteristicsDefinition,
    ) as SettingsCharacteristicNames[]
  ).map((key) => ({
    name: key,
    value: this.bleService.readSettingsValue(key),
  }));

  updateValue(name: SettingsCharacteristicNames, value: string | number) {
    this.bleService.writeSettingsValue(name, value).subscribe();
  }
}
