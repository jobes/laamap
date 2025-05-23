import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { LngLat } from 'maplibre-gl';
import { QuillModule } from 'ngx-quill';

import { IDbInterestPoint } from '../../../database/synced-db.service';
import { InterestPointsService } from '../../../services/interest-points/interest-points.service';

export type CreateInterestPointDialogInput =
  | { mode: 'create'; point: LngLat }
  | { mode: 'edit'; value: { id: string; properties: IDbInterestPoint } };

@Component({
  selector: 'laamap-create-interest-point-dialog',
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    QuillModule,
  ],
  templateUrl: './create-interest-point-dialog.component.html',
  styleUrls: ['./create-interest-point-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateInterestPointDialogComponent {
  readonly interestPointsService = inject(InterestPointsService);
  readonly data = inject(MAT_DIALOG_DATA) as CreateInterestPointDialogInput;
  private readonly dialogRef = inject(
    MatDialogRef<CreateInterestPointDialogComponent>,
  );
  readOnlyMode = this.data.mode === 'edit';

  name = new FormControl(
    this.data.mode === 'edit' ? this.data.value.properties.name : '',
    {
      nonNullable: true,
      validators: [Validators.required],
    },
  );
  icon = new FormControl(
    this.data.mode === 'edit' ? this.data.value.properties.icon : '',
    {
      nonNullable: true,
      validators: [Validators.required],
    },
  );
  description = new FormControl(
    this.data.mode === 'edit' ? this.data.value.properties.description : '',
    { nonNullable: true },
  );

  saveInterestPoint(): void {
    const properties = {
      name: this.name.value,
      icon: this.icon.value,
      description: this.description.value,
    };
    if (this.data.mode === 'create') {
      void this.interestPointsService.addPoint({
        ...properties,
        point: [this.data.point.lng, this.data.point.lat],
      });
    } else {
      void this.interestPointsService.editPoint({
        id: this.data.value.properties.id,
        ...properties,
      });
    }

    this.dialogRef.close();
  }

  deletePoint(): void {
    if (this.data.mode === 'edit') {
      void this.interestPointsService.deletePoint(
        this.data.value.properties.id,
      );
    }
    this.dialogRef.close();
  }
}
