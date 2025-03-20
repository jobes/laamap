import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { EHeightUnit } from '../../services/open-aip/airport.interfaces';
import { DimensionPipe } from './dimension.pipe';

describe('DimensionPipe', () => {
  let pipe: DimensionPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [DimensionPipe],
    }).compileComponents();
    pipe = TestBed.inject(DimensionPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('show dimension', () => {
    expect(pipe.transform({ value: 5, unit: EHeightUnit.meter })).toBe(
      '5en.shared.altitude.heighUnit.0',
    );
  });
});
