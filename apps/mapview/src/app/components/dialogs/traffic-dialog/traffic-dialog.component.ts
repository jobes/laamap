import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';

import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { SpeedPipe } from '../../../pipes/speed/speed.pipe';
import { trafficTypes } from '../../../services/map/on-map-traffic/traffic-types';
import {
  EHeightUnit,
  EReferenceDatum,
  ESpeedUnit,
} from '../../../services/open-aip/airport.interfaces';
import { TrafficEntry } from '../../../services/traffic/traffic.service';

@Component({
  selector: 'laamap-traffic-dialog',
  templateUrl: './traffic-dialog.component.html',
  styleUrls: ['./traffic-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslocoLocaleModule,
    AltitudePipe,
    SpeedPipe,
  ],
})
export class TrafficDialogComponent {
  data = inject<TrafficEntry>(MAT_DIALOG_DATA);
  EHeightUnit = EHeightUnit;
  EReferenceDatum = EReferenceDatum;
  ESpeedUnit = ESpeedUnit;
  transloco = inject(TranslocoService);

  trafficType = computed(() => {
    const typeId = parseInt(this.data.objectType || '0');
    const type = trafficTypes.find((t) => t.id === typeId);
    return type;
  });

  // Helper methods
  getValueOrNA(value: string | number | undefined): string {
    return value || value === 0
      ? String(value)
      : this.transloco.translate('trafficDialog.na');
  }
}
