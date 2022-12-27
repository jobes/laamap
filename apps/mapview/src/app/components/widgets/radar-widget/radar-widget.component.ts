import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, iif, map, switchMap } from 'rxjs';
import { RainViewerService } from '../../../services/rain-viewer.service';
import { rainViewersWidgetSettings } from '../../../store/core/core.actions';
import { selectRadar } from '../../../store/core/core.selectors';
import {
  selectRadarWithAnimation,
  selectSatelliteWithAnimation,
} from '../../../store/core/rain-viewer.selectors';

@Component({
  selector: 'laamap-radar-widget',
  templateUrl: './radar-widget.component.html',
  styleUrls: ['./radar-widget.component.scss'],
})
export class RadarWidgetComponent {
  radar$ = this.store.select(selectRadar);

  activeTile$ = this.store.select(selectRadar).pipe(
    switchMap((radar) =>
      iif(
        () => radar.type === 'radar',
        this.store.pipe(selectRadarWithAnimation(this.rainViewer.tileSize)),
        this.store.pipe(selectSatelliteWithAnimation(this.rainViewer.tileSize))
      )
    ),
    map((tiles) => tiles.find((tile) => tile.active))
  );

  activeTileTime$ = this.activeTile$.pipe(
    map((tile) => (tile?.time ?? 0) * 1000),
    distinctUntilChanged()
  );

  activeTilePast$ = this.activeTile$.pipe(
    map((tile) => tile?.past),
    distinctUntilChanged()
  );

  constructor(
    private readonly store: Store,
    private readonly rainViewer: RainViewerService
  ) {}

  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    this.store.dispatch(
      rainViewersWidgetSettings.moved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }
}
