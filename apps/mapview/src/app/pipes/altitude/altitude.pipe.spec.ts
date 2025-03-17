import { TranslocoService } from '@ngneat/transloco';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../../services/open-aip/airport.interfaces';
import { AltitudePipe } from './altitude.pipe';

describe('AltitudePipe', () => {
  let pipe: AltitudePipe;
  beforeEach(() => {
    pipe = new AltitudePipe({
      translate: (input) => input as string,
    } as TranslocoService);
  });
  it('create an instance', () => {
    pipe;
    expect(pipe).toBeTruthy();
  });

  it('convert unit from meters to meters, no units', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 5,
          unit: EHeightUnit.meter,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.meter,
        'value',
      ),
    ).toBe('5');
  });

  it('convert unit from meters to meters, with units', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 5,
          unit: EHeightUnit.meter,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.meter,
        'valueAndUnit',
      ),
    ).toBe('5shared.altitude.heighUnit.0 shared.altitude.referenceDatum.1');
  });

  it('convert unit from FL to FL, with units', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 5,
          unit: EHeightUnit.flightLevel,
          referenceDatum: EReferenceDatum.std,
        },
        EHeightUnit.flightLevel,
        'valueAndUnit',
      ),
    ).toBe('shared.altitude.referenceDatum.2 5');
  });

  it('convert feet to FL', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 500,
          unit: EHeightUnit.feet,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.flightLevel,
        'value',
      ),
    ).toBe('5');
  });

  it('convert FL to feet', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 5,
          unit: EHeightUnit.flightLevel,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.feet,
        'value',
      ),
    ).toBe('500');
  });

  it('convert meters to feet', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 100,
          unit: EHeightUnit.meter,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.feet,
        'value',
      ),
    ).toBe('328');
  });

  it('convert feet to meters', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 150,
          unit: EHeightUnit.feet,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.meter,
        'value',
      ),
    ).toBe('46');
  });

  it('convert meters to FL', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 100,
          unit: EHeightUnit.meter,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.flightLevel,
        'value',
      ),
    ).toBe('3');
  });

  it('convert FL to meters', () => {
    pipe;
    expect(
      pipe.transform(
        {
          value: 150,
          unit: EHeightUnit.flightLevel,
          referenceDatum: EReferenceDatum.msl,
        },
        EHeightUnit.meter,
        'value',
      ),
    ).toBe('4572');
  });
});
