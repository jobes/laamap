import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { instrumentsSettings } from '../../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../../store/settings/instruments/instruments.feature';

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
      instrumentsSettings.altimeterManualGndAltitudeChanged({ gndAltitude })
    );
  }

  bgColorChanged(bgColor: string): void {
    this.store.dispatch(
      instrumentsSettings.altimeterBgColorChanged({ bgColor })
    );
  }

  textColorChanged(textColor: string): void {
    this.store.dispatch(
      instrumentsSettings.altimeterTextColorChanged({ textColor })
    );
  }

  showTypeChanged(
    show: ('altitudeM' | 'gndM' | 'altitudeFt' | 'gndFt')[]
  ): void {
    this.store.dispatch(instrumentsSettings.altimeterShowTypeChanged({ show }));
  }

  showTypeTrack(index: number, item: string): string {
    return item;
  }
}
