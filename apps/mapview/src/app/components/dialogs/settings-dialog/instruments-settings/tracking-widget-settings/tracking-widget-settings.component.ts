import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { trackingSettingsActions } from '../../../../../store/actions/settings.actions';
import { instrumentsFeature } from '../../../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-tracking-widget-settings',
  templateUrl: './tracking-widget-settings.component.html',
  styleUrls: ['./tracking-widget-settings.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    PushPipe,
  ],
})
export class TrackingWidgetSettingsComponent {
  private readonly store = inject(Store);
  settings$ = this.store.select(instrumentsFeature.selectTracking);

  activeBgColorChanged(activeBg: string): void {
    this.store.dispatch(
      trackingSettingsActions.activeBgColorChanged({ activeBg }),
    );
  }

  activeTextColorChanged(activeText: string): void {
    this.store.dispatch(
      trackingSettingsActions.activeTextColorChanged({ activeText }),
    );
  }

  inactiveBgColorChanged(inactiveBg: string): void {
    this.store.dispatch(
      trackingSettingsActions.inactiveBgColorChanged({ inactiveBg }),
    );
  }

  inactiveTextColorChanged(inactiveText: string): void {
    this.store.dispatch(
      trackingSettingsActions.inactiveTextColorChanged({ inactiveText }),
    );
  }
}
