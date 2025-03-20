import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { switchMap } from 'rxjs';

import { CustomFlyRoutesService } from '../../../services/custom-fly-routes/custom-fly-routes.service';

@Component({
  selector: 'laamap-custom-fly-route-create',
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './custom-fly-route-create.component.html',
  styleUrls: ['./custom-fly-route-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFlyRouteCreateComponent {
  private readonly routesService = inject(CustomFlyRoutesService);

  name = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  nameExists$ = this.name.valueChanges.pipe(
    switchMap((name) => this.routesService.nameExist(name)),
  );
}
