import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
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
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe,
  ],
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
