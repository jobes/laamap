import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { AirspacesActivationStateService } from '../../../../services/airspaces-activation-state/airspaces-activation-state.service';
import { EAirSpaceType } from '../../../../services/open-aip/airspaces.interfaces';
import {
  airspacesActivity,
  airspacesSettingsActions,
} from '../../../../store/actions/settings.actions';
import { airSpacesFeature } from '../../../../store/features/settings/air-spaces.feature';

@Component({
  selector: 'laamap-airspaces-settings',
  templateUrl: './airspaces-settings.component.html',
  styleUrls: ['./airspaces-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    PushPipe,
    MatSelectModule,
  ],
})
export class AirspacesSettingsComponent {
  private airspacesActivationStateService = inject(
    AirspacesActivationStateService,
  );
  private store = inject(Store);

  airSpaces = this.store.selectSignal(
    airSpacesFeature.selectAirspacesSettingsArray,
  );
  activationAirspaceList = this.store.selectSignal(
    airSpacesFeature.selectActivationAirspaceList,
  );
  expanded = false;
  availableActivationAirSpaces = this.airspacesActivationStateService.regions;
  airspacesActivity = airspacesActivity;

  setEnabled(airspaceType: EAirSpaceType, enabled: boolean): void {
    this.store.dispatch(
      airspacesSettingsActions.enabledChanged({
        airspaceType,
        enabled,
      }),
    );
  }

  setColor(
    airspaceType: EAirSpaceType,
    color: string,
    activity: (typeof airspacesActivity)[number],
  ): void {
    this.store.dispatch(
      airspacesSettingsActions.colorChanged({
        airspaceType,
        color,
        airspacesActivity: activity,
      }),
    );
  }

  setOpacity(
    airspaceType: EAirSpaceType,
    opacity: number,
    activity: (typeof airspacesActivity)[number],
  ): void {
    this.store.dispatch(
      airspacesSettingsActions.opacityChanged({
        airspaceType,
        opacity,
        airspacesActivity: activity,
      }),
    );
  }

  setMinZoom(airspaceType: EAirSpaceType, minZoom: number): void {
    this.store.dispatch(
      airspacesSettingsActions.minZoomChanged({
        airspaceType,
        minZoom,
      }),
    );
  }

  setActivationAirspaceList(activationAirspaceList: string[]): void {
    this.store.dispatch(
      airspacesSettingsActions.activationAirspaceListChanged({
        activationAirspaceList,
      }),
    );
  }
}
