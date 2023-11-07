import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ScreenWakeLockService } from '../../../../services/screen-wake-lock/screen-wake-lock.service';
import { generalSettingsActions } from '../../../../store/actions/settings.actions';
import { generalFeature } from '../../../../store/features/settings/general.feature';

@Component({
  selector: 'laamap-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    LetDirective,
    MatSlideToggleModule,
    FormsModule,
    NgIf,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
  ],
})
export class GeneralSettingsComponent {
  screenWakeLockEnabled$ = this.store.select(
    generalFeature.selectScreenWakeLockEnabled,
  );
  screenWakeLockSupported = ScreenWakeLockService.supported;
  widgetFontSizeRatio$ = this.store.select(
    generalFeature.selectWidgetFontSizeRatio,
  );
  mapFontSizeRatio$ = this.store.select(generalFeature.selectMapFontSizeRatio);
  airplaneName$ = this.store.select(generalFeature.selectAirplaneName);

  constructor(private readonly store: Store) {}

  screenWakeLockEnabledChange(enabled: boolean) {
    this.store.dispatch(
      generalSettingsActions.screenWakeLockEnableChanged({ enabled }),
    );
  }

  widgetFontSizeRatioChanged(value: number) {
    this.store.dispatch(
      generalSettingsActions.widgetFontSizeRatioChanged({ value }),
    );
  }

  mapFontSizeRatioChanged(value: number) {
    this.store.dispatch(
      generalSettingsActions.mapFontSizeRatioChanged({ value }),
    );
  }

  airplaneNameChanged(airplaneName: string) {
    this.store.dispatch(
      generalSettingsActions.airplaneNameChanged({ airplaneName }),
    );
  }
}
