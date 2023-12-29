import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom, isDevMode } from '@angular/core';
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
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import { provideTranslocoLocale } from '@ngneat/transloco-locale';
import { provideTranslocoMessageformat } from '@ngneat/transloco-messageformat';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LightgalleryModule } from 'lightgallery/angular';
import { provideQuillConfig } from 'ngx-quill/config';

import { TranslocoHttpLoader } from './services/transloco-loader.service';
import { MapEffects } from './store/effects/map.effects';
import { NavigationEffects } from './store/effects/navigation.effects';
import { AirSpacesEffects } from './store/effects/settings/air-spaces.effects';
import { GeneralEffects } from './store/effects/settings/general.effects';
import { NotamsSettingsEffects } from './store/effects/settings/notams.effects';
import { RadarSettingsEffects } from './store/effects/settings/radar.effects';
import { mapFeature } from './store/features/map.feature';
import { navigationFeature } from './store/features/navigation.feature';
import { airSpacesFeature } from './store/features/settings/air-spaces.feature';
import { gamepadFeature } from './store/features/settings/gamepad.feature';
import { generalFeature } from './store/features/settings/general.feature';
import { instrumentsFeature } from './store/features/settings/instruments.feature';
import { navigationSettingsFeature } from './store/features/settings/navigation.feature';
import { notamsFeature } from './store/features/settings/notams.feature';
import { radarFeature } from './store/features/settings/radar.feature';
import { metaReducers } from './store/metareducers/hydration';
import { provideServiceWorker } from '@angular/service-worker';
import { terrainFeature } from './store/features/settings/terrain.feature';
import { TerrainEffects } from './store/effects/settings/terrain.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      MatBottomSheetModule,
      MatListModule,
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
      ]),
      StoreDevtoolsModule.instrument({
        maxAge: 500,
        logOnly: isDevMode(),
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
      langToLocaleMapping: {
        en: 'en-US',
        sk: 'sk-SK',
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ['sk', 'en'],
        defaultLang: 'sk',
        prodMode: isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat({ locales: ['en-US', 'sk-SK'] }),
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
