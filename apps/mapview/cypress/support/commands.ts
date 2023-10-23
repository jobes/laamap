/// <reference types="cypress" />
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import { provideTranslocoLocale } from '@ngneat/transloco-locale';
import { provideTranslocoMessageformat } from '@ngneat/transloco-messageformat';
import '@this-dot/cypress-indexeddb';
import { mount } from 'cypress/angular';

import { TranslocoHttpLoader } from '../../src/app/services/transloco-loader.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mount: typeof mount;
      clearIndexedDb(databaseName: string): void;
      openIndexedDb(
        databaseName: string,
        version?: number,
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

type MountParams = Parameters<typeof mount>;
Cypress.Commands.add(
  'mount',
  // eslint-disable-next-line max-lines-per-function
  (component: MountParams[0], config: MountParams[1] = {}) => {
    return mount(component, {
      ...config,
      imports: [...(config.imports ?? [])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: APP_BASE_HREF,
          useFactory: (platformLocation: PlatformLocation) =>
            platformLocation.getBaseHrefFromDOM(),
          deps: [PlatformLocation],
        },
        provideTranslocoLocale({
          langToLocaleMapping: {
            en: 'en-US',
            sk: 'sk-SK',
          },
        }),
        provideTransloco({
          config: {
            availableLangs: ['sk', 'en'],
            defaultLang: 'sk',
            prodMode: true,
          },
          loader: TranslocoHttpLoader,
        }),
        provideTranslocoMessageformat({ locales: ['en-US', 'sk-SK'] }),
        provideAnimations(),
        provideRouter([]),
        ...(config.providers ?? []),
      ],
    });
  },
);
