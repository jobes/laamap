import { provideMockStore } from '@ngrx/store/testing';

import { airspacesInitValue } from '../../../../store/features/settings/air-spaces-init-value';
import { AirspacesSettingsComponent } from './airspaces-settings.component';

describe(AirspacesSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(AirspacesSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.airSpaces': airspacesInitValue },
        }),
      ],
    });
  });
});
