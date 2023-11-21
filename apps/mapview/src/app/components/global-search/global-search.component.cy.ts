import { TestBed } from '@angular/core/testing';
import { GlobalSearchComponent } from './global-search.component';
import { GlobalSearchService } from '../../services/global-search/global-search.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { of } from 'rxjs';

describe(GlobalSearchComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(GlobalSearchComponent, {
      add: {
        imports: [],
        providers: [
          {
            provide: MatBottomSheet,
            useValue: {},
          },
          {
            provide: GlobalSearchService,
            useValue: {
              searchResults$: () =>
                of([
                  {
                    label: 'routes',
                    values: [
                      { name: 'nothing' },
                      { name: 'nowhere' },
                      { name: 'cannot' },
                    ],
                  },
                ]),
            },
          },
        ],
      },
    });
  });

  it('open and close', () => {
    cy.mount(GlobalSearchComponent);
    cy.get('.search-box').should('not.have.class', 'open');
    cy.get('.search-box').click();
    cy.get('.search-box').should('have.class', 'open');
    cy.get('.back-drop').click();
    cy.get('.search-box').should('not.have.class', 'open');
  });

  it('search and move with keyboard, then close with keyboard', () => {
    cy.mount(GlobalSearchComponent);
    cy.get('.search-box').click();
    cy.get('.search-box input').type('no');
    cy.get('mdc-list-item--selected').should('not.exist');
    cy.get('.search-box input').type('{downArrow}');
    cy.get('.mdc-list-item--selected').contains('nothing');
    cy.get('.search-box input').type('{downArrow}');
    cy.get('.mdc-list-item--selected').contains('nowhere');
    cy.get('.search-box input').type('{downArrow}');
    cy.get('.mdc-list-item--selected').contains('cannot');
    cy.get('.search-box input').type('{downArrow}');
    cy.get('.mdc-list-item--selected').contains('nothing');
    cy.get('.search-box input').type('{upArrow}');
    cy.get('.mdc-list-item--selected').contains('cannot');
    cy.get('.search-box input').type('{esc}');
    cy.get('mdc-list-item--selected').should('not.exist');
    cy.get('.search-box').should('not.have.class', 'open');
  });
});
