import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { iif, switchMap } from 'rxjs';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { selectRadar } from '../../../store/core/core.selectors';
import {
  selectRadarUrlsTypeCoverage,
  selectRadarWithAnimation,
  selectSatelliteWithAnimation,
} from '../../../store/core/rain-viewer.selectors';

@Component({
  selector: 'laamap-on-map-radar',
  templateUrl: './on-map-radar.component.html',
  styleUrls: ['./on-map-radar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapRadarComponent {
  radar$ = this.store.select(selectRadar);
  rainViewerTileUrl$ = this.store.select(selectRadar).pipe(
    switchMap((radar) =>
      iif(
        () => radar.type === 'radar',
        this.store.pipe(selectRadarWithAnimation(this.rainViewer.tileSize)),
        iif(
          () => radar.type === 'satellite',
          this.store.pipe(
            selectSatelliteWithAnimation(this.rainViewer.tileSize)
          ),
          this.store.select(selectRadarUrlsTypeCoverage)
        )
      )
    )
  );

  constructor(public rainViewer: RainViewerService, private store: Store) {}

  radarTileIdentify(
    index: number,
    layer: {
      url: string;
    }
  ): string {
    return layer.url;
  }
}
