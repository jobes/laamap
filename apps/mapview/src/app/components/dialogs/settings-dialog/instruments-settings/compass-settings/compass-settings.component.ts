import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { compassSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-compass-widget-settings',
  templateUrl: './compass-settings.component.html',
  styleUrls: ['./compass-settings.component.scss'],
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
  ],
})
export class CompassSettingsComponent {
  private readonly store = inject(Store);

  settings = this.store.selectSignal(instrumentsFeature.selectCompass);

  enableWidget(enabled: boolean): void {
    this.store.dispatch(
      compassSettingsActions.widgetEnabledChanged({ enabled }),
    );
  }

  enableCircle(enabled: boolean): void {
    this.store.dispatch(
      compassSettingsActions.circleEnabledChanged({ enabled }),
    );
  }

  moveFromBottom(value: number): void {
    this.store.dispatch(
      compassSettingsActions.circleMovedFromBottom({ value }),
    );
  }

  moveFromCenter(value: number): void {
    this.store.dispatch(
      compassSettingsActions.circleMovedFromCenter({ value }),
    );
  }

  circleSizeChange(value: number): void {
    this.store.dispatch(
      compassSettingsActions.circleRelativeSizeChanged({ value }),
    );
  }
}
