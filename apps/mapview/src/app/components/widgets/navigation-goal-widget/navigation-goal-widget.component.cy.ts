import { provideMockStore } from '@ngrx/store/testing';

import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import {
  AllowedNavigationGoalWidgetRowType,
  navigationSettingsFeature,
} from '../../../store/features/settings/navigation.feature';
import { NavigationGoalWidgetComponent } from './navigation-goal-widget.component';

describe(NavigationGoalWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(NavigationGoalWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: navigationFeature.selectRunning, value: true },
            {
              selector: mapFeature.selectGeoLocationTrackingActive,
              value: true,
            },
            {
              selector: navigationSettingsFeature.selectWidgetGoal,
              value: {
                position: {
                  x: 50,
                  y: 100,
                },
                bgColor: '#112233',
                textColor: '#998877',
                allowedRow: [
                  'GOAL_DISTANCE',
                  'GOAL_ARRIVE_TIME',
                  'GOAL_DURATION_LEFT',
                ] as AllowedNavigationGoalWidgetRowType,
              },
            },
            {
              selector: selectNavigationStats,
              value: {
                arriveTimeToGoal: new Date(2023, 2, 2, 14, 5, 12),
                distanceToGoal: 45,
                timeToGoal: 1234,
              },
            },
          ],
        }),
      ],
    });

    cy.get('[data-cy="goalDistance"]').contains(/^45km$/g);
    cy.get('[data-cy="goalTimeLeft"]').contains(/^ 0:20 $/g);
    cy.get('[data-cy="goalTimeArrive"]').contains(/^ 14:05 $/g);
  });
});
