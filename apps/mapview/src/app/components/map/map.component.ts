import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventData, Position } from '@maplibre/ngx-maplibre-gl';
import { MapComponent as NgxMapComponent } from '@maplibre/ngx-maplibre-gl';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MapLibreEvent } from 'maplibre-gl';
import { combineLatest, filter, map, take } from 'rxjs';

import { DataBusService } from '../../services/data-bus.service';
import { LoggerService } from '../../services/logger/logger.service';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

declare class AbsoluteOrientationSensor {
  constructor(param: { referenceFrame: 'screen' });
  addEventListener(
    eventName: 'reading',
    eventValue: (param: { target: { quaternion: number[] } }) => void
  ): void;
  start(): void;
}

@UntilDestroy()
@Component({
  selector: 'laamap-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @ViewChild(NgxMapComponent) map!: NgxMapComponent;

  tileStyleUrl = `https://api.maptiler.com/maps/topo-v2/style.json?key=${
    process.env['NX_MAP_TILES_KEY'] ?? 'MISSING_KEY'
  }`;

  constructor(
    private dialog: MatDialog,
    private readonly dataBusService: DataBusService,
    private readonly logger: LoggerService
  ) {
    this.requestCompassPermission()
      .then((res) => {
        if (res) {
          this.setupCompass()?.start();
        }
      })
      .catch(() => {
        this.logger.logErrorMsg(
          'mapComponent compass permission',
          'Can not get permission for using compass'
        );
      });
    this.setupGpsHeading();
  }

  openSettingsDialog(): void {
    this.dialog
      .open(SettingsDialogComponent, { width: '100%', id: 'settingDialog' })
      .afterClosed();
  }

  rotate(
    event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & EventData
  ): void {
    document.documentElement.style.setProperty(
      '--bearing',
      `${event.target.getBearing()}`
    );
  }

  geolocate(event: Position): void {
    this.dataBusService.setGeoLocation(event);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataBusService.setMap(this.map.mapInstance);
    }, 0);
  }

  private async requestCompassPermission(): Promise<boolean> {
    const results = await Promise.all([
      navigator.permissions?.query({ name: 'accelerometer' as never }),
      navigator.permissions?.query({ name: 'magnetometer' as never }),
      navigator.permissions?.query({ name: 'gyroscope' as never }),
    ]);
    const result = results.every((result) =>
      result ? result.state === 'granted' : true
    );
    return result;
  }

  private setupGpsHeading(): void {
    combineLatest([
      this.dataBusService.navigationMinSpeedHit$,
      this.dataBusService.geolocation$,
    ])
      .pipe(
        filter(
          ([enabled, geoLocation]) =>
            enabled &&
            (!!geoLocation?.coords.heading || geoLocation?.coords.heading === 0)
        ),
        map(([, geoLocation]) => geoLocation?.coords.heading ?? 0),
        untilDestroyed(this)
      )
      .subscribe({
        next: (heading) => {
          document.documentElement.style.setProperty('--heading', `${heading}`);
        },
      });
  }

  private setupCompass(): AbsoluteOrientationSensor | undefined {
    if (`AbsoluteOrientationSensor` in window) {
      const sensor = new AbsoluteOrientationSensor({
        referenceFrame: 'screen',
      });
      sensor.addEventListener('reading', (e) => {
        this.dataBusService.navigationMinSpeedHit$.pipe(take(1)).subscribe({
          next: (disableCompass) => {
            if (disableCompass) {
              return;
            }
            const q = e.target.quaternion;
            const heading =
              Math.atan2(
                2 * q[0] * q[1] + 2 * q[2] * q[3],
                1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]
              ) *
              (-180 / Math.PI);

            document.documentElement.style.setProperty(
              '--heading',
              `${heading}`
            );
          },
        });
      });
      return sensor;
    }
    return undefined;
  }
}
