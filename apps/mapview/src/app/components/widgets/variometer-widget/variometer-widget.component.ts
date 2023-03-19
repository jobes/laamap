import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  auditTime,
  combineLatest,
  map,
  pairwise,
  startWith,
  switchMap,
} from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';

@Component({
  selector: 'laamap-variometer-widget',
  templateUrl: './variometer-widget.component.html',
  styleUrls: ['./variometer-widget.component.scss'],
})
export class VariometerWidgetComponent {
  climbingSpeedMs$ = this.store
    .select(instrumentsFeature.selectVarioMeter)
    .pipe(
      switchMap((settings) =>
        this.mapService.geolocation$.pipe(
          auditTime(settings.diffTime),
          startWith(null),
          startWith(null),
          pairwise(),
          map(([prev, curr]) =>
            (curr?.coords.altitude || curr?.coords.altitude === 0) &&
            (prev?.coords.altitude || prev?.coords.altitude === 0)
              ? curr.coords.altitude - prev.coords.altitude
              : null
          ),
          map((altDiff) =>
            altDiff !== null ? (altDiff * 1000) / settings.diffTime : null
          )
        )
      )
    );
  colorsByClimbing$ = combineLatest([
    this.store.select(instrumentsFeature.selectVarioMeter),
    this.climbingSpeedMs$,
  ]).pipe(
    map(
      ([settings, climbingSpeed]) =>
        [
          [...settings.colorsByClimbing]
            .reverse()
            .find((setting) => setting.minClimbing <= (climbingSpeed ?? 0)) ??
            null,
          climbingSpeed,
          settings.position,
        ] as const
    ),
    map(([settings, climbingSpeed, position]) => ({
      position: position,
      bgColor: settings?.bgColor || 'white',
      textColor: settings?.textColor || 'black',
      climbingSpeed,
    }))
  );

  constructor(
    private readonly store: Store,
    private readonly mapService: MapService
  ) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      instrumentsSettings.variometerWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
