import { TranslocoService } from '@ngneat/transloco';

import { DimensionPipe } from './dimension.pipe';

describe('DimensionPipe', () => {
  it('create an instance', () => {
    const pipe = new DimensionPipe({
      translate: (input) => input as string,
    } as TranslocoService);
    expect(pipe).toBeTruthy();
  });
});
