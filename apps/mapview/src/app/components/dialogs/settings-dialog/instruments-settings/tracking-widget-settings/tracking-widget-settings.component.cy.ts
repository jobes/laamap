import { provideMockStore } from '@ngrx/store/testing';

import { TrackingWidgetSettingsComponent } from './tracking-widget-settings.component';

const initialState = {
  tracking: {
    position: { x: 0, y: 300 },
    activeBg: '#ffffff',
    inactiveBg: '#d3d3d3',
    activeText: '#000000',
    inactiveText: '#000000',
  },
};
describe(TrackingWidgetSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(TrackingWidgetSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-a0').click();
    cy.get('#mat-input-a2').should('have.value', '#d3d3d3');
  });
});
