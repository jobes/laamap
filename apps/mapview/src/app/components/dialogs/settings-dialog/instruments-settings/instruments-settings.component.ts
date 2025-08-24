import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { BleService } from '../../../../services/ble/ble.service';
import { instrumentSettingsActions } from '../../../../store/actions/settings.actions';
import { planeInstrumentsFeature } from '../../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../../store/features/settings/instruments.feature';
import { AirTemperatureSettingsComponent } from './air-temperature-settings/air-temperature-settings.component';
import { AircraftBarInstrumentWidgetSettingsComponent } from './aircraft-bar-instrument-widget-settings/aircraft-bar-instrument-widget-settings.component';
import { AltitudeWidgetSettingsComponent } from './altitude-widget-settings/altitude-widget-settings.component';
import { CompassSettingsComponent } from './compass-settings/compass-settings.component';
import { SpeedWidgetSettingsComponent } from './speed-widget-settings/speed-widget-settings.component';
import { TrackingWidgetSettingsComponent } from './tracking-widget-settings/tracking-widget-settings.component';
import { VarioWidgetSettingsComponent } from './vario-widget-settings/vario-widget-settings.component';

@Component({
  selector: 'laamap-instruments-settings',
  templateUrl: './instruments-settings.component.html',
  styleUrls: ['./instruments-settings.component.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatTooltipModule,
    SpeedWidgetSettingsComponent,
    AltitudeWidgetSettingsComponent,
    VarioWidgetSettingsComponent,
    TrackingWidgetSettingsComponent,
    AircraftBarInstrumentWidgetSettingsComponent,
    CompassSettingsComponent,
    AirTemperatureSettingsComponent,
  ],
})
export class InstrumentsSettingsComponent {
  private readonly store = inject(Store);
  private readonly bleService = inject(BleService);
  showOnlyOnActiveGps = this.store.selectSignal(
    instrumentsFeature.selectShowOnlyOnActiveGps,
  );
  airplaneInstrumentsUrl = this.store.selectSignal(
    instrumentsFeature.selectAirplaneInstrumentsUrl,
  );

  airplaneInstrumentsConnected = this.store.selectSignal(
    planeInstrumentsFeature.selectConnected,
  );
  readonly isBleLoading = this.bleService.isLoading;

  setShowOnlyOnActiveGps(showOnlyOnActiveGps: boolean): void {
    this.store.dispatch(
      instrumentSettingsActions.visibleOnGpsTrackingChanged({
        showOnlyOnActiveGps,
      }),
    );
  }

  setAirplaneInstrumentsUrl(airplaneInstrumentsUrl: string): void {
    this.store.dispatch(
      instrumentSettingsActions.airplaneInstrumentsURLChanged({
        url: airplaneInstrumentsUrl,
      }),
    );
  }

  async getIpFromBle(): Promise<void> {
    const ip = await this.bleService.getIpFromDevice();
    if (ip) {
      this.store.dispatch(
        instrumentSettingsActions.airplaneInstrumentsURLFromBleChanged({
          url: ip,
        }),
      );
    }
  }
}
