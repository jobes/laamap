import { TranslocoService } from '@ngneat/transloco';

import { AltitudePipe } from './altitude.pipe';

describe('AltitudePipe', () => {
  it('create an instance', () => {
    const pipe = new AltitudePipe({
      translate: (input) => input as string,
    } as TranslocoService);
    expect(pipe).toBeTruthy();
  });
});
