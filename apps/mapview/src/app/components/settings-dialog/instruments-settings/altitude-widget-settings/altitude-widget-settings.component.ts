import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { instrumentAltimeterSettingsActions } from '../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-altitude-widget-settings',
  templateUrl: './altitude-widget-settings.component.html',
  styleUrls: ['./altitude-widget-settings.component.scss'],
})
export class AltitudeWidgetSettingsComponent {
  showTypes = ['altitudeM', 'gndM', 'altitudeFt', 'gndFt'];
  settings$ = this.store.select(instrumentsFeature.selectAltimeter);

  constructor(private readonly store: Store) {}

  setGndAltitude(gndAltitude: number): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.manualGndAltitudeChanged({
        gndAltitude,
      })
    );
  }

  bgColorChanged(bgColor: string): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.bgColorChanged({ bgColor })
    );
  }

  textColorChanged(textColor: string): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.textColorChanged({ textColor })
    );
  }

  showTypeChanged(
    show: ('altitudeM' | 'gndM' | 'altitudeFt' | 'gndFt')[]
  ): void {
    this.store.dispatch(
      instrumentAltimeterSettingsActions.showTypeChanged({ show })
    );
  }

  showTypeTrack(index: number, item: string): string {
    return item;
  }
}
