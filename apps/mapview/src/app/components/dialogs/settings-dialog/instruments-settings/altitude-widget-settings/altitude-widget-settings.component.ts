import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { instrumentAltimeterSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-altitude-widget-settings',
  templateUrl: './altitude-widget-settings.component.html',
  styleUrls: ['./altitude-widget-settings.component.scss'],
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class AltitudeWidgetSettingsComponent {
  showTypes = [
    'altitudeM',
    'gndM',
    'altitudeFt',
    'gndFt',
    'pressureAltitudeM',
    'pressureGndM',
    'pressureAltitudeFt',
    'pressureGndFt',
  ];
  settings = this.store.selectSignal(instrumentsFeature.selectAltimeter);

  constructor(private readonly store: Store) {}

  setGndAltitude(gndAltitude: number): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.manualGNDAltitudeChanged({
        gndAltitude,
      }),
    );
  }

  setAltitudeGpsErrorChanged(gpsAltitudeError: number): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.altitudeGpsErrorChanged({
        gpsAltitudeError,
      }),
    );
  }

  setQFE(qfe: number): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.qfeChanged({
        qfe,
      }),
    );
  }

  setQNH(qnh: number): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.qnhChanged({
        qnh,
      }),
    );
  }

  bgColorChanged(bgColor: string): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.bgColorChanged({ bgColor }),
    );
  }

  textColorChanged(textColor: string): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.textColorChanged({ textColor }),
    );
  }

  showTypeChanged(
    show: ('altitudeM' | 'gndM' | 'altitudeFt' | 'gndFt')[],
  ): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.showTypeChanged({ show }),
    );
  }
}
