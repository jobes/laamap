import { provideMockStore } from '@ngrx/store/testing';

import { GeneralSettingsComponent } from './general-settings.component';

describe(GeneralSettingsComponent.name, () => {
  it('renders', () => {
    cy.mount(GeneralSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: {
            'settings.general': {
              screenWakeLock: {
                enabled: true,
              },
              widgetFontSizeRatio: 1.5,
              mapFontSizeRatio: 1.5,
              airplaneName: 'OMH-XXX (John Doe)',
            },
          },
        }),
      ],
    });
  });
});
