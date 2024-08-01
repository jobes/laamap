import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VersionNewsDialogComponent } from './version-news-dialog.component';

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: object;

  ngOnInit(): void {
    this.dialog.open(VersionNewsDialogComponent, {
      maxWidth: '100%',
      data: this.data,
      closeOnNavigation: false,
    });
  }
}

describe(VersionNewsDialogComponent.name, () => {
  it('creates filled dialog', () => {
    const markdownData = [
      {
        sk: '# 0.0.1\n- Novinka 1\n- Novinka 2\n- Novinka 3: super vlastnost ktora sa nam bude velmi pacit\n- Oprava1\n- Oprava2 ktora nam ulahci zivot',
      },
      { sk: '# 0.0.01-pre\n- content1' },
      { sk: '# 0.0.01-alpha\n- content of the nice change' },
    ];
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: markdownData,
      },
    });
    cy.get('.mat-mdc-dialog-title').contains('Novinky a zmeny');
    cy.get('.mat-mdc-dialog-content').contains(
      markdownData
        .map((x) => x.sk)
        .reverse()
        .join(' ')
        .replace(/- /g, '')
        .replace(/# /g, '')
        .replace(/\n/g, ' ')
        .trim(),
    );
  });

  it('creates empty dialog', () => {
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: [],
      },
    });
    cy.get('.mat-mdc-dialog-title').contains('Novinky a zmeny');
    cy.get('.mat-mdc-dialog-content').contains('Žiadne novinky');
  });

  it('creates current data dialog', () => {
    cy.fixture('../../ngsw-config').then((data) => {
      cy.mount(WrapperComponent, {
        componentProperties: {
          data: Object.values(data.appData.news),
        },
      });
    });
  });
});
