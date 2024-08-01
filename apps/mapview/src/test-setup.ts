import 'jest-preset-angular/setup-jest';

// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
declare module window {
  const google: typeof import('google-one-tap');
  const URL: { createObjectURL: jest.Mock };
}
window.URL.createObjectURL = jest.fn();
