import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validates radio frequency to ensure it follows aviation radio frequency rules:
 * - Must be a valid number
 * - Must be in 5 kHz increments (0.005 MHz steps)
 * - Must not be in 25 kHz exclusion zones
 */
export function radioFrequencyValidator(
  control: AbstractControl<number, number>,
): ValidationErrors | null {
  const value = control.value;
  if (+value === value) {
    if (value < 118 || value > 136.99) {
      return {
        invalidFreq: true,
      };
    }
    const khz = Math.round((value - Math.floor(value)) * 1000);
    if ((value * 1000) % 5 === 0 && (khz + 5) % 25 !== 0) {
      return null;
    }
  }

  return {
    invalidFreq: true,
  };
}
