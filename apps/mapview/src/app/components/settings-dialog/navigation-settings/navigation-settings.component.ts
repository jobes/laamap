import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { navigationSettings } from '../../../store/settings/navigation/navigation.actions';
import {
  AllowedNavigationWidgetRowType,
  navigationSettingsFeature,
} from '../../../store/settings/navigation/navigation.feature';

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

  widgetBgColorChanged(color: string): void {
    this.store.dispatch(
      navigationSettings.widgetBgColorChanged({
        color,
      })
    );
  }

  widgetTextColorChanged(color: string): void {
    this.store.dispatch(
      navigationSettings.widgetTextColorChanged({
        color,
      })
    );
  }

  widgetAllowedRowsChanged(list: AllowedNavigationWidgetRowType): void {
    this.store.dispatch(
      navigationSettings.widgetAllowedRows({
        list,
      })
    );
  }
}
