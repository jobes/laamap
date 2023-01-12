import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { TranslocoRootModule } from './shared/transloco-root.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { StoreModule } from '@ngrx/store';
import { coreReducer } from './store/core/core.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { metaReducers } from './store/metareducers/hydratation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { RadarSettingsComponent } from './components/settings-dialog/radar-settings/radar-settings.component';
import { OnMapRadarComponent } from './components/map/on-map-radar/on-map-radar.component';
import { CoreEffects } from './store/core/core.effects';
import { EffectsModule } from '@ngrx/effects';
import { RadarWidgetComponent } from './components/widgets/radar-widget/radar-widget.component';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { OnMapAirportComponent } from './components/map/on-map-airport/on-map-airport.component';
import { AirportDialogComponent } from './components/airport-dialog/airport-dialog.component';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import { AltitudePipe } from './shared/altitude/altitude.pipe';
import { LightgalleryModule } from 'lightgallery/angular';
import { DimensionPipe } from './shared/dimension/dimension.pipe';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { OnMapAirSpacesComponent } from './components/map/on-map-air-spaces/on-map-air-spaces.component';
import { AirspacesDialogComponent } from './components/airspaces-dialog/airspaces-dialog.component';
import { AirspacesSettingsComponent } from './components/settings-dialog/airspaces-settings/airspaces-settings.component';
import { OnMapNotamsComponent } from './components/map/on-map-notams/on-map-notams.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SettingsDialogComponent,
    RadarSettingsComponent,
    OnMapRadarComponent,
    RadarWidgetComponent,
    OnMapAirportComponent,
    AirportDialogComponent,
    AltitudePipe,
    DimensionPipe,
    OnMapAirSpacesComponent,
    AirspacesDialogComponent,
    AirspacesSettingsComponent,
    OnMapNotamsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMapLibreGLModule,
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
    LetModule,
    PushModule,
    StoreModule.forRoot(
      { core: coreReducer },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: false,
          strictActionTypeUniqueness: true,
        },
        metaReducers,
      }
    ),
    EffectsModule.forRoot([CoreEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
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
