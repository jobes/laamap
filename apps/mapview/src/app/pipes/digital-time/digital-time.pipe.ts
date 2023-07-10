import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitalTime',
  standalone: true,
})
export class DigitalTimePipe implements PipeTransform {
  transform(inputSecs = 0, showSeconds = true): string {
    const hours = Math.floor(inputSecs / 3600);
    const minutes = Math.floor(inputSecs / 60) % 60;
    const seconds = Math.floor(inputSecs % 60);
    const hoursMinutes = `${('00' + hours.toString()).slice(-1)}:${(
      '00' + minutes.toString()
    ).slice(-2)}`;

    if (showSeconds) {
      return `${hoursMinutes}:${('00' + seconds.toString()).slice(-2)}`;
    }
    return hoursMinutes;
  }
}
