import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../../services/open-aip/airspaces.interfaces';

@Component({
  selector: 'laamap-airspaces-dialog',
  templateUrl: './airspaces-dialog.component.html',
  styleUrls: ['./airspaces-dialog.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    NgFor,
    NgIf,
    MatButtonModule,
    AltitudePipe,
  ],
})
export class AirspacesDialogComponent {
  eHeightUnit = EHeightUnit;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IAirspace[]) {}

  trackByAirSpace(index: number, value: IAirspace) {
    return value.name;
  }
}
