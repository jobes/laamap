import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslocoService } from '@jsverse/transloco';

import { VersionNewsDialogComponent } from '../../components/dialogs/version-news-dialog/version-news-dialog.component';

interface INewsDef {
  [version: string]: { [lang: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly updates = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);
  private readonly dialog = inject(MatDialog);

  constructor() {
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
            console.log(
              `Upgrade ready: ${evt.currentVersion.hash} => ${evt.latestVersion.hash}`,
            );
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
            maxWidth: '100%',
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
