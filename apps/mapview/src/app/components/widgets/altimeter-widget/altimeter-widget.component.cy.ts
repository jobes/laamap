import { provideMockStore } from '@ngrx/store/testing';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../../../services/open-aip/airport.interfaces';
import { selectHeighSettings } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { AltimeterWidgetComponent } from './altimeter-widget.component';

describe(AltimeterWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(AltimeterWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
            {
              selector: selectHeighSettings,
              value: {
                position: { x: 0, y: 0 },
                bgColor: 'cccccc',
                textColor: '222222',
                hasAltitude: true,
                altitudeMeters: 5,
                altitudeObject: {
                  value: 100,
                  unit: EHeightUnit.meter,
                  referenceDatum: EReferenceDatum.msl,
                },
                gndHeightObject: {
                  value: 45,
                  unit: EHeightUnit.meter,
                  referenceDatum: EReferenceDatum.gnd,
                },
                types: ['altitudeM', 'gndM'],
              },
            },
          ],
        }),
      ],
    });
    cy.get('.cdk-drag > :nth-child(2) > :nth-child(1)').contains('100m n.m.');
    cy.get('.cdk-drag > :nth-child(2) > :nth-child(2)').contains('45m gnd');
  });
});
