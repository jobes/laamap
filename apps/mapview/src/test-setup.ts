import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
declare module window {
  const google: typeof import('google-one-tap');
  const URL: { createObjectURL: jest.Mock };
}
window.URL.createObjectURL = jest.fn();

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
