import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { instrumentsSettings } from '../../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../../store/settings/instruments/instruments.feature';

@Component({
  selector: 'laamap-tracking-widget-settings',
  templateUrl: './tracking-widget-settings.component.html',
  styleUrls: ['./tracking-widget-settings.component.scss'],
})
export class TrackingWidgetSettingsComponent {
  private readonly store = inject(Store);
  settings$ = this.store.select(instrumentsFeature.selectTracking);

  activeBgColorChanged(activeBg: string): void {
    this.store.dispatch(
      instrumentsSettings.trackingActiveBgColorChanged({ activeBg })
    );
  }

  activeTextColorChanged(activeText: string): void {
    this.store.dispatch(
      instrumentsSettings.trackingActiveTextColorChanged({ activeText })
    );
  }

  inactiveBgColorChanged(inactiveBg: string): void {
    this.store.dispatch(
      instrumentsSettings.trackingInactiveBgColorChanged({ inactiveBg })
    );
  }

  inactiveTextColorChanged(inactiveText: string): void {
    this.store.dispatch(
      instrumentsSettings.trackingInactiveTextColorChanged({ inactiveText })
    );
  }
}
