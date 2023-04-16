import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/map/map.feature';
import { navigationFeature } from '../../../store/navigation/navigation.feature';
import { navigationSettings } from '../../../store/settings/navigation/navigation.actions';
import { navigationSettingsFeature } from '../../../store/settings/navigation/navigation.feature';

@Component({
  selector: 'laamap-navigation-widget',
  templateUrl: './navigation-widget.component.html',
  styleUrls: ['./navigation-widget.component.scss'],
})
export class NavigationWidgetComponent {
  private readonly store = inject(Store);
  running$ = this.store.select(navigationFeature.selectRunning);
  activeGps$ = this.store.select(mapFeature.selectGeoLocationTrackingActive);
  navigationSettings$ = this.store.select(
    navigationSettingsFeature.selectWidget
  );
  navStats$ = this.store.select(selectNavigationStats);

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      navigationSettings.widgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
