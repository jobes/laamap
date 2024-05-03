import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { NotamsService } from '../../../../services/notams/notams.service';
import { OpenAipService } from '../../../../services/open-aip/open-aip.service';
import { ScreenWakeLockService } from '../../../../services/screen-wake-lock/screen-wake-lock.service';
import { languages } from '../../../../services/transloco-loader.service';
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
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatSelectModule,
    AsyncPipe,
    UpperCasePipe,
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
  notamFirs$ = this.store.select(generalFeature.selectNotamFirs);
  notamRadius$ = this.store.select(generalFeature.selectNotamRadius);
  firList$ = this.notams.getFirList();
  territories$ = this.store.select(generalFeature.selectTerritories);
  territoryList$ = this.openAip.getTerritories$();
  languageList = Object.keys(languages);
  language$ = this.store.select(generalFeature.selectLanguage);

  constructor(
    private readonly store: Store,
    private readonly notams: NotamsService,
    private readonly openAip: OpenAipService,
  ) {}

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

  notamFirsChanged(firs: string[]) {
    this.store.dispatch(generalSettingsActions.notamFIRChanged({ firs }));
  }

  notamRadiusFirsChanged(radius: number) {
    this.store.dispatch(generalSettingsActions.notamRadiusChanged({ radius }));
  }

  territoriesChanged(territories: string[]): void {
    this.store.dispatch(
      generalSettingsActions.territoriesChanged({ territories }),
    );
  }

  languageChanged(language: string): void {
    this.store.dispatch(generalSettingsActions.languageChanged({ language }));
    window.location.reload();
  }
}
