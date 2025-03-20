import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { NotamsDialogComponent } from './notams-dialog.component';

@Component({
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: object;

  ngOnInit(): void {
    this.dialog.open(NotamsDialogComponent, {
      maxWidth: '100%',
      data: this.data,
      closeOnNavigation: false,
    });
  }
}

describe(NotamsDialogComponent.name, () => {
  let notamsFixture: object = {};
  before(() => {
    cy.fixture('example-notams').then((data) => (notamsFixture = data));
  });
  it('creates dialog', () => {
    cy.mount(WrapperComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.notam': { hiddenList: [] } },
        }),
      ],
      componentProperties: {
        data: notamsFixture,
      },
    });
    cy.get('.mat-expansion-panel-header-title').contains('A0867/23');
  });
});
