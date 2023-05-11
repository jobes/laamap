import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  auditTime,
  combineLatest,
  map,
  pairwise,
  startWith,
  switchMap,
} from 'rxjs';

import { varioMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-variometer-widget',
  templateUrl: './variometer-widget.component.html',
  styleUrls: ['./variometer-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetModule,
    NgIf,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
  ],
})
export class VariometerWidgetComponent {
  show$ = this.store.select(mapFeature.selectShowInstruments);
  private climbingSpeedMs$ = this.store
    .select(instrumentsFeature.selectVarioMeter)
    .pipe(
      switchMap((settings) =>
        this.store.select(mapFeature.selectGeoLocation).pipe(
          auditTime(settings.diffTime),
          startWith(null),
          startWith(null),
          pairwise(),
          map(([prev, curr]) =>
            (curr?.coords.altitude || curr?.coords.altitude === 0) &&
            (prev?.coords.altitude || prev?.coords.altitude === 0)
              ? {
                  altDiff: curr.coords.altitude - prev.coords.altitude,
                  timeDiff: curr.timestamp - prev.timestamp,
                }
              : null
          ),
          map((diffs) =>
            diffs !== null ? (diffs.altDiff * 1000) / diffs.timeDiff : null
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

  constructor(private readonly store: Store) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      varioMeterWidgetActions.positionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
