import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { MapService } from '../../services/map/map.service';
import { mapFeature } from '../../store/map/map.feature';
import { navigationFeature } from '../../store/settings/navigation/navigation.feature';

const selectLineDefinition = (
  mapService: MapService,
  mapHelperFunctionsService: MapHelperFunctionsService
) =>
  createSelector(
    mapFeature.selectMinSpeedHit,
    mapFeature.selectGeoLocation,
    navigationFeature.selectDirectionLineSegmentSeconds,
    navigationFeature.selectDirectionLineSegmentCount,
    mapFeature.selectCenter,
    (enabled, geolocation, segmentInSeconds, segmentCount) =>
      !enabled ||
      !geolocation?.coords.longitude ||
      !geolocation?.coords.latitude
        ? null
        : {
            segmentSize: mapHelperFunctionsService.metersToPixels(
              (geolocation.coords.speed ?? 0) * segmentInSeconds
            ),
            segmentsArray: Array.from(Array(segmentCount).keys()),
            heading: geolocation.coords.heading,
            currentPxPosition: mapService.instance.project([
              geolocation.coords.longitude,
              geolocation.coords.latitude,
            ]),
          }
  );

@Component({
  selector: 'laamap-on-map-direction-line',
  templateUrl: './on-map-direction-line.component.html',
  styleUrls: ['./on-map-direction-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapDirectionLineComponent {
  ds$ = this.store.select(
    selectLineDefinition(this.mapService, this.mapHelperFunctionsService)
  );

  constructor(
    private readonly store: Store,
    private readonly mapHelperFunctionsService: MapHelperFunctionsService,
    private readonly mapService: MapService
  ) {}

  trackBy(index: number, value: number) {
    return value;
  }
}
