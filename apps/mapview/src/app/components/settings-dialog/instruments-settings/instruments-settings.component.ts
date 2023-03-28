import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';

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
      instrumentsSettings.showOnlyOnActiveGps({ showOnlyOnActiveGps })
    );
  }
}
