import 'jest-preset-angular/setup-jest';

window.URL.createObjectURL = jest.fn();
declare global {
  const google: typeof import('google-one-tap');
}
