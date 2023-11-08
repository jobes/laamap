import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CustomFlyRoutesService } from '../../../services/custom-fly-routes/custom-fly-routes.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'laamap-custom-fly-route-create',
  standalone: true,
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    validators: [Validators.required],
  });

  nameExists$ = this.name.valueChanges.pipe(
    switchMap((name) => this.routesService.nameExist(name)),
  );
}
