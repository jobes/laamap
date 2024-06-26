import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { EAirSpaceType } from '../../../../services/open-aip/airspaces.interfaces';
import { airspacesSettingsActions } from '../../../../store/actions/settings.actions';
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
  ],
})
export class AirspacesSettingsComponent {
  airSpaces$ = this.store.select(airSpacesFeature.selectAirspacesSettingsArray);
  expanded = false;

  constructor(private readonly store: Store) {}

  setEnabled(airspaceType: EAirSpaceType, enabled: boolean): void {
    this.store.dispatch(
      airspacesSettingsActions.enabledChanged({ airspaceType, enabled }),
    );
  }

  setColor(airspaceType: EAirSpaceType, color: string): void {
    this.store.dispatch(
      airspacesSettingsActions.colorChanged({ airspaceType, color }),
    );
  }

  setOpacity(airspaceType: EAirSpaceType, opacity: number): void {
    this.store.dispatch(
      airspacesSettingsActions.opacityChanged({ airspaceType, opacity }),
    );
  }

  setMinZoom(airspaceType: EAirSpaceType, minZoom: number): void {
    this.store.dispatch(
      airspacesSettingsActions.minZoomChanged({ airspaceType, minZoom }),
    );
  }
}
