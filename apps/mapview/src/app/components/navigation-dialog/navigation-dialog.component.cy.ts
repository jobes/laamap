import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { navigationFeature } from '../../store/features/navigation.feature';
import { NavigationDialogComponent } from './navigation-dialog.component';

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent {
  dialog = inject(MatDialog);
  constructor() {
    this.dialog.open(NavigationDialogComponent, {
      width: '100%',
      closeOnNavigation: false,
    });
  }
}

describe(NavigationDialogComponent.name, () => {
  it('creates dialog', () => {
    cy.mount(WrapperComponent, {
      providers: [
        provideMockStore({
          selectors: [{ selector: navigationFeature.selectRoute, value: [] }],
        }),
      ],
    });
    cy.get('.mat-mdc-list-item-title').contains('Žiadne body v navigácii');
  });
});
