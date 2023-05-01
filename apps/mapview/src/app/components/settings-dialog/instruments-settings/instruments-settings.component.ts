import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { instrumentSettingsActions } from '../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-instruments-settings',
  templateUrl: './instruments-settings.component.html',
  styleUrls: ['./instruments-settings.component.scss'],
})
export class InstrumentsSettingsComponent {
  showOnlyOnActiveGps$ = this.store.select(
    instrumentsFeature.selectShowOnlyOnActiveGps
  );

  constructor(private readonly store: Store) {}

  setShowOnlyOnActiveGps(showOnlyOnActiveGps: boolean): void {
    this.store.dispatch(
      instrumentSettingsActions.visibleOnGpsTrackingChanged({
        showOnlyOnActiveGps,
      })
    );
  }
}
