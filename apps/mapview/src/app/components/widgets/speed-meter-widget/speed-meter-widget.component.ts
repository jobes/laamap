import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';

@Component({
  selector: 'laamap-speed-meter-widget',
  templateUrl: './speed-meter-widget.component.html',
  styleUrls: ['./speed-meter-widget.component.scss'],
})
export class SpeedMeterWidgetComponent {
  colorsBySpeed$ = this.mapService.geolocation$.pipe(
    map((geoLocation) => geoLocation?.coords.speed ?? 0),
    map((speedMeterPerSeconds) => Math.round(speedMeterPerSeconds / 3.6)),
    concatLatestFrom(() =>
      this.store.select(instrumentsFeature.selectSpeedMeter)
    ),
    map(
      ([speedKph, speedSettings]) =>
        [
          [...speedSettings.colorsBySpeed]
            .reverse()
            .find((settings) => settings.minSpeed <= speedKph) ?? null,
          speedKph,
          speedSettings.position,
        ] as const
    ),
    map(([selectedSetting, speedKph, position]) => ({
      textColor: selectedSetting?.textColor || 'black',
      bgColor: selectedSetting?.bgColor || 'white',
      speedKph,
      position,
    }))
  );

  constructor(
    private readonly mapService: MapService,
    private readonly store: Store
  ) {}

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
