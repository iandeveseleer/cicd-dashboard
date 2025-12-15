import {DurationBetweenInMinutesPipe} from './duration-between.pipe';

describe('DurationBetweenInMinutesPipe', () => {
  let pipe: DurationBetweenInMinutesPipe;

  beforeEach(() => {
    pipe = new DurationBetweenInMinutesPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should handle ISO 8601 date strings', () => {
    const startDate = '2021-02-23T02:42:00.886Z';
    const endDate = '2021-02-23T03:12:00.886Z'; // 30 minutes later
    const result = pipe.transform(endDate, startDate);
    expect(result).toBe('30 min');
  });

  it('should handle epoch milliseconds', () => {
    const startEpoch = 1613948520886;
    const endEpoch = 1613948520886 + (30 * 60 * 1000); // 30 minutes later
    const result = pipe.transform(endEpoch, startEpoch);
    expect(result).toBe('30 min');
  });

  it('should handle mixed types (string and number)', () => {
    const startDate = '2021-02-23T02:42:00.886Z';
    const endEpoch = 1613948520886 + (30 * 60 * 1000);
    const result = pipe.transform(endEpoch, startDate);
    expect(result).toContain('min');
  });

  it('should return "-" for missing values', () => {
    expect(pipe.transform(null, 123456)).toBe('-');
    expect(pipe.transform(123456, null)).toBe('-');
    expect(pipe.transform(undefined, 123456)).toBe('-');
    expect(pipe.transform(123456, undefined)).toBe('-');
    expect(pipe.transform('', '')).toBe('-');
    expect(pipe.transform('  ', '  ')).toBe('-');
  });

  it('should return "-" for invalid date strings', () => {
    const result = pipe.transform('invalid', '2021-02-23T02:42:00.886Z');
    expect(result).toBe('-');
  });
});

