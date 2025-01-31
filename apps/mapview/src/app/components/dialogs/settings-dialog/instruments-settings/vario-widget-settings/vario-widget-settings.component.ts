import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { varioSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-vario-widget-settings',
  templateUrl: './vario-widget-settings.component.html',
  styleUrls: ['./vario-widget-settings.component.scss'],
  standalone: true,
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
export class VarioWidgetSettingsComponent {
  varioWidgetColorsSettings$ = this.store.select(
    instrumentsFeature.selectVarioMeter,
  );

  sourceValues = ['gps', 'pressure'];

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
  ) {}

  setTimeDifference(diffTime: number): void {
    this.store.dispatch(varioSettingsActions.diffTimeChanged({ diffTime }));
  }

  setMinClimbing(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    minClimbing: number,
  ): void {
    if (array.find((item) => item.minClimbing === minClimbing)) {
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
        varioSettingsActions.widgetColorsChanged({
          colorsByClimbingSpeed: [
            ...array.slice(0, index),
            { ...array[index], minClimbing },
            ...array.slice(index + 1),
          ].sort((a, b) => a.minClimbing - b.minClimbing),
        }),
      );
    }
  }

  setTextColor(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    textColor: string,
  ): void {
    this.store.dispatch(
      varioSettingsActions.widgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          { ...array[index], textColor },
          ...array.slice(index + 1),
        ],
      }),
    );
  }

  setBgColor(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    bgColor: string,
  ): void {
    this.store.dispatch(
      varioSettingsActions.widgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          { ...array[index], bgColor },
          ...array.slice(index + 1),
        ],
      }),
    );
  }

  addNewClimbingItem(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
  ): void {
    this.store.dispatch(
      varioSettingsActions.widgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array,
          {
            minClimbing: (array?.[array.length - 1]?.minClimbing ?? -1) + 1,
            bgColor: array?.[array.length - 1]?.bgColor ?? '#FFFFFF',
            textColor: array?.[array.length - 1]?.textColor ?? '#000000',
          },
        ],
      }),
    );
  }

  removeClimbingItem(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
  ): void {
    this.store.dispatch(
      varioSettingsActions.widgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          ...array.slice(index + 1),
        ],
      }),
    );
  }

  setRelativeHeightSource(source: 'gps' | 'pressure'): void {
    this.store.dispatch(
      varioSettingsActions.relativeHeightSourceChanged({ source }),
    );
  }
}
