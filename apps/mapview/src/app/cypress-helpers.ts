import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';

import { TranslocoRootModule } from './transloco-root.module';

export const translocoTestingProviders = [
  provideHttpClient(withInterceptorsFromDi()),
  {
    provide: APP_BASE_HREF,
    useFactory: (platformLocation: PlatformLocation) =>
      platformLocation.getBaseHrefFromDOM(),
    deps: [PlatformLocation],
  },
  importProvidersFrom(
    TranslocoRootModule,
    TranslocoLocaleModule.forRoot({
      langToLocaleMapping: {
        en: 'en-US',
        sk: 'sk-SK',
      },
    }),
    TranslocoMessageFormatModule.forRoot({ locales: ['en-US', 'sk-SK'] })
  ),
];

export const testingSharedProviders = [
  ...translocoTestingProviders,
  provideAnimations(),
];
export const testingSharedMountConfig = {
  providers: testingSharedProviders,
  imports: [RouterTestingModule],
};
