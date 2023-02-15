import { ChangeDetectionStrategy, Component } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';

import { DataBusService } from '../../../services/data-bus.service';
import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import {
  selectNavigationDirectionLineSegmentCount,
  selectNavigationDirectionLineSegmentSeconds,
} from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-on-map-direction-line',
  templateUrl: './on-map-direction-line.component.html',
  styleUrls: ['./on-map-direction-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapDirectionLineComponent {
  ds$ = combineLatest([
    this.dataBusService.navigationMinSpeedHit$,
    this.dataBusService.geolocation$,
    this.dataBusService.mapMoved$,
  ]).pipe(
    concatLatestFrom(() =>
      this.store.select(selectNavigationDirectionLineSegmentSeconds)
    ),
    concatLatestFrom(() =>
      this.store.select(selectNavigationDirectionLineSegmentCount)
    ),
    map(([[[enabled, geolocation], segmentInSeconds], segmentCount]) =>
      !enabled ||
      !geolocation?.coords.longitude ||
      !geolocation?.coords.latitude
        ? null
        : {
            segmentSize: this.mapHelperFunctionsService.metersToPixels(
              (geolocation.coords.speed ?? 0) * segmentInSeconds
            ),
            segmentsArray: Array.from(Array(segmentCount).keys()),
            heading: geolocation.coords.heading,
            currentPxPosition: this.dataBusService
              .getMap()
              ?.project([
                geolocation.coords.longitude,
                geolocation.coords.latitude,
              ]),
          }
    )
  );

  constructor(
    private readonly dataBusService: DataBusService,
    private readonly store: Store,
    private readonly mapHelperFunctionsService: MapHelperFunctionsService
  ) {}

  trackBy(index: number, value: number) {
    return value;
  }
}
