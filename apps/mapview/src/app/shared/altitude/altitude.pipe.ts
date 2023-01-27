import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../../services/open-aip/airport.interfaces';

@Pipe({
  name: 'altitude',
})
export class AltitudePipe implements PipeTransform {
  constructor(private transloco: TranslocoService) {}
  transform(
    value: {
      value: number;
      unit: EHeightUnit;
      referenceDatum: EReferenceDatum;
    },
    params?: EHeightUnit
  ): string {
    const convertedValue = Math.round(
      this.convert(value.value, value.unit, params)
    );
    if ((params ?? value.unit) === EHeightUnit.FLIGHT_LEVEL) {
      return `${this.transloco.translate(
        'shared.altitude.referenceDatum.' + value.referenceDatum
      )} ${convertedValue}`;
    }
    return `${convertedValue}${this.transloco.translate(
      'shared.altitude.heighUnit.' + (params ?? value.unit)
    )} ${this.transloco.translate(
      'shared.altitude.referenceDatum.' + value.referenceDatum
    )}`;
  }

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
    if (unit === EHeightUnit.FEET && resultUnit === EHeightUnit.METERS) {
      return value * 0.3048;
    }
    if (unit === EHeightUnit.METERS && resultUnit === EHeightUnit.FEET) {
      return value / 0.3048;
    }
    if (unit === EHeightUnit.FEET && resultUnit === EHeightUnit.FLIGHT_LEVEL) {
      return value / 100;
    }
    if (unit === EHeightUnit.FLIGHT_LEVEL && resultUnit === EHeightUnit.FEET) {
      return value * 100;
    }
    if (
      unit === EHeightUnit.METERS &&
      resultUnit === EHeightUnit.FLIGHT_LEVEL
    ) {
      return value / 30.48;
    }
    if (
      unit === EHeightUnit.FLIGHT_LEVEL &&
      resultUnit === EHeightUnit.METERS
    ) {
      return value * 30.48;
    }
    return 0;
  }
}
