import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { navigationSettingsActions } from '../../../store/actions/settings.actions';
import {
  AllowedNavigationWidgetRowType,
  navigationSettingsFeature,
} from '../../../store/features/settings/navigation.feature';

@Component({
  selector: 'laamap-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
})
export class NavigationSettingsComponent {
  minActivationSpeed$ = this.store.select(
    navigationSettingsFeature.selectMinActivationSpeedKpH
  );
  directionLineSegmentSeconds$ = this.store.select(
    navigationSettingsFeature.selectDirectionLineSegmentSeconds
  );
  directionLineSegmentCount$ = this.store.select(
    navigationSettingsFeature.selectDirectionLineSegmentCount
  );
  gpsTrackingInitialZoom$ = this.store.select(
    navigationSettingsFeature.selectGpsTrackingInitZoom
  );
  gpsTrackingInitialPitch$ = this.store.select(
    navigationSettingsFeature.selectGpsTrackingInitPitch
  );

  widget$ = this.store.select(navigationSettingsFeature.selectWidget);

  constructor(private readonly store: Store) {}

  setMinActivationSpeed(minActivationSpeedKpH: number): void {
    this.store.dispatch(
      navigationSettingsActions.minimumActivationSpeedChanged({
        minActivationSpeedKpH,
      })
    );
  }

  setDirectionLineSegmentSeconds(seconds: number): void {
    this.store.dispatch(
      navigationSettingsActions.directionLineSegmentSecondsChanged({
        seconds,
      })
    );
  }

  setGpsTrackingInitialZoom(zoom: number): void {
    this.store.dispatch(
      navigationSettingsActions.gpsTrackingInitialZoomChanged({
        zoom,
      })
    );
  }

  setGpsTrackingInitialPitch(pitch: number): void {
    this.store.dispatch(
      navigationSettingsActions.gpsTrackingInitialPitchChanged({
        pitch,
      })
    );
  }

  setDirectionLineSegmentCount(count: number): void {
    this.store.dispatch(
      navigationSettingsActions.directionLineSegmentCountChanged({
        count,
      })
    );
  }

  widgetBgColorChanged(color: string): void {
    this.store.dispatch(
      navigationSettingsActions.widgetBgColorChanged({
        color,
      })
    );
  }

  widgetTextColorChanged(color: string): void {
    this.store.dispatch(
      navigationSettingsActions.widgetTextColorChanged({
        color,
      })
    );
  }

  widgetAllowedRowsChanged(list: AllowedNavigationWidgetRowType): void {
    this.store.dispatch(
      navigationSettingsActions.widgetAllowedRowsChanged({
        list,
      })
    );
  }
}
