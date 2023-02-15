import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { navigationSettings } from '../../../store/core/core.actions';
import {
  selectNavigationDirectionLineSegmentCount,
  selectNavigationDirectionLineSegmentSeconds,
  selectNavigationMinActivationSpeedKpH,
} from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
})
export class NavigationSettingsComponent {
  minActivationSpeed$ = this.store.select(
    selectNavigationMinActivationSpeedKpH
  );
  directionLineSegmentSeconds$ = this.store.select(
    selectNavigationDirectionLineSegmentSeconds
  );
  directionLineSegmentCount$ = this.store.select(
    selectNavigationDirectionLineSegmentCount
  );

  constructor(private readonly store: Store) {}

  setMinActivationSpeed(minActivationSpeedKpH: number): void {
    this.store.dispatch(
      navigationSettings.minimumActivationSpeedChanged({
        minActivationSpeedKpH,
      })
    );
  }

  setDirectionLineSegmentSeconds(seconds: number): void {
    this.store.dispatch(
      navigationSettings.directionLineSegmentSeconds({
        seconds,
      })
    );
  }

  setDirectionLineSegmentCount(count: number): void {
    this.store.dispatch(
      navigationSettings.directionLineSegmentCount({
        count,
      })
    );
  }
}
