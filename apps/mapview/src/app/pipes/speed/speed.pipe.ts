import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ESpeedUnit } from '../../services/open-aip/airport.interfaces';

@Pipe({
  name: 'Speed',
})
export class SpeedPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(
    value: {
      value: number;
      unit: ESpeedUnit;
    },
    outputUnit?: ESpeedUnit,
    output: 'value' | 'valueAndUnit' = 'valueAndUnit',
  ): string {
    const convertedValue = Math.round(
      this.convert(value.value, value.unit, outputUnit),
    );
    if (output === 'value') {
      return `${convertedValue}`;
    }
    return `${convertedValue}${this.transloco.translate(`shared.speed.${outputUnit ?? value.unit}`)}`;
  }

  private convert(
    value: number,
    unit: ESpeedUnit,
    resultUnit?: ESpeedUnit,
  ): number {
    if (!resultUnit || unit === resultUnit) {
      return value;
    }
    if (unit === ESpeedUnit.kph && resultUnit === ESpeedUnit.mps) {
      return value / 3.6;
    }
    if (unit === ESpeedUnit.mps && resultUnit === ESpeedUnit.kph) {
      return value * 3.6;
    }
    throw new Error(
      `Unsupported speed conversion from ${unit} to ${resultUnit}`,
    );
  }
}
