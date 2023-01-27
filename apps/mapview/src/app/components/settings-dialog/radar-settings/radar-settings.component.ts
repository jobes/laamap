import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RadarSettingsActions } from '../../../store/core/core.actions';
import { AppState } from '../../../store/core/core.reducer';
import { selectRadar } from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-radar-settings',
  templateUrl: './radar-settings.component.html',
  styleUrls: ['./radar-settings.component.scss'],
})
export class RadarSettingsComponent {
  radar$ = this.store.select(selectRadar);

  types = ['radar', 'satellite', 'coverage'];
  colorScheme = Array.from(Array(9).keys());

  constructor(private readonly store: Store) {}

  enableRadar(enabled: boolean): void {
    this.store.dispatch(RadarSettingsActions.enabledChanged({ enabled }));
  }

  enableWidget(enabled: boolean): void {
    this.store.dispatch(RadarSettingsActions.enabledWidgetChanged({ enabled }));
  }

  typeChanged(type: AppState['core']['radar']['type']): void {
    this.store.dispatch(RadarSettingsActions.typeChanged({ viewType: type }));
  }

  colorSchemeChanged(colorScheme: number): void {
    this.store.dispatch(
      RadarSettingsActions.colorSchemeChanged({ colorScheme })
    );
  }

  enableSnow(enabled: boolean): void {
    this.store.dispatch(RadarSettingsActions.enabledSnowChanged({ enabled }));
  }

  enableSmooth(enabled: boolean): void {
    this.store.dispatch(RadarSettingsActions.enabledSmoothChanged({ enabled }));
  }

  animationSpeedChanged(animationSpeed: number | null): void {
    this.store.dispatch(
      RadarSettingsActions.animationSpeed({
        animationSpeed: animationSpeed ?? 0,
      })
    );
  }

  widgetBgColorChanged(color: string): void {
    this.store.dispatch(RadarSettingsActions.widgetBgColorChanged({ color }));
  }

  widgetTextColorFutureChanged(color: string): void {
    this.store.dispatch(
      RadarSettingsActions.widgetTextColorFutureChanged({ color })
    );
  }

  widgetTextColorPastChanged(color: string): void {
    this.store.dispatch(
      RadarSettingsActions.widgetTextColorPastChanged({ color })
    );
  }

  opacityChanged(opacity: number | null): void {
    this.store.dispatch(
      RadarSettingsActions.opacityChanged({ opacity: opacity ?? 0 })
    );
  }
}
