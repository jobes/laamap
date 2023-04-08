import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettings } from '../../../store/settings/general/general.actions';
import { generalFeature } from '../../../store/settings/general/general.feature';

@Component({
  selector: 'laamap-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent {
  screenWakeLockEnabled$ = this.store.select(
    generalFeature.selectScreenWakeLockEnabled
  );
  screenWakeLockSupported = ScreenWakeLockService.supported;
  widgetFontSizeRatio$ = this.store.select(
    generalFeature.selectWidgetFontSizeRatio
  );
  mapFontSizeRatio$ = this.store.select(generalFeature.selectMapFontSizeRatio);
  airplaneName$ = this.store.select(generalFeature.selectAirplaneName);

  constructor(private readonly store: Store) {}

  screenWakeLockEnabledChange(enabled: boolean) {
    this.store.dispatch(
      generalSettings.screenWakeLockEnableChanged({ enabled })
    );
  }

  widgetFontSizeRatioChanged(value: number) {
    this.store.dispatch(generalSettings.widgetFontSizeRatioChanged({ value }));
  }

  mapFontSizeRatioChanged(value: number) {
    this.store.dispatch(generalSettings.mapFontSizeRatioChanged({ value }));
  }

  airplaneNameChanged(airplaneName: string) {
    this.store.dispatch(generalSettings.setAirplaneName({ airplaneName }));
  }
}
