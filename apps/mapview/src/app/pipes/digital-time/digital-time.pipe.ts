import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitalTime',
  standalone: true,
})
export class DigitalTimePipe implements PipeTransform {
  transform(inputSecs: number = 0): string {
    const hours = Math.floor(inputSecs / 3600);
    const minutes = Math.floor(inputSecs / 60) % 60;
    const seconds = Math.floor(inputSecs % 60);

    return `${('00' + hours.toString()).slice(-1)}:${(
      '00' + minutes.toString()
    ).slice(-2)}:${('00' + seconds.toString()).slice(-2)}`;
  }
}
