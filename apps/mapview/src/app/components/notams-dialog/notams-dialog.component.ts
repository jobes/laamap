import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

import { INotamDecoded } from '../../services/notams/notams.interface';
import { notamsSettings } from '../../store/settings/notams/notams.actions';
import { selectNonHiddenDecodedNotams } from '../../store/settings/notams/notams.feature';

@UntilDestroy()
@Component({
  selector: 'laamap-notams-dialog',
  templateUrl: './notams-dialog.component.html',
  styleUrls: ['./notams-dialog.component.scss'],
})
export class NotamsDialogComponent {
  nonHiddenNotams$ = this.store.select(selectNonHiddenDecodedNotams(this.data));
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: INotamDecoded[],
    private dialogRef: MatDialogRef<NotamsDialogComponent>,
    private store: Store
  ) {
    this.nonHiddenNotams$
      .pipe(
        filter((notams) => notams.length === 0),
        take(1),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  hide(notamId: string): void {
    this.store.dispatch(notamsSettings.hide({ notamId }));
  }
}
