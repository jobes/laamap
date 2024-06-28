import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { InterestPointsService } from '../../../services/interest-points/interest-points.service';
import { CreateInterestPointDialogComponent } from './create-interest-point-dialog.component';

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponentAddPoint {
  dialog = inject(MatDialog);
  constructor() {
    this.dialog.open(CreateInterestPointDialogComponent, {
      width: '100%',
      closeOnNavigation: false,
      data: { mode: 'create', point: { lng: 5, lat: 7 } },
    }).componentInstance;
  }
}

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponentEditPoint {
  dialog = inject(MatDialog);
  constructor() {
    this.dialog.open(CreateInterestPointDialogComponent, {
      width: '100%',
      closeOnNavigation: false,
      data: {
        mode: 'edit',
        point: { x: 5, y: 7 },
        value: {
          properties: {
            id: '7887',
            name: 'initName',
            icon: 'poi8',
            description: 'initDesc',
          },
        },
      },
    }).componentInstance;
  }
}

describe(CreateInterestPointDialogComponent.name, () => {
  it('add new point', () => {
    cy.viewport(1000, 1000);
    cy.mount(WrapperComponentAddPoint, {
      providers: [
        {
          provide: InterestPointsService,
          useValue: {
            addPoint: cy.spy().as('addPointSpy'),
            imageList: imageList,
            getSrcFromIconName: (iconName: string) =>
              imageList.find((img) => img.name === iconName)?.src,
          },
        },
        provideMockStore({}),
      ],
    });

    cy.get('#mat-input-0').click().type('test');
    cy.get('.mat-mdc-select-placeholder').click();
    cy.get('#mat-option-2').click();
    cy.get('p').click().type('nice text');
    cy.get('.mat-mdc-dialog-actions > button:nth-of-type(1)').click();
    cy.get('@addPointSpy').should('have.been.calledWith', {
      name: 'test',
      icon: 'poi3',
      description: '<p>nice text</p>',
      point: [5, 7],
    });
  });
});

describe(CreateInterestPointDialogComponent.name, () => {
  it('edit point', () => {
    cy.mount(WrapperComponentEditPoint, {
      providers: [
        {
          provide: InterestPointsService,
          useValue: {
            editPoint: cy.spy().as('editPointSpy'),
            imageList: imageList,
            getSrcFromIconName: (iconName: string) =>
              imageList.find((img) => img.name === iconName)?.src,
          },
        },
        provideMockStore({}),
      ],
    });

    cy.get('[data-cy="edit"]').click();
    cy.get('#mat-input-1').click().type('test');
    cy.get('#mat-select-value-3').click();
    cy.get('#mat-option-28').click();
    cy.get('p').click().type('. Nice text');
    cy.get('[data-cy="save"]').click();
    cy.get('@editPointSpy').should('have.been.calledWith', {
      name: 'initNametest',
      icon: 'poi3',
      description: '<p>initDesc. Nice text</p>',
      id: '7887',
    });
  });

  it('delete point', () => {
    cy.mount(WrapperComponentEditPoint, {
      providers: [
        {
          provide: InterestPointsService,
          useValue: {
            deletePoint: cy.spy().as('deletePointSpy'),
            imageList: imageList,
            getSrcFromIconName: (iconName: string) =>
              imageList.find((img) => img.name === iconName)?.src,
          },
        },
        provideMockStore({}),
      ],
    });

    cy.get('[data-cy="delete"]').click();
    cy.get('@deletePointSpy').should('have.been.calledWith', '7887');
  });
});

const imageList = Array(26)
  .fill({})
  .map((_, index) => ({
    name: `poi${index + 1}`,
    src: `assets/poi/poi${index + 1}.png`,
  }));
