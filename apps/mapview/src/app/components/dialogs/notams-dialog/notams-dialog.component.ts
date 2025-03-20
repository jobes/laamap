import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Subject, filter, take, takeUntil } from 'rxjs';

import { INotamDecoded } from '../../../services/notams/notams.interface';
import { notamsViewActions } from '../../../store/actions/notams.actions';
import { notamsFeature } from '../../../store/features/settings/notams.feature';

@Component({
  selector: 'laamap-notams-dialog',
  templateUrl: './notams-dialog.component.html',
  styleUrls: ['./notams-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    TranslocoLocaleModule,
    PushPipe,
  ],
})
export class NotamsDialogComponent implements OnDestroy {
  private readonly destroyer$ = new Subject();
  private readonly data: INotamDecoded[] = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NotamsDialogComponent>);
  private readonly store = inject(Store);

  nonHiddenNotams$ = this.store.select(
    notamsFeature.selectNonHiddenDecodedNotams(this.data),
  );
  constructor() {
    this.nonHiddenNotams$
      .pipe(
        filter((notams) => notams.length === 0),
        take(1),
        takeUntil(this.destroyer$),
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

  ngOnDestroy(): void {
    this.destroyer$.next(null);
    this.destroyer$.complete();
  }
}
