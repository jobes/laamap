import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';
import { IAirSpaceSettings } from '../../../store/core/airspaces-defauls';
import { airspacesSettings } from '../../../store/core/core.actions';
import { selectAirspacesSettingsArray } from '../../../store/core/core.selectors';

@Component({
  selector: 'laamap-airspaces-settings',
  templateUrl: './airspaces-settings.component.html',
  styleUrls: ['./airspaces-settings.component.scss'],
})
export class AirspacesSettingsComponent {
  airSpaces$ = this.store.select(selectAirspacesSettingsArray);

  constructor(private readonly store: Store) {}

  setEnabled(airspaceType: EAirSpaceType, enabled: boolean): void {
    this.store.dispatch(
      airspacesSettings.enabledChanged({ airspaceType, enabled })
    );
  }

  setColor(airspaceType: EAirSpaceType, color: string): void {
    this.store.dispatch(
      airspacesSettings.colorChanged({ airspaceType, color })
    );
  }

  setOpacity(airspaceType: EAirSpaceType, opacity: number): void {
    this.store.dispatch(
      airspacesSettings.opacityChanged({ airspaceType, opacity })
    );
  }

  setMinZoom(airspaceType: EAirSpaceType, minZoom: number): void {
    this.store.dispatch(
      airspacesSettings.minZoomChanged({ airspaceType, minZoom })
    );
  }

  setMaxZoom(airspaceType: EAirSpaceType, maxZoom: number): void {
    this.store.dispatch(
      airspacesSettings.maxZoomChanged({ airspaceType, maxZoom })
    );
  }

  airSpaceTrack(
    index: number,
    obj: IAirSpaceSettings & { id: EAirSpaceType }
  ): EAirSpaceType {
    return obj.id;
  }
}
