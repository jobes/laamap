import { APP_INITIALIZER, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

import { TracingService } from '../../../services/tracing/tracing.service';
import { FlyTracingHistoryDialogComponent } from './fly-tracing-history-dialog.component';

const airplaneName = 'OMH-000';

const initIndexDb = (tracingService: TracingService) => {
  return () => {
    cy.clock()
      .invoke('setSystemTime', new Date('2023-04-16T13:22:14.288Z'))
      .then(() =>
        tracingService.createFlyTrace(airplaneName, '2023-04-16T13:22:14.288Z'),
      )
      .then(() =>
        tracingService.addTraceItem(
          new Date().getTime(),
          {} as GeolocationCoordinates,
        ),
      );
    cy.clock()
      .then((clock) => clock.tick(8000))
      .then(
        () =>
          tracingService.addTraceItem(
            new Date().getTime() + 8000,
            {} as GeolocationCoordinates,
          ), // + 8s
      );
    cy.clock()
      .invoke('setSystemTime', new Date('2023-05-04T19:14:07.577Z'))
      .then(() =>
        tracingService.createFlyTrace(airplaneName, '2023-05-04T19:14:07.577Z'),
      )
      .then(() =>
        tracingService.addTraceItem(
          new Date().getTime(),
          {} as GeolocationCoordinates,
        ),
      );
    cy.clock()
      .then((clock) => clock.tick(5000))
      .then(() =>
        tracingService.addTraceItem(
          new Date().getTime() + 5000, // +5s
          {} as GeolocationCoordinates,
        ),
      )
      .then(() => tracingService.endFlyTrace());
    cy.clock()
      .then((clock) => clock.tick(6000))
      .then(() =>
        tracingService.addTraceItem(
          new Date().getTime() + 6000,
          {} as GeolocationCoordinates,
        ),
      );
    cy.clock()
      .then((clock) => clock.tick(8000))
      .then(
        () =>
          tracingService.addTraceItem(
            new Date().getTime() + 8000,
            {} as GeolocationCoordinates,
          ), // + 0s as after end fly do not save
      );
    cy.clock()
      .invoke('setSystemTime', new Date('2023-05-05T03:22:14.288Z'))
      .then(() =>
        tracingService.createFlyTrace(airplaneName, '2023-05-05T03:22:14.288Z'),
      )
      .then(() =>
        tracingService.addTraceItem(
          new Date().getTime(),
          {} as GeolocationCoordinates,
        ),
      );
    cy.clock()
      .then((clock) => clock.tick(8000))
      .then(
        () =>
          tracingService.addTraceItem(
            new Date().getTime() + 8000,
            {} as GeolocationCoordinates,
          ), // + 8s
      );
  };
};
@Component({
  template: '<button (click)="start()">click me</button>',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent {
  dialogService = inject(MatDialog);

  start() {
    this.dialogService.open(FlyTracingHistoryDialogComponent, {
      maxWidth: '100%',
      closeOnNavigation: false,
    });
  }
}
describe(FlyTracingHistoryDialogComponent.name, () => {
  beforeEach(() => {
    cy.clearIndexedDb(`stork-navigation`);
  });
  it('creates dialog', () => {
    cy.clock(new Date('2023-05-05T15:00:00Z'));
    cy.mount(WrapperComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.general': { airplaneName } },
        }),
        provideNoopAnimations(),
        { provide: Actions, useValue: new Subject() },
        {
          provide: APP_INITIALIZER,
          useFactory: initIndexDb,
          multi: true,
          deps: [TracingService],
        },
      ],
    });
    cy.get('button').click();
    cy.get(':nth-child(1) > .value').contains('0:00:08');
    cy.get(':nth-child(2) > .value').contains('0:00:13');
    cy.get(':nth-child(3) > .value').contains('0:00:21');
    cy.get(':nth-child(4) > .value').contains('0:00:21');
    cy.get(
      '.mdc-data-table__content > :nth-child(1) > .cdk-column-flightTime',
    ).contains('0:00:08');
    cy.get(':nth-child(2) > .cdk-column-flightTime').contains('0:00:05');
    cy.get(':nth-child(3) > .cdk-column-flightTime').contains('0:00:08');
    cy.clock().invoke('restore');
  });
});
