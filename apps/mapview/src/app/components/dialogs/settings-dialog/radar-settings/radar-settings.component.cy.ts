import { provideMockStore } from '@ngrx/store/testing';

import { RadarSettingsComponent } from './radar-settings.component';

const initialState = {
  enabled: true,
  type: 'radar',
  colorScheme: 1, // https://www.rainviewer.com/api/color-schemes.html
  snow: false,
  smooth: true,
  animationSpeed: 30,
  opacity: 75,
  widget: {
    enabled: false,
    position: {
      x: 0,
      y: 270,
    },
    background: '#ffffff',
    textColorPast: '#707070',
    textColorFuture: '#005706',
  },
};

describe(RadarSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(RadarSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.radar': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-0').click();
    cy.get('#mat-mdc-slide-toggle-1-button').should(
      'have.attr',
      'aria-checked',
      'true',
    );
    cy.get('#mat-mdc-slide-toggle-3-button').should(
      'have.attr',
      'aria-checked',
      'false',
    );
  });
});
