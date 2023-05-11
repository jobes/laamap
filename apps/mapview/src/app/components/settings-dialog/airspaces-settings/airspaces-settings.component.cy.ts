import { provideMockStore } from '@ngrx/store/testing';

import { testingSharedMountConfig } from '../../../cypress-helpers';
import { airspacesInitValue } from '../../../store/features/settings/air-spaces-init-value';
import { AirspacesSettingsComponent } from './airspaces-settings.component';

describe(AirspacesSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(AirspacesSettingsComponent, {
      imports: testingSharedMountConfig.imports,
      providers: [
        ...testingSharedMountConfig.providers,
        provideMockStore({
          initialState: { 'settings.airSpaces': airspacesInitValue },
        }),
      ],
    });
  });
});
