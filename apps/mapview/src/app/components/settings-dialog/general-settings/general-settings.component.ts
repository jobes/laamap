import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettings } from '../../../store/settings/general/general.actions';
import { selectScreenWakeLockEnabled } from '../../../store/settings/general/general.feature';

@Component({
  selector: 'laamap-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent {
  screenWakeLockEnabled$ = this.store.select(selectScreenWakeLockEnabled);
  screenWakeLockSupported = ScreenWakeLockService.supported;

  constructor(private readonly store: Store) {}

  screenWakeLockEnabledChange(enabled: boolean) {
    this.store.dispatch(
      generalSettings.screenWakeLockEnableChanged({ enabled })
    );
  }
}
