import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';

import { ITrackingRoute } from '../../../../database/synced-db.service';
import { TracingService } from '../../../../services/tracing/tracing.service';

@Component({
  templateUrl: './fly-tracing-history-join-dialog.html',
  styleUrls: ['./fly-tracing-history-join-dialog.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslocoModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class FlyTracingHistoryJoinDialog {
  private dialogRef = inject(MatDialogRef<FlyTracingHistoryJoinDialog>);
  private data = inject(MAT_DIALOG_DATA) as { id: string };
  private tracingService = inject(TracingService);

  routes = this.tracingService
    .getFlyHistoryListWithTime(0, 1000)
    .then(async (res) => {
      const available = await this.tracingService.flyTracingAvailable(
        this.data.id,
      );
      return res.list.filter(
        (r: ITrackingRoute) => r.id !== this.data.id && available,
      );
    });

  form = new FormGroup({
    toId: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.toId);
    }
  }
}
