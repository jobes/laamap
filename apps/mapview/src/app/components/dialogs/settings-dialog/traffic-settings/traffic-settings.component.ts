import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { trafficSettingsActions } from '../../../../store/actions/settings.actions';
import { trafficFeature } from '../../../../store/features/settings/traffic.feature';

@Component({
  selector: 'laamap-traffic-settings',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './traffic-settings.component.html',
  styleUrls: ['./traffic-settings.component.scss'],
})
export class TrafficSettingsComponent {
  private readonly store = inject(Store);
  enabled = this.store.selectSignal(trafficFeature.selectEnabled);
  isRego = this.store.selectSignal(trafficFeature.selectIsRego);
  regoOrLabel = this.store.selectSignal(trafficFeature.selectRegoOrLabel);
  aircraftType = this.store.selectSignal(trafficFeature.selectAircraftType);

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
}
