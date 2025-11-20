import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TrafficEntry } from '../../../services/traffic/traffic.service';
import { TrafficDialogComponent } from './traffic-dialog.component';

@Component({
  imports: [MatDialogModule],
})
class WrapperComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() data!: TrafficEntry;
  ngOnInit(): void {
    this.dialog.open(TrafficDialogComponent, {
      maxWidth: '100%',
      data: this.data,
      closeOnNavigation: false,
    });
  }
}

describe(TrafficDialogComponent.name, () => {
  const trafficFixture: TrafficEntry = {
    timestamp: new Date('2024-06-01T15:35:21Z').getTime() / 1000,
    lat: 48.1486,
    lng: 17.1077,
    alt: 1500,
    speed: 120,
    course: 90,
    vspeed: 5,
    callsign: 'TEST123',
    label: 'Test Aircraft',
    rego: 'OK-TEST',
    objectType: '2',
    state: '2',
    model: 'Cessna 172',
    color: '#FF0000',
    onGround: 'false',
    pureTrackKey: 'test-key',
    trackerId: 'tracker-123',
    pilotName: 'John Doe',
    groundLevel: 200,
    username: 'testpilot',
    aircraftId: 'aircraft-123',
    displayAltitude: '1500m',
    displaySpeed: '120 km/h',
  };

  it('creates dialog with traffic data', () => {
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: trafficFixture,
      },
    });

    // Check that dialog title contains callsign
    cy.get('[mat-dialog-title]').should('contain', 'TEST123');

    cy.get('[data-cy="traffic-object-type"]').should(
      'contain',
      'Typ objektu Ťažné lietadlo',
    );
    cy.get('[data-cy="traffic-altitude"]').should(
      'contain',
      'Nadmorská výška1500m n.m. (4921ft n.m.)',
    );
    cy.get('[data-cy="traffic-rego"]').should('contain', 'RegistráciaOK-TEST');
    cy.get('[data-cy="traffic-course"]').should('contain', 'Kurz 90°');
    cy.get('[data-cy="traffic-speed"]').should('contain', 'Rýchlosť432km/h');
    cy.get('[data-cy="traffic-vspeed"]').should(
      'contain',
      'Vertikálna rýchlosť 5m/s',
    );
    cy.get('[data-cy="traffic-label"]').should(
      'contain',
      'Označenie Test Aircraft',
    );
    cy.get('[data-cy="traffic-callsign"]').should(
      'contain',
      'Volací znak TEST123',
    );
    cy.get('[data-cy="traffic-pilot-name"]').should(
      'contain',
      'Meno pilota John Doe',
    );
    cy.get('[data-cy="traffic-model"]').should(
      'contain',
      'Model lietadla Cessna 172',
    );
    cy.get('[data-cy="traffic-ground-level"]').should(
      'contain',
      'Úroveň terénu200m n.m.',
    );
    cy.get('[data-cy="traffic-aircraft-id"]').should(
      'contain',
      'ID lietadla aircraft-123',
    );
    cy.get('[data-cy="traffic-username"]').should(
      'contain',
      'Používateľské menotestpilot',
    );
    cy.get('[data-cy="traffic-on-ground"]').should('contain', 'Na zemiNie');
    cy.get('[data-cy="traffic-pilot-name"]').should(
      'contain',
      'Meno pilota John Doe',
    );
  });
});
