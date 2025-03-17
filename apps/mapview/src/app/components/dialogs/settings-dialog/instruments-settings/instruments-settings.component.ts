import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { instrumentSettingsActions } from '../../../../store/actions/settings.actions';
import { planeInstrumentsFeature } from '../../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../../store/features/settings/instruments.feature';
import { AircraftBarInstrumentWidgetSettingsComponent } from './aircraft-bar-instrument-widget-settings/aircraft-bar-instrument-widget-settings.component';
import { AltitudeWidgetSettingsComponent } from './altitude-widget-settings/altitude-widget-settings.component';
import { SpeedWidgetSettingsComponent } from './speed-widget-settings/speed-widget-settings.component';
import { TrackingWidgetSettingsComponent } from './tracking-widget-settings/tracking-widget-settings.component';
import { VarioWidgetSettingsComponent } from './vario-widget-settings/vario-widget-settings.component';

@Component({
  selector: 'laamap-instruments-settings',
  templateUrl: './instruments-settings.component.html',
  styleUrls: ['./instruments-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSlideToggleModule,
    SpeedWidgetSettingsComponent,
    AltitudeWidgetSettingsComponent,
    VarioWidgetSettingsComponent,
    TrackingWidgetSettingsComponent,
    AircraftBarInstrumentWidgetSettingsComponent,
  ],
})
export class InstrumentsSettingsComponent {
  showOnlyOnActiveGps = this.store.selectSignal(
    instrumentsFeature.selectShowOnlyOnActiveGps,
  );
  airplaneInstrumentsUrl = this.store.selectSignal(
    instrumentsFeature.selectAirplaneInstrumentsUrl,
  );

  airplaneInstrumentsConnected = this.store.selectSignal(
    planeInstrumentsFeature.selectConnected,
  );

  constructor(private readonly store: Store) {}

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
}
