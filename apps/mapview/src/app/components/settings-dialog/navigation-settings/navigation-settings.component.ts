import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { navigationSettings } from '../../../store/settings/navigation/navigation.actions';
import { navigationFeature } from '../../../store/settings/navigation/navigation.feature';

@Component({
  selector: 'laamap-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
})
export class NavigationSettingsComponent {
  minActivationSpeed$ = this.store.select(
    navigationFeature.selectMinActivationSpeedKpH
  );
  directionLineSegmentSeconds$ = this.store.select(
    navigationFeature.selectDirectionLineSegmentSeconds
  );
  directionLineSegmentCount$ = this.store.select(
    navigationFeature.selectDirectionLineSegmentCount
  );
  gpsTrackingInitialZoom$ = this.store.select(
    navigationFeature.selectGpsTrackingInitZoom
  );
  gpsTrackingInitialPitch$ = this.store.select(
    navigationFeature.selectGpsTrackingInitPitch
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

  setGpsTrackingInitialZoom(zoom: number): void {
    this.store.dispatch(
      navigationSettings.gpsTrackingInitialZoom({
        zoom,
      })
    );
  }

  setGpsTrackingInitialPitch(pitch: number): void {
    this.store.dispatch(
      navigationSettings.gpsTrackingInitialPitch({
        pitch,
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
