import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { airTemperatureSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-air-temperature-widget-settings',
  templateUrl: './air-temperature-settings.component.html',
  styleUrls: ['./air-temperature-settings.component.scss'],
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
  ],
})
export class AirTemperatureSettingsComponent {
  private readonly store = inject(Store);

  settings = this.store.selectSignal(instrumentsFeature.selectAirTemperature);

  enableWidget(enabled: boolean): void {
    this.store.dispatch(
      airTemperatureSettingsActions.enabledChanged({ enabled }),
    );
  }
}
