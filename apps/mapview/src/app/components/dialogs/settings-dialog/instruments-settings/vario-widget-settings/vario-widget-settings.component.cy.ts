import { provideMockStore } from '@ngrx/store/testing';

import { VarioWidgetSettingsComponent } from './vario-widget-settings.component';

const initialState = {
  varioMeter: {
    position: { x: 0, y: 200 },
    diffTime: 1000,
    colorsByClimbing: [
      {
        minClimbing: -1000,
        bgColor: '#ffffff',
        textColor: '#e51515',
      },
      {
        minClimbing: -3,
        bgColor: '#ffffff',
        textColor: '#000000',
      },
      {
        minClimbing: 3,
        bgColor: '#ff4d4d',
        textColor: '#000000',
      },
    ],
  },
};
describe(VarioWidgetSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(VarioWidgetSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-0').click();
    cy.get('#mat-expansion-panel-header-2').click();
    cy.get('#mat-input-4').should('have.value', -3);
  });
});
