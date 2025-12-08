import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'durationBetweenInMinutes',
  standalone: true
})
export class DurationBetweenInMinutesPipe implements PipeTransform {

  transform(endEpoch: number, startEpoch: number): string {
    if (!endEpoch || !startEpoch) return '-';

    const diffMs = endEpoch - startEpoch;

    const minutes = Math.floor(Math.abs(diffMs) / 60000);

    return `${minutes} min`;
  }
}
