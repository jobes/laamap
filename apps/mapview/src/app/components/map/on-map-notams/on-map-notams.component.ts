import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, map, switchMap, take } from 'rxjs';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { DataBusService } from '../../../services/data-bus.service';
import { MapHelperFunctionsService } from '../../../services/map-helper-functions/map-helper-functions.service';
import { NotamsService } from '../../../services/notams/notams.service';
import { GeoJSONSource, LngLat } from 'maplibre-gl';
import { INotamDecodedResponse } from '../../../services/notams/notams.interface';
import { MapService, Position } from '@maplibre/ngx-maplibre-gl';

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
    private readonly mapService: MapService
  ) {
    this.dataBusService.geolocation
      .pipe(
        filter((event): event is Position => !!event),
        take(1),
        switchMap((event) =>
          this.notams
            .aroundPointWithFir$(
              new LngLat(event.coords.longitude, event.coords.latitude),
              100000 // 100km radius
            )
            .pipe(map((notams) => this.notams.notamsToGeoJson(notams)))
        )
      )
      .subscribe((geoJson) => {
        const source = this.mapService.getSource<GeoJSONSource>('notamsSource');
        source.setData(geoJson as GeoJSON.GeoJSON);
      });
  }

  click(event: {
    features?: Feature<Geometry, GeoJsonProperties>[] | undefined;
  }): void {
    const notams = event.features?.map(
      (feature) =>
        this.mapHelper.decodeGeoJsonProperties(
          feature.properties
        ) as INotamDecodedResponse['notamList'][0]
    );
    console.log(
      notams?.map((n) => ({ issuer: n.decoded.issuer, msg: n.decoded.msg }))
    );
  }
}
