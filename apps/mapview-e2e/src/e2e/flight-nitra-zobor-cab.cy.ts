/* eslint-disable cypress/no-unnecessary-waiting */
import {
  getGeolocationButton,
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

  before(() => {});

  it('should show a test flight', () => {
    let success: (_: unknown) => void;
    watchPosition.callsFake((onSuccess) => {
      onSuccess(locationForSecond(-1));
      success = onSuccess;
    });

    getGeolocationButton().click();
    cy.wait(20000); // wait until map is loaded
    for (let time = 0; time < points.length + 100; time++) {
      cy.wait(1000).then(() => success(locationForSecond(time)));
    }
  });
});
