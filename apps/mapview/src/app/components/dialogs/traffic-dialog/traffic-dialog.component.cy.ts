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
    timestamp: Date.now(),
    lat: 48.1486,
    lng: 17.1077,
    alt: 1500,
    speed: 120,
    course: 90,
    vspeed: 5,
    callsign: 'TEST123',
    label: 'Test Aircraft',
    rego: 'OK-TEST',
    objectType: 'plane',
    state: 'flying',
    model: 'Cessna 172',
    color: '#FF0000',
    onGround: 'false',
    pureTrackKey: 'test-key',
    trackerId: 'tracker-123',
    pilotName: 'John Doe',
    groundLevel: '200m',
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

    // Check that structured data is displayed
    cy.get('.traffic-info').should('exist');
    cy.get('.info-row').should('have.length.greaterThan', 5);

    // Check close button works
    cy.get('button').contains('Close').click();
  });

  it('shows traffic information properly formatted', () => {
    cy.mount(WrapperComponent, {
      componentProperties: {
        data: trafficFixture,
      },
    });

    // Verify structured information display
    cy.get('.info-row').should('contain', 'Callsign');
    cy.get('.info-row').should('contain', 'TEST123');
    cy.get('.info-row').should('contain', 'Registration');
    cy.get('.info-row').should('contain', 'OK-TEST');
  });
});
