import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../../services/open-aip/airport.interfaces';

@Pipe({
  name: 'altitude',
  standalone: true,
})
export class AltitudePipe implements PipeTransform {
  constructor(private transloco: TranslocoService) {}
  transform(
    value: {
      value: number;
      unit: EHeightUnit;
      referenceDatum: EReferenceDatum;
    },
    outputUnit?: EHeightUnit,
    output: 'value' | 'valueAndUnit' = 'valueAndUnit'
  ): string {
    const convertedValue = Math.round(
      this.convert(value.value, value.unit, outputUnit)
    );
    if (output === 'value') {
      return `${convertedValue}`;
    }
    if ((outputUnit ?? value.unit) === EHeightUnit.flightLevel) {
      return `${this.transloco.translate(
        `shared.altitude.referenceDatum.${value.referenceDatum}`
      )} ${convertedValue}`;
    }
    return `${convertedValue}${this.transloco.translate(
      `shared.altitude.heighUnit.${outputUnit ?? value.unit}`
    )} ${this.transloco.translate(
      `shared.altitude.referenceDatum.${value.referenceDatum}`
    )}`;
  }

  // eslint-disable-next-line max-lines-per-function, max-statements, complexity
  private convert(
    value: number,
    unit: EHeightUnit,
    resultUnit?: EHeightUnit
  ): number {
    if (
      resultUnit === null ||
      resultUnit === undefined ||
      unit === resultUnit
    ) {
      return value;
    }
    if (unit === EHeightUnit.feet && resultUnit === EHeightUnit.meter) {
      return value * 0.3048;
    }
    if (unit === EHeightUnit.meter && resultUnit === EHeightUnit.feet) {
      return value / 0.3048;
    }
    if (unit === EHeightUnit.feet && resultUnit === EHeightUnit.flightLevel) {
      return value / 100;
    }
    if (unit === EHeightUnit.flightLevel && resultUnit === EHeightUnit.feet) {
      return value * 100;
    }
    if (unit === EHeightUnit.meter && resultUnit === EHeightUnit.flightLevel) {
      return value / 30.48;
    }
    if (unit === EHeightUnit.flightLevel && resultUnit === EHeightUnit.meter) {
      return value * 30.48;
    }
    return 0;
  }
}
