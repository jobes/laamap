/// <reference types="cypress" />
import '@this-dot/cypress-indexeddb';
import { mount } from 'cypress/angular';

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

Cypress.Commands.add('mount', mount);
