import { DigitalTimePipe } from './digital-time.pipe';

describe('DigitalTimePipe', () => {
  let pipe: DigitalTimePipe;
  beforeEach(() => {
    pipe = new DigitalTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('show time without seconds', () => {
    expect(pipe.transform(5432, false)).toBe('1:30');
  });

  it('show time with seconds', () => {
    expect(pipe.transform(5432, true)).toBe('1:30:32');
  });

  it('show time without seconds with leading zero in minutes', () => {
    expect(pipe.transform(3932, false)).toBe('1:05');
  });

  it('show time with seconds with leading zero in seconds', () => {
    expect(pipe.transform(5402, true)).toBe('1:30:02');
  });
});
