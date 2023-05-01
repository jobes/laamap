import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { EAirSpaceType } from '../../../services/open-aip/airspaces.interfaces';
import { airspacesSettingsActions } from '../../../store/actions/settings.actions';
import { IAirSpaceSettings } from '../../../store/features/settings/air-spaces-init-value';
import { airSpacesFeature } from '../../../store/features/settings/air-spaces.feature';

@Component({
  selector: 'laamap-airspaces-settings',
  templateUrl: './airspaces-settings.component.html',
  styleUrls: ['./airspaces-settings.component.scss'],
})
export class AirspacesSettingsComponent {
  airSpaces$ = this.store.select(airSpacesFeature.selectAirspacesSettingsArray);
  expanded = false;

  constructor(private readonly store: Store) {}

  setEnabled(airspaceType: EAirSpaceType, enabled: boolean): void {
    this.store.dispatch(
      airspacesSettingsActions.enabledChanged({ airspaceType, enabled })
    );
  }

  setColor(airspaceType: EAirSpaceType, color: string): void {
    this.store.dispatch(
      airspacesSettingsActions.colorChanged({ airspaceType, color })
    );
  }

  setOpacity(airspaceType: EAirSpaceType, opacity: number): void {
    this.store.dispatch(
      airspacesSettingsActions.opacityChanged({ airspaceType, opacity })
    );
  }

  setMinZoom(airspaceType: EAirSpaceType, minZoom: number): void {
    this.store.dispatch(
      airspacesSettingsActions.minZoomChanged({ airspaceType, minZoom })
    );
  }

  airSpaceTrack(
    index: number,
    obj: IAirSpaceSettings & { id: EAirSpaceType }
  ): EAirSpaceType {
    return obj.id;
  }
}
