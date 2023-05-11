import { provideMockStore } from '@ngrx/store/testing';

import { testingSharedMountConfig } from '../../../../cypress-helpers';
import { AltitudeWidgetSettingsComponent } from './altitude-widget-settings.component';

const initialState = {
  altimeter: {
    position: { x: 0, y: 60 },
    gndAltitude: 100,
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
};

describe(AltitudeWidgetSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(AltitudeWidgetSettingsComponent, {
      imports: testingSharedMountConfig.imports,
      providers: [
        ...testingSharedMountConfig.providers,
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-0').click();
    cy.get('#mat-input-0').should('have.value', '100');
  });
});
