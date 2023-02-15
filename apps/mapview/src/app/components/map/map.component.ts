import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventData, Position } from '@maplibre/ngx-maplibre-gl';
import { MapComponent as NgxMapComponent } from '@maplibre/ngx-maplibre-gl';
import { MapLibreEvent } from 'maplibre-gl';

import { DataBusService } from '../../services/data-bus.service';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

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
    private readonly dataBusService: DataBusService
  ) {}

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
}
