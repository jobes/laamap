import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

import { TracingService } from '../../../services/tracing/tracing.service';
import { FlyTracingHistoryDialogComponent } from './fly-tracing-history-dialog.component';

const airplaneName = 'OMH-000';
@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent {
  dialog = inject(MatDialog).open(FlyTracingHistoryDialogComponent, {
    width: '100%',
    closeOnNavigation: false,
  });

  constructor(tracingService: TracingService) {
    cy.clock()
      .invoke('setSystemTime', new Date('2023-04-16T13:22:14.288Z'))
      .then(() => {
        tracingService.createFlyTrace(airplaneName, '2023-04-16T13:22:14.288Z');
        tracingService.addTraceItem(1681644134000, {});
        tracingService.addTraceItem(1681644142000, {}); // + 8s
      });
    cy.clock()
      .invoke('setSystemTime', new Date('2023-05-04T19:14:07.577Z'))
      .then(() => {
        tracingService.createFlyTrace(airplaneName, '2023-05-04T19:14:07.577Z');
        tracingService.addTraceItem(1683220447000, {});
        tracingService.addTraceItem(1683220452000, {}); // + 5s
        tracingService.endFlyTrace();
        tracingService.addTraceItem(1683220453000, {});
        tracingService.addTraceItem(1683220455000, {}); // + 0s as after end fly do not save
      });
    cy.clock()
      .invoke('setSystemTime', new Date('2023-05-05T03:22:14.288Z'))
      .then(() => {
        tracingService.createFlyTrace(airplaneName, '2023-05-05T03:22:14.288Z');
        tracingService.addTraceItem(1681644134000, {});
        tracingService.addTraceItem(1681644142000, {}); // + 8s
      });
  }
}
describe(FlyTracingHistoryDialogComponent.name, () => {
  beforeEach(() => {
    cy.clearIndexedDb(`_pouch_${airplaneName}/flyTraces`);
    cy.clearIndexedDb(
      `_pouch_${airplaneName}/flyTrace/2023-05-04T19:14:07.577Z`,
    );
    cy.clearIndexedDb(
      `_pouch_${airplaneName}/flyTrace/2023-04-16T13:22:14.288Z`,
    );
    cy.clearIndexedDb(
      `_pouch_${airplaneName}/flyTrace/2023-05-05T03:22:14.288Z`,
    );
  });
  it('creates dialog', () => {
    cy.clock(new Date('2023-05-05T15:00:00Z'));
    cy.mount(WrapperComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.general': { airplaneName } },
        }),
        provideNoopAnimations(),
      ],
    });

    cy.get(':nth-child(1) > .value').contains('0:00:08');
    cy.get(':nth-child(2) > .value').contains('0:00:13');
    cy.get(':nth-child(3) > .value').contains('0:00:21');
    cy.get(':nth-child(4) > .value').contains('0:00:21');
    cy.get(
      '.mdc-data-table__content > :nth-child(1) > .cdk-column-duration',
    ).contains('0:00:08');
    cy.get(':nth-child(2) > .cdk-column-duration').contains('0:00:05');
    cy.get(':nth-child(3) > .cdk-column-duration').contains('0:00:08');
    cy.clock().invoke('restore');
  });
});
