/// <reference types="cypress" />
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import '@this-dot/cypress-indexeddb';
import { mount } from 'cypress/angular';

import { TranslocoRootModule } from '../../src/app/transloco-root.module';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mount: typeof mount;
      clearIndexedDb(databaseName: string): void;
      openIndexedDb(
        databaseName: string,
        version?: number
      ): Chainable<IDBDatabase>;
      createObjectStore(storeName: string): Chainable<IDBObjectStore>;
      getStore(storeName: string): Chainable<IDBObjectStore>;
      createItem(key: string, value: unknown): Chainable<IDBObjectStore>;
      readItem<T = unknown>(key: IDBValidKey | IDBKeyRange): Chainable<T>;
      updateItem(key: string, value: unknown): Chainable<IDBObjectStore>;
      deleteItem(key: string): Chainable<IDBObjectStore>;
    }
  }
}

// mount

const translocoTestingProviders = [
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

type MountParams = Parameters<typeof mount>;
Cypress.Commands.add(
  'mount',
  (component: MountParams[0], config: MountParams[1] = {}) => {
    return mount(component, {
      ...config,
      imports: [...(config.imports ?? [])],
      providers: [
        ...translocoTestingProviders,
        provideAnimations(),
        provideRouter([]),
        ...(config.providers ?? []),
      ],
    });
  }
);
