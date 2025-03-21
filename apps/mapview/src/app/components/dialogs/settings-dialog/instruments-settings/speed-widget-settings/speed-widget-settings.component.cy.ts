import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SpeedWidgetSettingsComponent } from './speed-widget-settings.component';

const initialState = {
  speedMeter: {
    position: { x: 0, y: 0 },
    colorsBySpeed: [
      {
        minSpeed: 0,
        bgColor: '#d6d6d6',
        textColor: '#262626',
      },
      {
        minSpeed: 50,
        bgColor: '#e60000',
        textColor: '#feec7c',
      },
      {
        minSpeed: 80,
        bgColor: '#ffffff',
        textColor: '#020203',
      },
      {
        minSpeed: 110,
        bgColor: '#dff532',
        textColor: '#020203',
      },
    ],
  },
};

describe(SpeedWidgetSettingsComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SpeedWidgetSettingsComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(SpeedWidgetSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.instruments': initialState },
        }),
      ],
    });
    cy.get('#mat-expansion-panel-header-a0').click();
    cy.get('#mat-expansion-panel-header-a2').contains('50 km/h');
    cy.get('#mat-expansion-panel-header-a2').should(
      'have.css',
      'background-color',
      'rgb(230, 0, 0)',
    );
    cy.get('#mat-expansion-panel-header-a2').click();
    cy.get('#mat-input-a3').should('have.value', '50');
  });
});
