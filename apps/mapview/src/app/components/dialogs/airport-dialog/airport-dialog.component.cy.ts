import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AirportDialogComponent } from './airport-dialog.component';

@Component({
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: object;
  ngOnInit(): void {
    this.dialog.open(AirportDialogComponent, {
      maxWidth: '100%',
      data: this.data,
      closeOnNavigation: false,
    });
  }
}

describe(AirportDialogComponent.name, () => {
  let airportsFixture: object = {};
  before(() => {
    cy.fixture('airports').then((data) => (airportsFixture = data));
  });
  it('creates dialog', () => {
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: airportsFixture,
      },
    });
    cy.get('#mat-expansion-panel-header-a0').click();
    cy.get('#mat-expansion-panel-header-a2').click();
    cy.get(
      '#cdk-accordion-child-a2 > .mat-expansion-panel-body > :nth-child(1) > .value',
    ).contains('1001m');
  });
});
