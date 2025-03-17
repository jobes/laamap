import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { mapFeature } from '../../../store/features/map.feature';
import { VariometerWidgetComponent } from './variometer-widget.component';

describe(VariometerWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(VariometerWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
          ],
        }),
        {
          provide: WidgetSafePositionService,
          useValue: { safePosition$: () => of({ x: 30, y: 50 }) },
        },
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
