import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { SettingsDialogComponent } from './settings-dialog.component';

@Component({
  imports: [MatDialogModule],
})
class WrapperComponent {
  dialog = inject(MatDialog);
  constructor() {
    this.dialog.open(SettingsDialogComponent, {
      maxWidth: '100%',
      closeOnNavigation: false,
    });
  }
}

describe(SettingsDialogComponent.name, () => {
  let initialState: object = {};
  before(() => {
    cy.fixture('initial-store').then((data) => (initialState = data));
  });

  it('renders', () => {
    cy.mount(WrapperComponent, {
      providers: [
        provideMockStore({
          initialState: initialState,
        }),
      ],
    });
  });
});
