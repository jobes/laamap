import { provideMockStore } from '@ngrx/store/testing';

import { selectColorsBySpeed } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { SpeedMeterWidgetComponent } from './speed-meter-widget.component';

describe(SpeedMeterWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(SpeedMeterWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
            {
              selector: selectColorsBySpeed,
              value: {
                textColor: '#00cc00',
                bgColor: '#000044',
                groundSpeed: 100 / 3.6,
                airSpeed: 150 / 3.6,
                position: {
                  x: 30,
                  y: 50,
                },
                selectedSources: ['gps', 'ias'],
                instrumentIasConnected: true,
              },
            },
          ],
        }),
      ],
    });
    cy.get('.value').contains('100 km/h');
    cy.get('.value').contains('150 km/h');
  });
});
