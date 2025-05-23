import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@jsverse/transloco';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { EHeightUnit } from '../../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../../services/open-aip/airspaces.interfaces';

@Component({
  selector: 'laamap-airspaces-dialog',
  templateUrl: './airspaces-dialog.component.html',
  styleUrls: ['./airspaces-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    AltitudePipe,
  ],
})
export class AirspacesDialogComponent {
  eHeightUnit = EHeightUnit;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: (IAirspace & { activityState: 'Activated' | 'Deactivated' })[],
  ) {}
}
