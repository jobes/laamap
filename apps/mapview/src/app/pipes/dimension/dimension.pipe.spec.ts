import { TranslocoService } from '@ngneat/transloco';

import { EHeightUnit } from '../../services/open-aip/airport.interfaces';
import { DimensionPipe } from './dimension.pipe';

describe('DimensionPipe', () => {
  let pipe: DimensionPipe;
  beforeEach(() => {
    pipe = new DimensionPipe({
      translate: (input) => input as string,
    } as TranslocoService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('show dimension', () => {
    expect(pipe.transform({ value: 5, unit: EHeightUnit.meter })).toBe(
      '5shared.altitude.heighUnit.0'
    );
  });
});
