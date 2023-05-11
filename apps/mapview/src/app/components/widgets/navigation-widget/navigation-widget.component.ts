import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { navigationWidgetActions } from '../../../store/actions/widgets.actions';
import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import { navigationSettingsFeature } from '../../../store/features/settings/navigation.feature';

@Component({
  selector: 'laamap-navigation-widget',
  templateUrl: './navigation-widget.component.html',
  styleUrls: ['./navigation-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetModule,
    NgIf,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
    DigitalTimePipe,
  ],
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
      navigationWidgetActions.positionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
