import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { instrumentSettingsActions } from '../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../store/features/settings/instruments.feature';
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
    LetModule,
    MatSlideToggleModule,
    SpeedWidgetSettingsComponent,
    AltitudeWidgetSettingsComponent,
    VarioWidgetSettingsComponent,
    TrackingWidgetSettingsComponent,
  ],
})
export class InstrumentsSettingsComponent {
  showOnlyOnActiveGps$ = this.store.select(
    instrumentsFeature.selectShowOnlyOnActiveGps,
  );

  constructor(private readonly store: Store) {}

  setShowOnlyOnActiveGps(showOnlyOnActiveGps: boolean): void {
    this.store.dispatch(
      instrumentSettingsActions.visibleOnGpsTrackingChanged({
        showOnlyOnActiveGps,
      }),
    );
  }
}
