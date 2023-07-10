import { provideMockStore } from '@ngrx/store/testing';

import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import {
  AllowedNavigationNextPointWidgetRowType,
  navigationSettingsFeature,
} from '../../../store/features/settings/navigation.feature';
import { NavigationNextPointWidgetComponent } from './navigation-next-point-widget.component';

describe(NavigationNextPointWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(NavigationNextPointWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: navigationFeature.selectRunning, value: true },
            {
              selector: mapFeature.selectGeoLocationTrackingActive,
              value: true,
            },
            {
              selector: navigationSettingsFeature.selectWidgetNextPoint,
              value: {
                position: {
                  x: 50,
                  y: 100,
                },
                bgColor: '#112233',
                textColor: '#998877',
                allowedRow: [
                  'NEXT_POINT_DISTANCE',
                  'NEXT_POINT_ARRIVE_TIME',
                  'NEXT_POINT_DURATION_LEFT',
                ] as AllowedNavigationNextPointWidgetRowType,
              },
            },
            {
              selector: selectNavigationStats,
              value: {
                arriveTimeToNextPoint: new Date(2023, 2, 2, 14, 5, 12),
                distanceToNextPoint: 45,
                timeToNextPoint: 1234,
              },
            },
          ],
        }),
      ],
    });
  });
});
