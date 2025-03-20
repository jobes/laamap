import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AirspacesDialogComponent } from './airspaces-dialog.component';

@Component({
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: object;
  ngOnInit(): void {
    this.dialog.open(AirspacesDialogComponent, {
      maxWidth: '100%',
      data: this.data,
      closeOnNavigation: false,
    });
  }
}

describe(AirspacesDialogComponent.name, () => {
  let airspacesFixture: object = {};
  before(() => {
    cy.fixture('airspaces').then((data) => (airspacesFixture = data));
  });
  it('creates dialog', () => {
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: airspacesFixture,
      },
    });
    cy.get('#mat-expansion-panel-header-a1').click();
    cy.get(
      '#cdk-accordion-child-a1 > .mat-expansion-panel-body > :nth-child(1) > .value',
    ).contains('LZR60A');
  });
});
