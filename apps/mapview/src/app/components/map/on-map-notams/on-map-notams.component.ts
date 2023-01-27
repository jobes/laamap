import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapService, Position } from '@maplibre/ngx-maplibre-gl';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { GeoJSONSource, LngLat } from 'maplibre-gl';
import { filter, map, switchMap, take } from 'rxjs';

import { DataBusService } from '../../../services/data-bus.service';
import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import { INotamDecodedResponse } from '../../../services/notams/notams.interface';
import { NotamsService } from '../../../services/notams/notams.service';
import { selectNonHiddenNotams } from '../../../store/core/core.selectors';
import { NotamsDialogComponent } from '../../notams-dialog/notams-dialog.component';

@Component({
  selector: 'laamap-on-map-notams',
  templateUrl: './on-map-notams.component.html',
  styleUrls: ['./on-map-notams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapNotamsComponent {
  constructor(
    private readonly notams: NotamsService,
    private readonly mapHelper: MapHelperFunctionsService,
    private readonly dataBusService: DataBusService,
    private readonly mapService: MapService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {
    this.dataBusService.geolocation
      .pipe(
        filter((event): event is Position => !!event),
        take(1),
        switchMap((event) =>
          this.notams
            .aroundPointWithCodes$(
              new LngLat(event.coords.longitude, event.coords.latitude),
              100000, // 100km radius
              ['LZBB']
            )
            .pipe(map((notams) => this.notams.notamsToGeoJson(notams)))
        ),
        switchMap((notams) => this.store.select(selectNonHiddenNotams(notams)))
      )
      .subscribe((geoJson) => {
        this.snackBar.open(
          this.translocoService.translate('notams.loaded'),
          undefined,
          {
            duration: 5000,
            politeness: 'polite',
          }
        );

        const source = this.mapService.getSource<GeoJSONSource>('notamsSource');
        source.setData(geoJson as GeoJSON.GeoJSON);
      });
  }

  click(event: {
    features?: Feature<Geometry, GeoJsonProperties>[] | undefined;
  }): void {
    this.dialog.getDialogById('airspaceDialog')?.close();
    const notams = event.features?.map(
      (feature) =>
        this.mapHelper.decodeGeoJsonProperties(
          feature.properties
        ) as INotamDecodedResponse['notamList'][0]
    );

    this.dialog.open(NotamsDialogComponent, {
      width: '100%',
      data: notams?.map((notam) => notam.decoded),
      id: 'notamDialog',
    });
  }
}
