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
  templateUrl: './fly-tracing-history-rename-dialog.html',
  styleUrls: ['./fly-tracing-history-rename-dialog.scss'],
  imports: [
    MatDialogModule,
    TranslocoModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class FlyTracingHistoryRenameDialog {
  dialogRef = inject(MatDialogRef<FlyTracingHistoryRenameDialog>);
  data = inject(MAT_DIALOG_DATA) as { id: string; name: string };
  form = new FormGroup({
    name: new FormControl(this.data.name, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit() {
    this.dialogRef.close(this.form.value.name);
  }
}
