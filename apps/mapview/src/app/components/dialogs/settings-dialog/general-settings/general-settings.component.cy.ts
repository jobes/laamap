import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

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
            },
          },
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Actions, useValue: new Subject() },
      ],
    });
  });
});
