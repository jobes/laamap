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
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  templateUrl: './fly-tracing-history-delete-dialog.html',
  styleUrls: ['./fly-tracing-history-delete-dialog.scss'],
  imports: [
    MatDialogModule,
    TranslocoModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class FlyTracingHistoryDeleteDialog {
  dialogRef = inject(MatDialogRef<FlyTracingHistoryDeleteDialog>);
}
