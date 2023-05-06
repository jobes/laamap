/* eslint-disable cypress/no-unnecessary-waiting */
import * as turf from '@turf/turf';

import { getGeolocationButton, locationForSecond } from '../support/app.po';

describe('mapview', () => {
  let watchPosition: Cypress.Agent<sinon.SinonStub>;
  let airportPosition: { latitude: number; longitude: number };

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad({ navigator }) {
        watchPosition = cy.stub(navigator.geolocation, 'watchPosition');
      },
    });
  });

  before(() => {
    cy.fixture('sliac-airport').then((data) => (airportPosition = data));
  });

  it('should show a test flight', () => {
    const start = [airportPosition.longitude, airportPosition.latitude];
    const goal = turf.destination(
      [airportPosition.longitude, airportPosition.latitude],
      100,
      30
    );
    const secondsAway = turf.greatCircle(start, goal, { npoints: 3600 })
      .geometry.coordinates as number[][];
    let success: (_: unknown) => void;
    watchPosition.callsFake((onSuccess) => {
      onSuccess(locationForSecond(0, secondsAway));
      success = onSuccess;
    });

    getGeolocationButton().click();
    for (let time = 1; time < 100; time++) {
      cy.wait(1000).then(() => success(locationForSecond(time, secondsAway)));
    }
  });
});
