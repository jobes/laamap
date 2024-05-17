/* eslint-disable cypress/no-unnecessary-waiting */
import {
  getGeolocationButton,
  getSettingsButton,
  locationForSecond,
  points,
} from '../support/flight-nitra-zobor-cab.po';

describe('mapview', () => {
  let watchPosition: Cypress.Agent<sinon.SinonStub>;

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad({ navigator }) {
        watchPosition = cy.stub(navigator.geolocation, 'watchPosition');
      },
    });
  });

  it('should show a test flight', () => {
    let success: (_: unknown) => void;
    watchPosition.callsFake((onSuccess) => {
      onSuccess(locationForSecond(-1));
      success = onSuccess;
    });

    getSettingsButton().click();
    cy.get('laamap-terrain-settings mat-expansion-panel').click();
    cy.get('[data-cy="terrain-enable"] [mat-internal-form-field]').click();
    cy.get('.mat-mdc-dialog-actions button').click();
    getGeolocationButton().click();
    // wait for everything si loaded
    for (let time = 0; time < 5; time++) {
      cy.wait(1000).then(() => success(locationForSecond(-1)));
    }
    // start flight
    for (let time = 0; time < points.length + 100; time++) {
      cy.wait(1000).then(() => success(locationForSecond(time)));
    }
  });
});
