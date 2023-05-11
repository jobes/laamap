import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { testingSharedMountConfig } from '../../../cypress-helpers';
import { mapFeature } from '../../../store/features/map.feature';
import { VariometerWidgetComponent } from './variometer-widget.component';

describe(VariometerWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(VariometerWidgetComponent, {
      imports: testingSharedMountConfig.imports,
      providers: [
        ...testingSharedMountConfig.providers,
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
          ],
        }),
      ],
      componentProperties: {
        colorsByClimbing$: of({
          position: {
            x: 30,
            y: 50,
          },
          bgColor: '#002266',
          textColor: '#ccddee',
          climbingSpeed: -2.9,
        }),
      },
    });
    cy.get('.value').contains('-2,9 m/s');
  });
});
