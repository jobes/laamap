import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

import { VersionNewsDialogComponent } from '../../components/dialogs/version-news-dialog/version-news-dialog.component';
import { LoggerService } from './logger.service';

class LocalStorageMock {
  store: { [key: string]: string } = {};
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
}

describe('LoggerService', () => {
  let service: LoggerService;
  let dialogService: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBar,
          useValue: { open: () => ({ onAction: () => of({}) }) },
        },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: TranslocoService, useValue: { translate: () => '' } },
        {
          provide: SwUpdate,
          useValue: {
            versionUpdates: of({
              type: 'VERSION_READY',
              currentVersion: { hash: 'old' },
              latestVersion: {
                hash: 'new',
                appData: {
                  news: {
                    '7': { sk: 'markdown7' },
                    '6': { sk: 'markdown6' },
                    '2': { sk: 'markdown2' },
                    '4': { sk: 'markdown4' },
                    '3': { sk: 'markdown3' },
                    '5': { sk: 'markdown5' },
                    '1': { sk: 'markdown1' },
                  },
                },
              },
            }),
          },
        },
      ],
    });
    service = TestBed.inject(LoggerService);
    dialogService = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have no news after first install', () => {
    global.localStorage = new LocalStorageMock();
    service.logPwaEvents();
    expect(dialogService.open).toBeCalledWith(VersionNewsDialogComponent, {
      maxWidth: '100%',
      data: [],
    });
  });

  it('should have no news when all news already showed', () => {
    global.localStorage = new LocalStorageMock();
    global.localStorage.setItem('installed_version', '7');
    service.logPwaEvents();
    expect(dialogService.open).toBeCalledWith(VersionNewsDialogComponent, {
      maxWidth: '100%',
      data: [],
    });
  });

  it('should have unread news', () => {
    global.localStorage = new LocalStorageMock();
    global.localStorage.setItem('installed_version', '4');
    service.logPwaEvents();
    expect(dialogService.open).toBeCalledWith(VersionNewsDialogComponent, {
      maxWidth: '100%',
      data: [{ sk: 'markdown5' }, { sk: 'markdown6' }, { sk: 'markdown7' }],
    });
  });

  it('should have unread news sorted', () => {
    global.localStorage = new LocalStorageMock();
    global.localStorage.setItem('installed_version', '0');
    service.logPwaEvents();
    expect(dialogService.open).toBeCalledWith(VersionNewsDialogComponent, {
      maxWidth: '100%',
      data: [
        { sk: 'markdown1' },
        { sk: 'markdown2' },
        { sk: 'markdown3' },
        { sk: 'markdown4' },
        { sk: 'markdown5' },
        { sk: 'markdown6' },
        { sk: 'markdown7' },
      ],
    });
  });
});
