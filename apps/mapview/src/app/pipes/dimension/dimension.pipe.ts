import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { EHeightUnit } from '../../services/open-aip/airport.interfaces';

@Pipe({
  name: 'dimension',
})
export class DimensionPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(value: { value: number; unit: EHeightUnit }): unknown {
    return `${value.value}${this.transloco.translate(
      `shared.altitude.heighUnit.${value.unit}`,
    )}`;
  }
}
