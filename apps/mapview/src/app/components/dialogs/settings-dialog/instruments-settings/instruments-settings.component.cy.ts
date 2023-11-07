import { provideMockStore } from '@ngrx/store/testing';

import { InstrumentsSettingsComponent } from './instruments-settings.component';

const initialState = {
  showOnlyOnActiveGps: true,
  speedMeter: {
    position: { x: 0, y: 0 },
    colorsBySpeed: [
      {
        minSpeed: 0,
        bgColor: '#d6d6d6',
        textColor: '#262626',
      },
      {
        minSpeed: 50,
        bgColor: '#e60000',
        textColor: '#feec7c',
      },
      {
        minSpeed: 80,
        bgColor: '#ffffff',
        textColor: '#020203',
      },
      {
        minSpeed: 110,
        bgColor: '#dff532',
        textColor: '#020203',
      },
    ],
  },
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
  altimeter: {
    position: { x: 0, y: 60 },
    gndAltitude: 0,
    method: 'manual' as 'manual' | 'terrain',
    bgColor: '#ffffff',
    textColor: '#000000',
    show: ['altitudeM', 'gndM'] as (
      | 'altitudeM'
      | 'gndM'
      | 'altitudeFt'
      | 'gndFt'
    )[],
  },
  tracking: {
    position: { x: 0, y: 300 },
    activeBg: '#ffffff',
    inactiveBg: '#d3d3d3',
    activeText: '#000000',
    inactiveText: '#000000',
  },
};

describe(InstrumentsSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(InstrumentsSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-0').click();
    cy.get('#mat-mdc-slide-toggle-1-button').should(
      'have.attr',
      'aria-checked',
      'true',
    );
  });
});
