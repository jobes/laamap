import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
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

import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
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
    LetDirective,
    NgIf,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
  ],
})
export class VariometerWidgetComponent {
  @ViewChildren(CdkDrag, { read: ElementRef })
  readonly containers!: QueryList<ElementRef<HTMLElement>>;
  private readonly safePositionService = inject(WidgetSafePositionService);
  show$ = this.store.select(mapFeature.selectShowInstruments);
  private varioMeterSettings$ = this.store.select(
    instrumentsFeature.selectVarioMeter,
  );
  private climbingSpeedMs$ = this.varioMeterSettings$.pipe(
    switchMap((settings) =>
      this.store.select(mapFeature.selectGeoLocation).pipe(
        auditTime(settings.diffTime),
        startWith(null),
        startWith(null),
        pairwise(),
        // eslint-disable-next-line @ngrx/avoid-mapping-selectors
        map(([prev, curr]) =>
          (curr?.coords.altitude || curr?.coords.altitude === 0) &&
          (prev?.coords.altitude || prev?.coords.altitude === 0)
            ? {
                altDiff: curr.coords.altitude - prev.coords.altitude,
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
    this,
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
