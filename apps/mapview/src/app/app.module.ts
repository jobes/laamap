import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import { LetModule, PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LightgalleryModule } from 'lightgallery/angular';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AirportDialogComponent } from './components/airport-dialog/airport-dialog.component';
import { AirspacesDialogComponent } from './components/airspaces-dialog/airspaces-dialog.component';
import { NotamsDialogComponent } from './components/notams-dialog/notams-dialog.component';
import { OnMapDirectionLineComponent } from './components/on-map-direction-line/on-map-direction-line.component';
import { AirspacesSettingsComponent } from './components/settings-dialog/airspaces-settings/airspaces-settings.component';
import { GeneralSettingsComponent } from './components/settings-dialog/general-settings/general-settings.component';
import { AltitudeWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/altitude-widget-settings/altitude-widget-settings.component';
import { InstrumentsSettingsComponent } from './components/settings-dialog/instruments-settings/instruments-settings.component';
import { SpeedWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/speed-widget-settings/speed-widget-settings.component';
import { VarioWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/vario-widget-settings/vario-widget-settings.component';
import { NavigationSettingsComponent } from './components/settings-dialog/navigation-settings/navigation-settings.component';
import { RadarSettingsComponent } from './components/settings-dialog/radar-settings/radar-settings.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { AltimeterWidgetComponent } from './components/widgets/altimeter-widget/altimeter-widget.component';
import { RadarWidgetComponent } from './components/widgets/radar-widget/radar-widget.component';
import { SpeedMeterWidgetComponent } from './components/widgets/speed-meter-widget/speed-meter-widget.component';
import { VariometerWidgetComponent } from './components/widgets/variometer-widget/variometer-widget.component';
import { AltitudePipe } from './pipes/altitude/altitude.pipe';
import { DimensionPipe } from './pipes/dimension/dimension.pipe';
import { MapEffects } from './store/map/map.effects';
import { mapFeature } from './store/map/map.feature';
import { metaReducers } from './store/metareducers/hydration';
import { AirSpacesEffects } from './store/settings/air-spaces/air-spaces.effects';
import { airSpacesFeature } from './store/settings/air-spaces/air-spaces.feature';
import { GeneralEffects } from './store/settings/general/general.effects';
import { generalFeature } from './store/settings/general/general.feature';
import { instrumentsFeature } from './store/settings/instruments/instruments.feature';
import { navigationFeature } from './store/settings/navigation/navigation.feature';
import { NotamsSettingsEffects } from './store/settings/notams/notams.effects';
import { notamsFeature } from './store/settings/notams/notams.feature';
import { RadarSettingsEffects } from './store/settings/radar/radar.effects';
import { radarFeature } from './store/settings/radar/radar.feature';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [
    AppComponent,
    SettingsDialogComponent,
    RadarSettingsComponent,
    RadarWidgetComponent,
    AirportDialogComponent,
    AltitudePipe,
    DimensionPipe,
    AirspacesDialogComponent,
    AirspacesSettingsComponent,
    NotamsDialogComponent,
    GeneralSettingsComponent,
    NavigationSettingsComponent,
    OnMapDirectionLineComponent,
    SpeedMeterWidgetComponent,
    InstrumentsSettingsComponent,
    AltimeterWidgetComponent,
    SpeedWidgetSettingsComponent,
    AltitudeWidgetSettingsComponent,
    VarioWidgetSettingsComponent,
    VariometerWidgetComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslocoRootModule,
    TranslocoLocaleModule.forRoot({
      langToLocaleMapping: {
        en: 'en-US',
        sk: 'sk-SK',
      },
    }),
    TranslocoMessageFormatModule.forRoot({ locales: ['en-US', 'sk-SK'] }),
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    DragDropModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule,
    LetModule,
    PushModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot(
      {
        [mapFeature.name]: mapFeature.reducer,
        [notamsFeature.name]: notamsFeature.reducer,
        [radarFeature.name]: radarFeature.reducer,
        [navigationFeature.name]: navigationFeature.reducer,
        [airSpacesFeature.name]: airSpacesFeature.reducer,
        [instrumentsFeature.name]: instrumentsFeature.reducer,
        [generalFeature.name]: generalFeature.reducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
        metaReducers,
      }
    ),
    EffectsModule.forRoot([
      MapEffects,
      NotamsSettingsEffects,
      RadarSettingsEffects,
      AirSpacesEffects,
      GeneralEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 500,
      logOnly: environment.production,
    }),
    LightgalleryModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation) =>
        platformLocation.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
