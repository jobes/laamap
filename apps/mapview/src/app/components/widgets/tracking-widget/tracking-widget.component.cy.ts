import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';
import { TrackingWidgetComponent } from './tracking-widget.component';

describe(TrackingWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(TrackingWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
            {
              selector: instrumentsFeature.selectTracking,
              value: {
                position: {
                  x: 30,
                  y: 50,
                },
                activeBg: '#001122',
                inactiveBg: '#444444',
                activeText: '#ffffff',
                inactiveText: '#ffffff',
              },
            },
            { selector: mapFeature.selectShowInstruments, value: true },
          ],
        }),
        { provide: Actions, useValue: of() },
      ],
      componentProperties: {
        currentFlyTime$: of({
          seconds: 1234,
          active: true,
        }),
      },
    });
  });
});
