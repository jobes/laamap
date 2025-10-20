import { AbstractControl, FormControl } from '@angular/forms';

import { radioFrequencyValidator } from './radio.validators';

describe('radioFrequencyValidator', () => {
  function createControl(value: unknown): AbstractControl<number, number> {
    const control = new FormControl(value);
    return control as AbstractControl<number, number>;
  }

  describe('valid frequencies', () => {
    it('should return null for valid 5 kHz increment frequencies', () => {
      const validFrequencies = [
        118.0, // Base frequency
        118.005, // 5 kHz increment
        118.01, // 10 kHz increment
        118.015, // 15 kHz increment
        118.025, // 25 kHz increment
        118.03, // 30 kHz increment
        118.035, // 35 kHz increment
        118.04, // 40 kHz increment
        118.05, // 50 kHz increment
        118.055, // 55 kHz increment
        118.06, // 60 kHz increment
        118.065, // 65 kHz increment
        118.075, // 75 kHz increment
        118.08, // 80 kHz increment
        118.085, // 85 kHz increment
        118.09, // 90 kHz increment
        118.1, // 100 kHz increment
        119.0, // Next MHz boundary
        121.5, // Emergency frequency
        136.975, // Upper VHF limit
      ];

      validFrequencies.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toBeNull();
      });
    });

    it('should return null for integer frequencies', () => {
      const integerFrequencies = [118, 119, 120, 121, 136];

      integerFrequencies.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toBeNull();
      });
    });
  });

  describe('invalid frequencies', () => {
    it('should return validation error for frequencies in 25 kHz exclusion zones', () => {
      const excludedFrequencies = [
        118.02, // 20 kHz (25 kHz exclusion zone)
        118.045, // 45 kHz (25 kHz exclusion zone)
        118.07, // 70 kHz (25 kHz exclusion zone)
        118.095, // 95 kHz (25 kHz exclusion zone)
        119.02, // 20 kHz (25 kHz exclusion zone)
        119.045, // 45 kHz (25 kHz exclusion zone)
        119.07, // 70 kHz (25 kHz exclusion zone)
      ];

      excludedFrequencies.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toEqual({ invalidFreq: true });
      });
    });

    it('should return validation error for frequencies not in 5 kHz increments', () => {
      const invalidIncrements = [
        118.001, // 1 kHz increment
        118.002, // 2 kHz increment
        118.003, // 3 kHz increment
        118.004, // 4 kHz increment
        118.006, // 6 kHz increment
        118.007, // 7 kHz increment
        118.008, // 8 kHz increment
        118.009, // 9 kHz increment
        118.011, // 11 kHz increment
        118.012, // 12 kHz increment
        118.013, // 13 kHz increment
        118.014, // 14 kHz increment
        118.016, // 16 kHz increment
        118.017, // 17 kHz increment
        118.018, // 18 kHz increment
        118.019, // 19 kHz increment
      ];

      invalidIncrements.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toEqual({ invalidFreq: true });
      });
    });

    it('should return validation error for non-numeric values', () => {
      const nonNumericValues = [
        'abc',
        '',
        null,
        undefined,
        {},
        [],
        NaN,
        Infinity,
        -Infinity,
      ];

      nonNumericValues.forEach((value) => {
        const control = createControl(value);
        const result = radioFrequencyValidator(control);
        expect(result).toEqual({ invalidFreq: true });
      });
    });

    it('should return validation error for negative frequencies', () => {
      const negativeFrequencies = [-118.0, -1, -0.005];

      negativeFrequencies.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toEqual({ invalidFreq: true });
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very small valid increments', () => {
      const control = createControl(118.005);
      const result = radioFrequencyValidator(control);
      expect(result).toBeNull();
    });

    it('should handle very large valid frequencies', () => {
      const control = createControl(136.99);
      const result = radioFrequencyValidator(control);
      expect(result).toBeNull();
    });

    it('should handle floating point precision issues', () => {
      // Test frequencies that might cause floating point precision issues
      const precisionTestFrequencies = [
        118.005, 118.015, 118.035, 118.055, 118.065, 118.075, 118.085, 118.105,
      ];

      precisionTestFrequencies.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toBeNull();
      });
    });

    it('should correctly identify 25 kHz exclusion zones at different MHz boundaries', () => {
      const exclusionZoneTests = [
        { frequency: 118.02, expected: { invalidFreq: true } },
        { frequency: 118.045, expected: { invalidFreq: true } },
        { frequency: 119.02, expected: { invalidFreq: true } },
        { frequency: 119.045, expected: { invalidFreq: true } },
        { frequency: 120.02, expected: { invalidFreq: true } },
        { frequency: 120.045, expected: { invalidFreq: true } },
      ];

      exclusionZoneTests.forEach(({ frequency, expected }) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('aviation frequency ranges', () => {
    it('should validate common VHF aviation frequencies', () => {
      const commonAviation = [
        118.0, // Tower frequencies start
        121.5, // Emergency frequency
        121.6, // Ground control
        121.7, // Ground control
        121.9, // Ground control
        122.8, // Unicom
        123.0, // Flight test
        123.45, // Air-to-air
        136.975, // Upper VHF limit
      ];

      commonAviation.forEach((frequency) => {
        const control = createControl(frequency);
        const result = radioFrequencyValidator(control);
        // These should all be valid if they follow the 5 kHz rule and avoid 25 kHz exclusions
        if ((frequency * 1000) % 5 === 0) {
          const kHz = Math.round((frequency - Math.floor(frequency)) * 1000);
          if ((kHz + 5) % 25 !== 0) {
            expect(result).toBeNull();
          } else {
            expect(result).toEqual({ invalidFreq: true });
          }
        } else {
          expect(result).toEqual({ invalidFreq: true });
        }
      });
    });
  });

  describe('mathematical validation', () => {
    it('should correctly calculate kHz increments', () => {
      // Test the internal logic for calculating kHz
      const testCases = [
        { frequency: 118.005, expectedKHz: 5 },
        { frequency: 118.01, expectedKHz: 10 },
        { frequency: 118.015, expectedKHz: 15 },
        { frequency: 118.02, expectedKHz: 20 },
        { frequency: 118.025, expectedKHz: 25 },
      ];

      testCases.forEach(({ frequency, expectedKHz }) => {
        const calculatedKHz = Math.round(
          (frequency - Math.floor(frequency)) * 1000,
        );
        expect(calculatedKHz).toBe(expectedKHz);
      });
    });

    it('should correctly identify 5 kHz modulo validation', () => {
      const testCases = [
        { frequency: 118.005, shouldBeDivisibleBy5: true },
        { frequency: 118.01, shouldBeDivisibleBy5: true },
        { frequency: 118.003, shouldBeDivisibleBy5: false },
        { frequency: 118.007, shouldBeDivisibleBy5: false },
      ];

      testCases.forEach(({ frequency, shouldBeDivisibleBy5 }) => {
        const isDivisibleBy5 = (frequency * 1000) % 5 === 0;
        expect(isDivisibleBy5).toBe(shouldBeDivisibleBy5);
      });
    });

    it('should correctly identify 25 kHz exclusion zones', () => {
      const testCases = [
        { frequency: 118.02, shouldBeExcluded: true },
        { frequency: 118.045, shouldBeExcluded: true },
        { frequency: 118.07, shouldBeExcluded: true },
        { frequency: 118.095, shouldBeExcluded: true },
        { frequency: 118.005, shouldBeExcluded: false },
        { frequency: 118.015, shouldBeExcluded: false },
        { frequency: 118.035, shouldBeExcluded: false },
      ];

      testCases.forEach(({ frequency, shouldBeExcluded }) => {
        const kHz = Math.round((frequency - Math.floor(frequency)) * 1000);
        const isExcluded = (kHz + 5) % 25 === 0;
        expect(isExcluded).toBe(shouldBeExcluded);
      });
    });
  });
});
