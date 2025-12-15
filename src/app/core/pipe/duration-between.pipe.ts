import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'durationBetweenInMinutes',
  standalone: true
})
export class DurationBetweenInMinutesPipe implements PipeTransform {

  transform(endDate: number | string | null | undefined, startDate: number | string | null | undefined): string {
    if (endDate == null || startDate == null) return '-';

    if (typeof endDate === 'string' && endDate.trim() === '') return '-';
    if (typeof startDate === 'string' && startDate.trim() === '') return '-';

    const endMs = this.toMilliseconds(endDate);
    const startMs = this.toMilliseconds(startDate);

    if (endMs === null || startMs === null) return '-';

    const diffMs = endMs - startMs;
    const seconds = Math.floor(diffMs / 1000);

    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }

    return `${seconds} s`;
  }

  private toMilliseconds(date: number | string | null | undefined): number | null {
    if (date == null) return null;

    if (typeof date === 'number') {
      return isNaN(date) ? null : date;
    }

    const trimmed = date.trim();
    if (!trimmed) return null;
    const timestamp = new Date(trimmed).getTime();
    return isNaN(timestamp) ? null : timestamp;
  }
}
