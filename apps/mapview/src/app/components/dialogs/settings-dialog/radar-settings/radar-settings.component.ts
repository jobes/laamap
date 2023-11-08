import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import {
  RadarTypes,
  radarSettingsActions,
} from '../../../../store/actions/settings.actions';
import { radarFeature } from '../../../../store/features/settings/radar.feature';

@Component({
  selector: 'laamap-radar-settings',
  templateUrl: './radar-settings.component.html',
  styleUrls: ['./radar-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetModule,
    MatExpansionModule,
    MatIconModule,
    NgIf,
    MatTooltipModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
  ],
})
export class RadarSettingsComponent {
  radar$ = this.store.select(radarFeature['selectSettings.radarState']);

  types = ['radar', 'satellite', 'coverage'];
  colorScheme = Array.from(Array(9).keys());

  constructor(private readonly store: Store) {}

  enableRadar(enabled: boolean): void {
    this.store.dispatch(radarSettingsActions.enabledChanged({ enabled }));
  }

  enableWidget(enabled: boolean): void {
    this.store.dispatch(radarSettingsActions.widgetEnabled({ enabled }));
  }

  typeChanged(type: RadarTypes): void {
    this.store.dispatch(radarSettingsActions.typeChanged({ viewType: type }));
  }

  colorSchemeChanged(colorScheme: number): void {
    this.store.dispatch(
      radarSettingsActions.colorSchemeChanged({ colorScheme }),
    );
  }

  enableSnow(enabled: boolean): void {
    this.store.dispatch(radarSettingsActions.enabledSnowChanged({ enabled }));
  }

  enableSmooth(enabled: boolean): void {
    this.store.dispatch(radarSettingsActions.enabledSmoothChanged({ enabled }));
  }

  animationSpeedChanged(animationSpeed: number | null): void {
    this.store.dispatch(
      radarSettingsActions.animationSpeedChanged({
        animationSpeed: animationSpeed ?? 0,
      }),
    );
  }

  widgetBgColorChanged(color: string): void {
    this.store.dispatch(radarSettingsActions.widgetBgColorChanged({ color }));
  }

  widgetTextColorFutureChanged(color: string): void {
    this.store.dispatch(
      radarSettingsActions.widgetTextColorFutureChanged({ color }),
    );
  }

  widgetTextColorPastChanged(color: string): void {
    this.store.dispatch(
      radarSettingsActions.widgetTextColorPastChanged({ color }),
    );
  }

  opacityChanged(opacity: number | null): void {
    this.store.dispatch(
      radarSettingsActions.opacityChanged({ opacity: opacity ?? 0 }),
    );
  }

  trackByNumber(index: number, value: number) {
    return value;
  }

  trackByString(index: number, value: string) {
    return value;
  }
}
