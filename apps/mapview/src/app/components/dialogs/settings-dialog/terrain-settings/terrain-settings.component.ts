import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { terrainSettingsActions } from '../../../../store/actions/settings.actions';
import { terrainFeature } from '../../../../store/features/settings/terrain.feature';

@Component({
  selector: 'laamap-terrain-settings',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    TranslocoModule,
    LetDirective,
    PushPipe,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './terrain-settings.component.html',
  styleUrls: ['./terrain-settings.component.scss'],
})
export class TerrainSettingsComponent {
  private readonly store = inject(Store);
  enabled$ = this.store.select(terrainFeature.selectEnabled);
  exaggeration$ = this.store.select(terrainFeature.selectExaggeration);
  gndHeightCalculateUsingTerrain$ = this.store.select(
    terrainFeature.selectGndHeightCalculateUsingTerrain,
  );

  enableTerrain(enabled: boolean): void {
    this.store.dispatch(terrainSettingsActions.enabledChanged({ enabled }));
  }

  gndHeightCalculateUsingTerrain(enabled: boolean): void {
    this.store.dispatch(
      terrainSettingsActions.gndHeightCalculateUsingTerrainChanged({ enabled }),
    );
  }

  exaggeration(exaggeration: number): void {
    this.store.dispatch(
      terrainSettingsActions.exaggerationChanged({ exaggeration }),
    );
  }
}
