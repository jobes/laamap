import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@jsverse/transloco';

import { AirspacesSettingsComponent } from './airspaces-settings/airspaces-settings.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { GamepadSettingsComponent } from './gamepad-settings/gamepad-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { InstrumentsSettingsComponent } from './instruments-settings/instruments-settings.component';
import { NavigationSettingsComponent } from './navigation-settings/navigation-settings.component';
import { RadarSettingsComponent } from './radar-settings/radar-settings.component';
import { TerrainSettingsComponent } from './terrain-settings/terrain-settings.component';
import { TrafficSettingsComponent } from './traffic-settings/traffic-settings.component';

@Component({
  selector: 'laamap-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    GeneralSettingsComponent,
    AirspacesSettingsComponent,
    NavigationSettingsComponent,
    InstrumentsSettingsComponent,
    RadarSettingsComponent,
    GamepadSettingsComponent,
    MatButtonModule,
    ContactMeComponent,
    TerrainSettingsComponent,
    TrafficSettingsComponent,
  ],
})
export class SettingsDialogComponent {}
