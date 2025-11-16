import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ESpeedUnit } from '../../services/open-aip/airport.interfaces';
import { SpeedPipe } from './speed.pipe';

describe('SpeedPipe', () => {
  let pipe: SpeedPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [SpeedPipe],
    }).compileComponents();
    pipe = TestBed.inject(SpeedPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return value only when output is "value"', () => {
      const input = { value: 100, unit: ESpeedUnit.kph };
      const result = pipe.transform(input, undefined, 'value');
      expect(result).toBe('100');
    });

    it('should return value with unit when output is "valueAndUnit" (default)', () => {
      const input = { value: 100, unit: ESpeedUnit.kph };
      const result = pipe.transform(input);
      expect(result).toBe('100en.shared.speed.kph');
    });

    it('should return value with unit when output is explicitly "valueAndUnit"', () => {
      const input = { value: 50, unit: ESpeedUnit.mps };
      const result = pipe.transform(input, undefined, 'valueAndUnit');
      expect(result).toBe('50en.shared.speed.mps');
    });

    it('should convert kph to mps and return value only', () => {
      const input = { value: 36, unit: ESpeedUnit.kph };
      const result = pipe.transform(input, ESpeedUnit.mps, 'value');
      expect(result).toBe('10');
    });

    it('should convert kph to mps and return value with unit', () => {
      const input = { value: 36, unit: ESpeedUnit.kph };
      const result = pipe.transform(input, ESpeedUnit.mps, 'valueAndUnit');
      expect(result).toBe('10en.shared.speed.mps');
    });

    it('should convert mps to kph and return value only', () => {
      const input = { value: 10, unit: ESpeedUnit.mps };
      const result = pipe.transform(input, ESpeedUnit.kph, 'value');
      expect(result).toBe('36');
    });

    it('should convert mps to kph and return value with unit', () => {
      const input = { value: 10, unit: ESpeedUnit.mps };
      const result = pipe.transform(input, ESpeedUnit.kph, 'valueAndUnit');
      expect(result).toBe('36en.shared.speed.kph');
    });

    it('should not convert when input and output units are the same', () => {
      const input = { value: 100, unit: ESpeedUnit.kph };
      const result = pipe.transform(input, ESpeedUnit.kph, 'value');
      expect(result).toBe('100');
    });

    it('should not convert when output unit is not provided', () => {
      const input = { value: 100, unit: ESpeedUnit.mps };
      const result = pipe.transform(input, undefined, 'value');
      expect(result).toBe('100');
    });

    it('should round converted values', () => {
      const input = { value: 100, unit: ESpeedUnit.kph };
      const result = pipe.transform(input, ESpeedUnit.mps, 'value');
      // 100 kph * 0.277778 = 27.7778, rounded to 28
      expect(result).toBe('28');
    });

    it('should handle fractional input values', () => {
      const input = { value: 3.6, unit: ESpeedUnit.mps };
      const result = pipe.transform(input, ESpeedUnit.kph, 'value');
      // 3.6 mps * 3.6 = 12.96, rounded to 13
      expect(result).toBe('13');
    });
  });
});
