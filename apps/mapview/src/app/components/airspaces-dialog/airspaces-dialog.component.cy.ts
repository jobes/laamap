import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { testingSharedMountConfig } from '../../cypress-helpers';
import { AirspacesDialogComponent } from './airspaces-dialog.component';

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: object;
  ngOnInit(): void {
    this.dialog.open(AirspacesDialogComponent, {
      width: '100%',
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
      imports: testingSharedMountConfig.imports,
      providers: testingSharedMountConfig.providers,
      componentProperties: {
        data: airspacesFixture,
      },
    });
    cy.get('#mat-expansion-panel-header-1').click();
    cy.get(
      '#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .value'
    ).contains('LZR60A');
  });
});
