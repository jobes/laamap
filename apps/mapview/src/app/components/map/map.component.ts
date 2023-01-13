import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventData, Position } from '@maplibre/ngx-maplibre-gl';
import { MapLibreEvent } from 'maplibre-gl';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { DataBusService } from '../../services/data-bus.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const AbsoluteOrientationSensor: any;

@Component({
  selector: 'laamap-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  constructor(
    private dialog: MatDialog,
    private readonly dataBusService: DataBusService
  ) {
    this.requestCompassPermission().then((res) => {
      if (res) {
        this.setupCompass()?.start();
      }
    });
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
    this.dataBusService.rawGeolocation.next(event);
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

  private setupCompass(): { start: () => void } | undefined {
    if (`AbsoluteOrientationSensor` in window) {
      const sensor = new AbsoluteOrientationSensor({
        referenceFrame: 'screen',
      });
      sensor.addEventListener(
        'reading',
        (e: { target: { quaternion: number[] } }) => {
          const q = e.target.quaternion;
          const heading =
            Math.atan2(
              2 * q[0] * q[1] + 2 * q[2] * q[3],
              1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]
            ) *
            (-180 / Math.PI);

          document.documentElement.style.setProperty('--heading', `${heading}`);
        }
      );
      return sensor;
    }
    return undefined;
  }
}
