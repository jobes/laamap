import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  auditTime,
  combineLatest,
  map,
  pairwise,
  startWith,
  switchMap,
} from 'rxjs';

import { altitudeFromPressure } from '../../../helper';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { varioMeterWidgetActions } from '../../../store/actions/widgets.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-variometer-widget',
  templateUrl: './variometer-widget.component.html',
  styleUrls: ['./variometer-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetDirective,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
  ],
})
export class VariometerWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
  private readonly safePositionService = inject(WidgetSafePositionService);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  private varioMeterSettings$ = this.store.select(
    instrumentsFeature.selectVarioMeter,
  );

  private altitude$ = combineLatest([
    this.store.select(instrumentsFeature.selectVarioMeter),
    this.store.select(instrumentsFeature.selectAltimeter),
    this.store.select(planeInstrumentsFeature.selectAirPressure),
    this.store.select(mapFeature.selectGeoLocation),
  ]).pipe(
    map(([varioSetting, altimeterSettings, pressure, location]) =>
      varioSetting.source === 'pressure' && pressure && altimeterSettings.qnh
        ? {
            altitude: altitudeFromPressure(
              pressure ?? 0,
              altimeterSettings.qnh,
            ),
            timestamp: new Date().getTime(),
          }
        : {
            altitude: location?.coords.altitude,
            timestamp: location?.timestamp ?? new Date().getTime(),
          },
    ),
  );

  private climbingSpeedMs$ = this.varioMeterSettings$.pipe(
    switchMap((settings) =>
      this.altitude$.pipe(
        auditTime(settings.diffTime),
        startWith(null),
        startWith(null),
        pairwise(),
        map(([prev, curr]) =>
          (curr?.altitude || curr?.altitude === 0) &&
          (prev?.altitude || prev?.altitude === 0)
            ? {
                altDiff: curr.altitude - prev.altitude,
                timeDiff: curr.timestamp - prev.timestamp,
              }
            : null,
        ),
        map((diffs) =>
          diffs !== null ? (diffs.altDiff * 1000) / diffs.timeDiff : null,
        ),
      ),
    ),
  );

  colorsByClimbing$ = combineLatest([
    this.varioMeterSettings$,
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
        ] as const,
    ),
    map(([settings, climbingSpeed]) => ({
      bgColor: settings?.bgColor || 'white',
      textColor: settings?.textColor || 'black',
      climbingSpeed,
    })),
  );

  safePosition$ = this.safePositionService.safePosition$(
    this.varioMeterSettings$.pipe(map((val) => val.position)),
    toObservable(this.containers),
  );

  constructor(private readonly store: Store) {}

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      varioMeterWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
