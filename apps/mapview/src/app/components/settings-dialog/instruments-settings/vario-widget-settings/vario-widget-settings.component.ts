import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { instrumentsSettings } from '../../../../store/core/core.actions';
import { selectInstrumentVarioMeterWidget } from '../../../../store/core/core.selectors';

@Component({
  selector: 'laamap-vario-widget-settings',
  templateUrl: './vario-widget-settings.component.html',
  styleUrls: ['./vario-widget-settings.component.scss'],
})
export class VarioWidgetSettingsComponent {
  varioWidgetColorsSettings$ = this.store.select(
    selectInstrumentVarioMeterWidget
  );

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  setTimeDifference(diffTime: number): void {
    this.store.dispatch(
      instrumentsSettings.variometerDiffTimeChanged({ diffTime })
    );
  }

  setMinClimbing(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    minClimbing: number
  ): void {
    if (array.find((item) => item.minClimbing === minClimbing)) {
      this.snackBar.open(
        this.translocoService.translate('settingDialog.instruments.duplicity'),
        undefined,
        {
          duration: 5000,
          politeness: 'polite',
        }
      );
    } else {
      this.store.dispatch(
        instrumentsSettings.variometerWidgetColorsChanged({
          colorsByClimbingSpeed: [
            ...array.slice(0, index),
            { ...array[index], minClimbing },
            ...array.slice(index + 1),
          ].sort((a, b) => a.minClimbing - b.minClimbing),
        })
      );
    }
  }

  setTextColor(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    textColor: string
  ): void {
    this.store.dispatch(
      instrumentsSettings.variometerWidgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          { ...array[index], textColor },
          ...array.slice(index + 1),
        ],
      })
    );
  }

  setBgColor(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number,
    bgColor: string
  ): void {
    this.store.dispatch(
      instrumentsSettings.variometerWidgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          { ...array[index], bgColor },
          ...array.slice(index + 1),
        ],
      })
    );
  }

  addNewClimbingItem(
    array: { minClimbing: number; bgColor: string; textColor: string }[]
  ): void {
    this.store.dispatch(
      instrumentsSettings.variometerWidgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array,
          {
            minClimbing: (array?.[array.length - 1]?.minClimbing ?? -1) + 1,
            bgColor: array?.[array.length - 1]?.bgColor ?? '#FFFFFF',
            textColor: array?.[array.length - 1]?.textColor ?? '#000000',
          },
        ],
      })
    );
  }

  removeClimbingItem(
    array: { minClimbing: number; bgColor: string; textColor: string }[],
    index: number
  ): void {
    this.store.dispatch(
      instrumentsSettings.variometerWidgetColorsChanged({
        colorsByClimbingSpeed: [
          ...array.slice(0, index),
          ...array.slice(index + 1),
        ],
      })
    );
  }

  trackByVario(
    index: number,
    item: { minClimbing: number; bgColor: string; textColor: string }
  ) {
    return item.minClimbing;
  }
}
