import { provideMockStore } from '@ngrx/store/testing';

import { NavigationSettingsComponent } from './navigation-settings.component';

const initialState = {
  minActivationSpeedKpH: 30,
  directionLineSegmentSeconds: 60,
  directionLineSegmentCount: 5,
  gpsTrackingInitZoom: 13,
  gpsTrackingInitPitch: 60,
  widget: {
    position: {
      x: 200,
      y: 200,
    },
    bgColor: '#ffffff',
    textColor: '#000000',
    allowedRow: [
      'NEXT_POINT_DISTANCE',
      'NEXT_POINT_DURATION_LEFT',
      'NEXT_POINT_ARRIVE_TIME',
      'GOAL_DISTANCE',
      'GOAL_DURATION_LEFT',
      'GOAL_ARRIVE_TIME',
    ],
  },
};

describe(NavigationSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(NavigationSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.navigation': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-0').click();
    cy.get('#mat-input-0').should('have.value', 30);
  });
});
