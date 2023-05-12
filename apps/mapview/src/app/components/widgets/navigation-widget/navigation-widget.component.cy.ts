import { provideMockStore } from '@ngrx/store/testing';

import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import {
  AllowedNavigationWidgetRowType,
  navigationSettingsFeature,
} from '../../../store/features/settings/navigation.feature';
import { NavigationWidgetComponent } from './navigation-widget.component';

describe(NavigationWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(NavigationWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: navigationFeature.selectRunning, value: true },
            {
              selector: mapFeature.selectGeoLocationTrackingActive,
              value: true,
            },
            {
              selector: navigationSettingsFeature.selectWidget,
              value: {
                position: {
                  x: 50,
                  y: 100,
                },
                bgColor: '#112233',
                textColor: '#998877',
                allowedRow: [
                  'NEXT_POINT_DISTANCE',
                  'GOAL_DISTANCE',
                  'GOAL_ARRIVE_TIME',
                  'GOAL_DURATION_LEFT',
                  'NEXT_POINT_ARRIVE_TIME',
                  'NEXT_POINT_DURATION_LEFT',
                ] as AllowedNavigationWidgetRowType,
              },
            },
            {
              selector: selectNavigationStats,
              value: {
                arriveTimeToNextPoint: new Date(2023, 2, 2, 14, 5, 12),
                arriveTimeToGoal: new Date(2023, 2, 2, 14, 5, 12),
                distanceToNextPoint: 45,
                distanceToGoal: 45,
                timeToNextPoint: 1234,
                timeToGoal: 1234,
              },
            },
          ],
        }),
      ],
    });
  });
});
