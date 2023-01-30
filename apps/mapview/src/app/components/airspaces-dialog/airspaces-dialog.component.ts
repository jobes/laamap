import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EHeightUnit } from '../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../services/open-aip/airspaces.interfaces';

@Component({
  selector: 'laamap-airspaces-dialog',
  templateUrl: './airspaces-dialog.component.html',
  styleUrls: ['./airspaces-dialog.component.scss'],
})
export class AirspacesDialogComponent {
  eHeightUnit = EHeightUnit;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IAirspace[]) {}
}
