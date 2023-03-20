import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';

import { mapFeature } from '../../../store/map/map.feature';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';

const selectColorsBySpeed = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectSpeedMeter,
  (geoLocation, speedSettings) => {
    const speedKph = Math.round((geoLocation?.coords.speed ?? 0) * 3.6);
    const selectedSetting =
      [...speedSettings.colorsBySpeed]
        .reverse()
        .find((settings) => settings.minSpeed <= speedKph) ?? null;
    return {
      textColor: selectedSetting?.textColor || 'black',
      bgColor: selectedSetting?.bgColor || 'white',
      speedKph,
      position: speedSettings.position,
    };
  }
);

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
})
export class SpeedMeterWidgetComponent {
  colorsBySpeed$ = this.store.select(selectColorsBySpeed);

  constructor(private readonly store: Store) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      instrumentsSettings.speedMeterWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
