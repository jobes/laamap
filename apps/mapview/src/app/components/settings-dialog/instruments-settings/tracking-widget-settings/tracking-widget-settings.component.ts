import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { trackingSettingsActions } from '../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../store/features/settings/instruments.feature';

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
      trackingSettingsActions.activeBgColorChanged({ activeBg })
    );
  }

  activeTextColorChanged(activeText: string): void {
    this.store.dispatch(
      trackingSettingsActions.activeTextColorChanged({ activeText })
    );
  }

  inactiveBgColorChanged(inactiveBg: string): void {
    this.store.dispatch(
      trackingSettingsActions.inactiveBgColorChanged({ inactiveBg })
    );
  }

  inactiveTextColorChanged(inactiveText: string): void {
    this.store.dispatch(
      trackingSettingsActions.inactiveTextColorChanged({ inactiveText })
    );
  }
}
