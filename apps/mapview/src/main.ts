/* eslint-disable no-console */
import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
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
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import { LetModule, PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LightgalleryModule } from 'lightgallery/angular';

import { AppComponent } from './app/app.component';
import { MapEffects } from './app/store/effects/map.effects';
import { AirSpacesEffects } from './app/store/effects/settings/air-spaces.effects';
import { GeneralEffects } from './app/store/effects/settings/general.effects';
import { NotamsSettingsEffects } from './app/store/effects/settings/notams.effects';
import { RadarSettingsEffects } from './app/store/effects/settings/radar.effects';
import { mapFeature } from './app/store/features/map.feature';
import { NavigationEffects } from './app/store/features/navigation.effects';
import { navigationFeature } from './app/store/features/navigation.feature';
import { airSpacesFeature } from './app/store/features/settings/air-spaces.feature';
import { generalFeature } from './app/store/features/settings/general.feature';
import { instrumentsFeature } from './app/store/features/settings/instruments.feature';
import { navigationSettingsFeature } from './app/store/features/settings/navigation.feature';
import { notamsFeature } from './app/store/features/settings/notams.feature';
import { radarFeature } from './app/store/features/settings/radar.feature';
import { metaReducers } from './app/store/metareducers/hydration';
import { TranslocoRootModule } from './app/transloco-root.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
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
      LightgalleryModule
    ),
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation) =>
        platformLocation.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter([]),
  ],
}).catch((err) => console.error(err));
