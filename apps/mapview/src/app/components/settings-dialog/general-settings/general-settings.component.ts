import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { screenWakeLockSettings } from '../../../store/core/core.actions';
import { selectScreenWakeLockEnabled } from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent {
  screenWakeLockEnabled$ = this.store.select(selectScreenWakeLockEnabled);

  constructor(private readonly store: Store) {}

  screenWakeLockEnabledChange(enabled: boolean) {
    this.store.dispatch(screenWakeLockSettings.enableChanged({ enabled }));
  }
}
