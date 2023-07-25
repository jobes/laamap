import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

import { mapEffectsActions } from '../../../store/actions/effects.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';
import { TrackingWidgetComponent } from './tracking-widget.component';

describe(TrackingWidgetComponent.name, () => {
  const detectChanges = () => {
    cy.get('.cdk-drag .value').click();
    cy.get('[ng-reflect-dialog-result="false"]').click();
  };
  it('renders', () => {
    cy.clock();
    const actions$ = new Subject();
    cy.mount(TrackingWidgetComponent, {
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapFeature.selectShowInstruments, value: true },
            {
              selector: instrumentsFeature.selectTracking,
              value: {
                position: {
                  x: 30,
                  y: 50,
                },
                activeBg: '#001122',
                inactiveBg: '#444444',
                activeText: '#ffffff',
                inactiveText: '#dddddd',
              },
            },
          ],
        }),
        { provide: Actions, useValue: actions$.asObservable() },
        provideNoopAnimations(),
      ],
    });

    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:00');
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:00');
    cy.tick(0).then(() =>
      actions$.next(mapEffectsActions.trackSavingStarted())
    );
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:00');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:01');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:02');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:03');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(0).then(() => actions$.next(mapEffectsActions.trackSavingEnded()));
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.tick(0).then(() =>
      actions$.next(mapEffectsActions.trackSavingStarted())
    );
    detectChanges();
    cy.tick(10);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:00');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:01');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:02');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:03');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(0).then(() => actions$.next(mapEffectsActions.trackSavingEnded()));
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.tick(1000);
    detectChanges();
    cy.get('.cdk-drag .value').contains('0:00:04');
    detectChanges();
    cy.clock().invoke('restore');
    detectChanges();
  });
});
