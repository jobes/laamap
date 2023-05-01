import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
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
import { FlyTracingHistoryDialogComponent } from './components/fly-tracing-history-dialog/fly-tracing-history-dialog.component';
import { MapLocationMenuComponent } from './components/map-location-menu/map-location-menu.component';
import { NavigationDialogComponent } from './components/navigation-dialog/navigation-dialog.component';
import { NotamsDialogComponent } from './components/notams-dialog/notams-dialog.component';
import { AirspacesSettingsComponent } from './components/settings-dialog/airspaces-settings/airspaces-settings.component';
import { GeneralSettingsComponent } from './components/settings-dialog/general-settings/general-settings.component';
import { AltitudeWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/altitude-widget-settings/altitude-widget-settings.component';
import { InstrumentsSettingsComponent } from './components/settings-dialog/instruments-settings/instruments-settings.component';
import { SpeedWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/speed-widget-settings/speed-widget-settings.component';
import { TrackingWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/tracking-widget-settings/tracking-widget-settings.component';
import { VarioWidgetSettingsComponent } from './components/settings-dialog/instruments-settings/vario-widget-settings/vario-widget-settings.component';
import { NavigationSettingsComponent } from './components/settings-dialog/navigation-settings/navigation-settings.component';
import { RadarSettingsComponent } from './components/settings-dialog/radar-settings/radar-settings.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { AltimeterWidgetComponent } from './components/widgets/altimeter-widget/altimeter-widget.component';
import { NavigationWidgetComponent } from './components/widgets/navigation-widget/navigation-widget.component';
import { RadarWidgetComponent } from './components/widgets/radar-widget/radar-widget.component';
import { SpeedMeterWidgetComponent } from './components/widgets/speed-meter-widget/speed-meter-widget.component';
import { TrackingWidgetComponent } from './components/widgets/tracking-widget/tracking-widget.component';
import { VariometerWidgetComponent } from './components/widgets/variometer-widget/variometer-widget.component';
import { AltitudePipe } from './pipes/altitude/altitude.pipe';
import { DigitalTimePipe } from './pipes/digital-time/digital-time.pipe';
import { DimensionPipe } from './pipes/dimension/dimension.pipe';
import { MapEffects } from './store/effects/map.effects';
import { AirSpacesEffects } from './store/effects/settings/air-spaces.effects';
import { GeneralEffects } from './store/effects/settings/general.effects';
import { NotamsSettingsEffects } from './store/effects/settings/notams.effects';
import { RadarSettingsEffects } from './store/effects/settings/radar.effects';
import { mapFeature } from './store/features/map.feature';
import { NavigationEffects } from './store/features/navigation.effects';
import { navigationFeature } from './store/features/navigation.feature';
import { airSpacesFeature } from './store/features/settings/air-spaces.feature';
import { generalFeature } from './store/features/settings/general.feature';
import { instrumentsFeature } from './store/features/settings/instruments.feature';
import { navigationSettingsFeature } from './store/features/settings/navigation.feature';
import { notamsFeature } from './store/features/settings/notams.feature';
import { radarFeature } from './store/features/settings/radar.feature';
import { metaReducers } from './store/metareducers/hydration';
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
    SpeedMeterWidgetComponent,
    InstrumentsSettingsComponent,
    AltimeterWidgetComponent,
    SpeedWidgetSettingsComponent,
    AltitudeWidgetSettingsComponent,
    VarioWidgetSettingsComponent,
    VariometerWidgetComponent,
    TrackingWidgetComponent,
    TrackingWidgetSettingsComponent,
    FlyTracingHistoryDialogComponent,
    DigitalTimePipe,
    MapLocationMenuComponent,
    NavigationWidgetComponent,
    NavigationDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatBottomSheetModule,
    MatListModule,
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
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    DragDropModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSliderModule,
    MatSnackBarModule,
    LetModule,
    PushModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot(
      {
        [mapFeature.name]: mapFeature.reducer,
        [navigationFeature.name]: navigationFeature.reducer,
        [notamsFeature.name]: notamsFeature.reducer,
        [radarFeature.name]: radarFeature.reducer,
        [navigationSettingsFeature.name]: navigationSettingsFeature.reducer,
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
      NavigationEffects,
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
