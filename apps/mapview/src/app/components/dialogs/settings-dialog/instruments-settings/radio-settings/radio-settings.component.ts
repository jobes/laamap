import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { radioFrequencyValidator } from '../../../../../services/validators/radio.validators';
import { radioSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-radio-setting',
  templateUrl: './radio-settings.component.html',
  styleUrls: ['./radio-settings.component.scss'],
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
})
export class RadioSettingsComponent {
  private readonly store = inject(Store);

  settings = this.store.selectSignal(instrumentsFeature.selectRadio);

  favoriteForm = new FormGroup({
    frequency: new FormControl<number>(null as any, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(118),
        Validators.max(136.99),
        radioFrequencyValidator,
      ],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  enableWidget(enabled: boolean): void {
    this.store.dispatch(radioSettingsActions.enabledChanged({ enabled }));
  }

  addFavorite(): void {
    if (this.favoriteForm.valid) {
      const formValue = this.favoriteForm.getRawValue();
      this.store.dispatch(
        radioSettingsActions.favoriteFrequencyAdded(formValue),
      );
      this.favoriteForm.reset();
      this.favoriteForm.controls.name.setErrors(null);
      this.favoriteForm.controls.frequency.setErrors(null);
    }
  }

  removeFavorite(index: number): void {
    this.store.dispatch(
      radioSettingsActions.favoriteFrequencyRemoved({ index }),
    );
  }

  moveFavoriteUp(index: number): void {
    this.store.dispatch(
      radioSettingsActions.favoriteFrequencyMovedUp({ index }),
    );
  }

  moveFavoriteDown(index: number): void {
    this.store.dispatch(
      radioSettingsActions.favoriteFrequencyMovedDown({ index }),
    );
  }
}
