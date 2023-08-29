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

  it('show hours with 2 digits', () => {
    expect(pipe.transform(54915, true)).toBe('15:15:15');
  });

  it('show hours with 3 digits', () => {
    expect(pipe.transform(414915, true)).toBe('115:15:15');
  });
});
