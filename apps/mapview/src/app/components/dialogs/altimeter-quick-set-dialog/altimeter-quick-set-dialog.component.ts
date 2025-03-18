import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { altimeterQuickSettingsActions } from '../../../store/actions/settings.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';
import { terrainFeature } from '../../../store/features/settings/terrain.feature';

@Component({
  selector: 'laamap-altimeter-quick-set-dialog',
  templateUrl: './altimeter-quick-set-dialog.component.html',
  styleUrls: ['./altimeter-quick-set-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
  ],
})
export class AltimeterQuickSetDialogComponent {
  private readonly store = inject(Store);
  values = this.store.selectSignal(instrumentsFeature.selectAltimeter);
  terrainEnabled = computed(() => {
    const terrainSettings = this.store.selectSignal(
      terrainFeature['selectSettings.terrainState'],
    )();
    return (
      terrainSettings.enabled && terrainSettings.gndHeightCalculateUsingTerrain
    );
  });
  pressureUsed = computed(
    () =>
      this.store.selectSignal(planeInstrumentsFeature.selectAirPressure)() !==
      undefined,
  );
  isGrounded = computed(
    () => !this.store.selectSignal(mapFeature.selectMinSpeedHit)(),
  );

  resetGnd(): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.automaticGNDAltitudeRequested(),
    );
  }

  setGpsAltitudeError(gpsAltitudeError: number): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.gpsAltitudeErrorChanged({
        gpsAltitudeError,
      }),
    );
  }

  automaticGpsAltitudeError(): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.automaticGpsAltitudeErrorRequested(),
    );
  }

  setGndAltitude(gndAltitude: number): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.manualGNDAltitudeChanged({ gndAltitude }),
    );
  }

  automaticQnh(): void {
    this.store.dispatch(altimeterQuickSettingsActions.automaticQnhRequested());
  }

  setQnh(qnh: number): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.manualQnhChanged({ qnh }),
    );
  }

  automaticQfe(): void {
    this.store.dispatch(altimeterQuickSettingsActions.automaticQfeRequested());
  }

  setQfe(qfe: number): void {
    this.store.dispatch(
      altimeterQuickSettingsActions.manualQfeChanged({ qfe }),
    );
  }
}
