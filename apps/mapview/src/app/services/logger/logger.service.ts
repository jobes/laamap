/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslocoService } from '@ngneat/transloco';
import { VersionNewsDialogComponent } from '../../components/dialogs/version-news-dialog/version-news-dialog.component';

interface INewsDef {
  [version: string]: { [lang: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(
    private readonly updates: SwUpdate,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly dialog: MatDialog,
  ) {
    if (this.updates.isEnabled) {
      this.logPwaEvents();
    }
  }

  logErrorMsg(source: string, msg: string): void {
    console.error(source, msg);
  }

  logPwaEvents(): void {
    this.updates.versionUpdates.subscribe({
      next: (evt) => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${evt.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${evt.currentVersion.hash}`);
            console.log(
              `New app version ready for use: ${evt.latestVersion.hash}`,
            );
            console.log('app data', evt.latestVersion.appData);
            this.openSnackbarForVersionReady(evt);

            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(
              `Failed to install app version '${evt.version.hash}': ${evt.error}`,
            );
            break;
        }
      },
    });
  }

  private openSnackbarForVersionReady(evt: VersionReadyEvent): void {
    const news = this.actualNews(evt);
    this.snackBar
      .open(
        this.translocoService.translate('mapView.pwaRestartToUpdate'),
        news.length
          ? this.translocoService.translate('mapView.pwaRestartToUpdateDetails')
          : undefined,
        { duration: 10000 },
      )
      .onAction()
      .subscribe({
        next: () =>
          this.dialog.open(VersionNewsDialogComponent, {
            width: '100%',
            data: news,
          }),
      });
  }

  private actualNews(evt: VersionReadyEvent): { [lang: string]: string }[] {
    const news = ((evt?.latestVersion?.appData as { news: unknown })?.news ||
      {}) as INewsDef;

    const versions = Object.keys(news).sort();
    const lastVersion = localStorage.getItem('installed_version');
    localStorage.setItem('installed_version', versions[versions.length - 1]);

    return lastVersion
      ? versions
          .filter((version) => version > lastVersion)
          .map((version) => news[version])
      : [];
  }
}
