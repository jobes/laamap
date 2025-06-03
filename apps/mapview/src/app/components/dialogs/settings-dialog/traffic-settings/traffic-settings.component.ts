import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { EHeightUnit } from '../../../../services/open-aip/airport.interfaces';
import { TrafficService } from '../../../../services/traffic/traffic.service';
import { trafficSettingsActions } from '../../../../store/actions/settings.actions';
import { trafficFeature } from '../../../../store/features/settings/traffic.feature';

@Component({
  selector: 'laamap-traffic-settings',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './traffic-settings.component.html',
  styleUrls: ['./traffic-settings.component.scss'],
})
export class TrafficSettingsComponent {
  private readonly store = inject(Store);
  private traffic = inject(TrafficService);

  EHeightUnit = EHeightUnit;
  enabled = this.store.selectSignal(trafficFeature.selectEnabled);
  isRego = this.store.selectSignal(trafficFeature.selectIsRego);
  regoOrLabel = this.store.selectSignal(trafficFeature.selectRegoOrLabel);
  aircraftType = this.store.selectSignal(trafficFeature.selectAircraftType);
  accessKey = this.store.selectSignal(trafficFeature.selectAccessKey);
  loginInProgress = signal(false);
  loginFailed = signal(false);
  pro = signal(true);
  maxAge = this.store.selectSignal(trafficFeature.selectMaxAge);
  maxHeightAboveMe = this.store.selectSignal(
    trafficFeature.selectMaxHeightAboveMe,
  );
  altitudeDisplayUnit = this.store.selectSignal(
    trafficFeature.selectAltitudeDisplayUnit,
  );
  actualizationPeriod = this.store.selectSignal(
    trafficFeature.selectActualizationPeriod,
  );

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  enableTraffic(enabled: boolean): void {
    this.store.dispatch(trafficSettingsActions.enabledChanged({ enabled }));
  }

  setIsRego(isRego: boolean): void {
    this.store.dispatch(trafficSettingsActions.isRegoChanged({ isRego }));
  }

  regoOrLabelChanged(regoOrLabel: string): void {
    if (this.isRego()) {
      regoOrLabel = regoOrLabel.toUpperCase();
    }
    this.store.dispatch(
      trafficSettingsActions.regoOrLabelChanged({ regoOrLabel: regoOrLabel }),
    );
  }

  setAircraftType(aircraftType: number): void {
    this.store.dispatch(
      trafficSettingsActions.aircraftTypeChanged({ aircraftType }),
    );
  }

  login(): void {
    this.loginInProgress.set(true);
    this.loginFailed.set(false);
    this.traffic.login(this.loginForm.getRawValue()).subscribe(
      (answer) => {
        this.pro.set(answer.pro);
        this.loginInProgress.set(false);
        if (answer.pro) {
          this.store.dispatch(
            trafficSettingsActions.puretrackKeySet({
              accessKey: answer.access_token,
            }),
          );
        } else {
          this.traffic.logout(answer.access_token).subscribe();
        }
      },
      () => {
        this.loginInProgress.set(false);
        this.loginFailed.set(true);
      },
    );
  }

  logout(): void {
    this.traffic.logout().subscribe(
      () => {
        this.store.dispatch(trafficSettingsActions.puretrackKeyDeleted());
      },
      () => {
        this.store.dispatch(trafficSettingsActions.puretrackKeyDeleted());
      },
    );
  }

  passwordChanged(): void {
    this.loginFailed.set(false);
  }

  setMaxAge(maxAge: number): void {
    this.store.dispatch(trafficSettingsActions.maxAgeChanged({ maxAge }));
  }

  setMaxHeightAboveMe(maxHeightAboveMe: number): void {
    this.store.dispatch(
      trafficSettingsActions.maxHeightAboveMeChanged({ maxHeightAboveMe }),
    );
  }

  setAltitudeDisplayUnit(altitudeDisplayUnit: EHeightUnit): void {
    this.store.dispatch(
      trafficSettingsActions.altitudeDisplayUnitChanged({
        altitudeDisplayUnit,
      }),
    );
  }

  setActualizationPeriod(actualizationPeriod: number): void {
    this.store.dispatch(
      trafficSettingsActions.actualizationPeriodChanged({
        actualizationPeriod,
      }),
    );
  }
}
