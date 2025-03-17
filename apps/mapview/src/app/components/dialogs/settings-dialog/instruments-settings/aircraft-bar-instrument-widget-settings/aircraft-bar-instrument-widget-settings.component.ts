import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AircraftBarInstrumentWidgetSettingsActions } from '../../../../../store/actions/settings.actions';
import { PlaneInstrumentsBarKeys } from '../../../../../store/features/plane-instruments.initial-state';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-aircraft-bar-instrument-widget-settings',
  templateUrl: './aircraft-bar-instrument-widget-settings.component.html',
  styleUrls: ['./aircraft-bar-instrument-widget-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
})
export class AircraftBarInstrumentWidgetSettingsComponent {
  private readonly store = inject(Store);
  readonly type = input.required<PlaneInstrumentsBarKeys>();
  readonly settings = computed(
    () =>
      this.store.selectSignal(
        instrumentsFeature['selectSettings.instrumentsState'],
      )()[this.type() as 'oilPressure'],
  );

  setShow(show: boolean): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.show({
        show,
        instrumentType: this.type(),
      }),
    );
  }

  setTextColor(textColor: string): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.textColorChanged({
        textColor,
        instrumentType: this.type(),
      }),
    );
  }

  setBgColor(bgColor: string): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.bgColorChanged({
        bgColor,
        instrumentType: this.type(),
      }),
    );
  }

  setLowerAlertValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.lowerAlertValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }

  setUpperAlertValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.upperAlertValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }

  setLowerCautionValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.lowerCautionValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }

  setUpperCautionValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.upperCautionValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }

  setMinShownValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.minShownValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }

  setMaxShownValue(value: number): void {
    this.store.dispatch(
      AircraftBarInstrumentWidgetSettingsActions.maxShownValueChanged({
        value,
        instrumentType: this.type(),
      }),
    );
  }
}
