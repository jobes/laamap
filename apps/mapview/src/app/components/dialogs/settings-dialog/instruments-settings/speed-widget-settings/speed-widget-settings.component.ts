import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { instrumentSpeedSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-speed-widget-settings',
  templateUrl: './speed-widget-settings.component.html',
  styleUrls: ['./speed-widget-settings.component.scss'],
  imports: [
    TranslocoModule,
    MatSnackBarModule,
    MatExpansionModule,
    LetDirective,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
})
export class SpeedWidgetSettingsComponent {
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);
  speedWidgetColorsSettings$ = this.store.select(
    instrumentsFeature.selectSpeedMeter,
  );

  setSelectedSpeedSources(selectedSources: ('gps' | 'ias')[]): void {
    this.store.dispatch(
      instrumentSpeedSettingsActions.widgetSelectedSourcesChanged({
        selectedSources,
      }),
    );
  }

  setMinSpeed(
    array: { minSpeed: number; bgColor: string; textColor: string }[],
    index: number,
    minSpeed: number,
  ): void {
    if (array.find((item) => item.minSpeed === minSpeed)) {
      this.snackBar.open(
        this.translocoService.translate('settingDialog.instruments.duplicity'),
        undefined,
        {
          duration: 5000,
          politeness: 'polite',
        },
      );
    } else {
      this.store.dispatch(
        instrumentSpeedSettingsActions.widgetColorsChanged({
          colorsBySpeed: [
            ...array.slice(0, index),
            { ...array[index], minSpeed },
            ...array.slice(index + 1),
          ].sort((a, b) => a.minSpeed - b.minSpeed),
        }),
      );
    }
  }

  setTextColor(
    array: { minSpeed: number; bgColor: string; textColor: string }[],
    index: number,
    textColor: string,
  ): void {
    this.store.dispatch(
      instrumentSpeedSettingsActions.widgetColorsChanged({
        colorsBySpeed: [
          ...array.slice(0, index),
          { ...array[index], textColor },
          ...array.slice(index + 1),
        ],
      }),
    );
  }

  setBgColor(
    array: { minSpeed: number; bgColor: string; textColor: string }[],
    index: number,
    bgColor: string,
  ): void {
    this.store.dispatch(
      instrumentSpeedSettingsActions.widgetColorsChanged({
        colorsBySpeed: [
          ...array.slice(0, index),
          { ...array[index], bgColor },
          ...array.slice(index + 1),
        ],
      }),
    );
  }

  addNewSpeedItem(
    array: { minSpeed: number; bgColor: string; textColor: string }[],
  ): void {
    this.store.dispatch(
      instrumentSpeedSettingsActions.widgetColorsChanged({
        colorsBySpeed: [
          ...array,
          {
            minSpeed: (array?.[array.length - 1]?.minSpeed ?? -1) + 1,
            bgColor: array?.[array.length - 1]?.bgColor ?? '#FFFFFF',
            textColor: array?.[array.length - 1]?.textColor ?? '#000000',
          },
        ],
      }),
    );
  }

  removeSpeedItem(
    array: { minSpeed: number; bgColor: string; textColor: string }[],
    index: number,
  ): void {
    this.store.dispatch(
      instrumentSpeedSettingsActions.widgetColorsChanged({
        colorsBySpeed: [...array.slice(0, index), ...array.slice(index + 1)],
      }),
    );
  }
}
