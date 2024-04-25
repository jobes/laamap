import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

import { INotamDecoded } from '../../../services/notams/notams.interface';
import { notamsViewActions } from '../../../store/actions/notams.actions';
import { notamsFeature } from '../../../store/features/settings/notams.feature';

@UntilDestroy()
@Component({
  selector: 'laamap-notams-dialog',
  templateUrl: './notams-dialog.component.html',
  styleUrls: ['./notams-dialog.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    NgFor,
    NgIf,
    MatButtonModule,
    TranslocoLocaleModule,
    PushPipe,
  ],
})
export class NotamsDialogComponent {
  nonHiddenNotams$ = this.store.select(
    notamsFeature.selectNonHiddenDecodedNotams(this.data),
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: INotamDecoded[],
    private dialogRef: MatDialogRef<NotamsDialogComponent>,
    private store: Store,
  ) {
    this.nonHiddenNotams$
      .pipe(
        filter((notams) => notams.length === 0),
        take(1),
        untilDestroyed(this),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  hide(notamId: string): void {
    this.store.dispatch(notamsViewActions.hide({ notamId }));
  }

  trackByNotam(index: number, value: INotamDecoded) {
    return value.id;
  }
}
