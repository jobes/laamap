import { input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { instrumentsEffectsActions } from '../../../store/actions/effects.actions';
import { AircraftBarInstrumentWidgetComponent } from './aircraft-bar-instrument-widget.component';

const mockState = (oilTemp: number) => ({
  planeInstruments: {
    cpuUsage: 1,
    oilTemp: oilTemp,
  },
  'settings.instruments': {
    oilTemp: {
      show: true,
      position: { x: 100, y: 100 },
      bgColor: '#ffffff',
      textColor: '#000000',
      minShownValue: 30,
      maxShownValue: 150,
      alertLower: 50,
      alertUpper: 130,
      cautionLower: 90,
      cautionUpper: 110,
    },
  },
});

describe(AircraftBarInstrumentWidgetComponent.name, () => {
  it('renders', () => {
    let store: MockStore;
    cy.mount(AircraftBarInstrumentWidgetComponent, {
      componentProperties: {
        type: signal('oilTemp') as any,
      },
      providers: [
        provideMockStore({
          initialState: mockState(80),
        }),
      ],
    }).then((wrapper) => {
      store = wrapper.component['store'] as any;
    });

    // 80
    cy.get('.fixed-value').contains('80');
    cy.get('.pointer').and('have.css', 'left').should('equal', '66.6562px');
    cy.get('.container.alert').should('not.exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(20)));

    // 20
    cy.get('.fixed-value').contains('20');
    cy.get('.pointer').and('have.css', 'left').should('equal', '0px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(0)));

    // 0
    cy.get('.fixed-value').contains('0');
    cy.get('.pointer').and('have.css', 'left').should('equal', '0px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(-10)));

    // -10
    cy.get('.fixed-value').contains('-10');
    cy.get('.pointer').and('have.css', 'left').should('equal', '0px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(20)));

    //20
    cy.get('.fixed-value').contains('20');
    cy.get('.pointer').and('have.css', 'left').should('equal', '0px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(40)));

    //40
    cy.get('.fixed-value').contains('40');
    cy.get('.pointer').and('have.css', 'left').should('equal', '13.3281px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(60)));

    //60
    cy.get('.fixed-value').contains('60');
    cy.get('.pointer').and('have.css', 'left').should('equal', '40px');
    cy.get('.container.alert').should('not.exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(100)));

    //100
    cy.get('.fixed-value').contains('100');
    cy.get('.pointer').and('have.css', 'left').should('equal', '93.3281px');
    cy.get('.container.alert').should('not.exist');
    cy.get('.container.caution')
      .should('not.exist')
      .then(() => store.setState(mockState(120)));

    //120
    cy.get('.fixed-value').contains('120');
    cy.get('.pointer').and('have.css', 'left').should('equal', '120px');
    cy.get('.container.alert').should('not.exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(140)));

    //140
    cy.get('.fixed-value').contains('140');
    cy.get('.pointer').and('have.css', 'left').should('equal', '146.656px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(160)));

    //160
    cy.get('.fixed-value').contains('160');
    cy.get('.pointer').and('have.css', 'left').should('equal', '160px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(180)));

    //180
    cy.get('.fixed-value').contains('180');
    cy.get('.pointer').and('have.css', 'left').should('equal', '160px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution')
      .should('exist')
      .then(() => store.setState(mockState(200)));

    //200
    cy.get('.fixed-value').contains('200');
    cy.get('.pointer').and('have.css', 'left').should('equal', '160px');
    cy.get('.container.alert').should('exist');
    cy.get('.container.caution').should('exist');
  });
});
