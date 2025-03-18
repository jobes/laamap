import { signal } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

import { AircraftBarInstrumentWidgetSettingsComponent } from './aircraft-bar-instrument-widget-settings.component';

const initialState = {
  oilTemp: {
    show: true,
    position: { x: 0, y: 400 },
    bgColor: '#ffffff',
    textColor: '#000000',
    minShownValue: 30,
    maxShownValue: 150,
    alertLower: 50,
    alertUpper: 130,
    cautionLower: 90,
    cautionUpper: 110,
  },
};

describe(AircraftBarInstrumentWidgetSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(AircraftBarInstrumentWidgetSettingsComponent, {
      componentProperties: {
        type: signal('oilTemp') as any,
      },
      providers: [
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-a0').click();
    cy.get('#mat-input-a0').should('have.value', '#000000');
    cy.get('#mat-input-a1').should('have.value', '#ffffff');
    cy.get('#mat-input-a2').should('have.value', '30');
    cy.get('#mat-input-a3').should('have.value', '50');
    cy.get('#mat-input-a4').should('have.value', '90');
    cy.get('#mat-input-a5').should('have.value', '110');
    cy.get('#mat-input-a6').should('have.value', '130');
    cy.get('#mat-input-a7').should('have.value', '150');
    cy.get('#mat-mdc-slide-toggle-a0-button').should(
      'have.attr',
      'aria-checked',
      'true',
    );
  });
});
