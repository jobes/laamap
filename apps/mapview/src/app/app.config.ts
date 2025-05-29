import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LightgalleryModule } from 'lightgallery/angular';
import { provideQuillConfig } from 'ngx-quill/config';

import {
  TranslocoHttpLoader,
  activeLang,
  languages,
} from './services/transloco-loader.service';
import { InstrumentsEffects } from './store/effects/instruments.effects';
import { MapEffects } from './store/effects/map.effects';
import { NavigationEffects } from './store/effects/navigation.effects';
import { AirSpacesEffects } from './store/effects/settings/air-spaces.effects';
import { GeneralEffects } from './store/effects/settings/general.effects';
import { NotamsSettingsEffects } from './store/effects/settings/notams.effects';
import { RadarSettingsEffects } from './store/effects/settings/radar.effects';
import { TerrainEffects } from './store/effects/settings/terrain.effects';
import { TrafficEffects } from './store/effects/traffic.effects';
import { mapFeature } from './store/features/map.feature';
import { navigationFeature } from './store/features/navigation.feature';
import { planeInstrumentsFeature } from './store/features/plane-instruments.feature';
import { airSpacesFeature } from './store/features/settings/air-spaces.feature';
import { gamepadFeature } from './store/features/settings/gamepad.feature';
import { generalFeature } from './store/features/settings/general.feature';
import { instrumentsFeature } from './store/features/settings/instruments.feature';
import { navigationSettingsFeature } from './store/features/settings/navigation.feature';
import { notamsFeature } from './store/features/settings/notams.feature';
import { radarFeature } from './store/features/settings/radar.feature';
import { terrainFeature } from './store/features/settings/terrain.feature';
import { trafficFeature } from './store/features/settings/traffic.feature';
import { metaReducers } from './store/metareducers/hydration';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      DragDropModule,
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
          [gamepadFeature.name]: gamepadFeature.reducer,
          [terrainFeature.name]: terrainFeature.reducer,
          [trafficFeature.name]: trafficFeature.reducer,
          [planeInstrumentsFeature.name]: planeInstrumentsFeature.reducer,
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
        },
      ),
      EffectsModule.forRoot([
        MapEffects,
        NavigationEffects,
        NotamsSettingsEffects,
        RadarSettingsEffects,
        AirSpacesEffects,
        GeneralEffects,
        TerrainEffects,
        InstrumentsEffects,
        TrafficEffects,
      ]),
      StoreDevtoolsModule.instrument({
        maxAge: 500,
        logOnly: isDevMode(),
        connectInZone: true,
      }),
      LightgalleryModule,
    ),
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation) =>
        platformLocation.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    provideTranslocoLocale({
      langToLocaleMapping: languages,
    }),
    provideTransloco({
      config: {
        availableLangs: Object.keys(languages),
        defaultLang: activeLang,
        prodMode: isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat({ locales: Object.values(languages) }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter([]),
    provideQuillConfig({}),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
