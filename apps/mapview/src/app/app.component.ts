import { AfterViewInit, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '../environments/environment';
import { CenterIconComponent } from './components/center-icon/center-icon.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { AircraftBarInstrumentWidgetComponent } from './components/widgets/aircraft-bar-instrument-widget/aircraft-bar-instrument-widget.component';
import { AltimeterWidgetComponent } from './components/widgets/altimeter-widget/altimeter-widget.component';
import { GamepadWidgetComponent } from './components/widgets/gamepad-widget/gamepad-widget.component';
import { NavigationGoalWidgetComponent } from './components/widgets/navigation-goal-widget/navigation-goal-widget.component';
import { NavigationNextPointWidgetComponent } from './components/widgets/navigation-next-point-widget/navigation-next-point-widget.component';
import { RadarWidgetComponent } from './components/widgets/radar-widget/radar-widget.component';
import { SpeedMeterWidgetComponent } from './components/widgets/speed-meter-widget/speed-meter-widget.component';
import { TrackingWidgetComponent } from './components/widgets/tracking-widget/tracking-widget.component';
import { VariometerWidgetComponent } from './components/widgets/variometer-widget/variometer-widget.component';
import { account } from './store/actions/init.actions';
import { generalFeature } from './store/features/settings/general.feature';

@Component({
  selector: 'laamap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RadarWidgetComponent,
    SpeedMeterWidgetComponent,
    AltimeterWidgetComponent,
    VariometerWidgetComponent,
    TrackingWidgetComponent,
    NavigationGoalWidgetComponent,
    NavigationNextPointWidgetComponent,
    CenterIconComponent,
    GlobalSearchComponent,
    GamepadWidgetComponent,
    AircraftBarInstrumentWidgetComponent,
  ],
})
export class AppComponent implements AfterViewInit {
  private store = inject(Store);
  ngAfterViewInit(): void {
    window.google.accounts.id.initialize({
      client_id: environment.clientId,
      callback: (response) => {
        const oldEmail = this.store.selectSignal(
          generalFeature.selectLoginObject,
        )().email;
        const newEmail = (
          JSON.parse(atob(response.credential.split('.')[1])) as {
            email: string;
          }
        ).email;
        this.store.dispatch(
          account.loggedIn({
            jwtToken: response.credential,
            userChanged: oldEmail !== newEmail && !oldEmail,
          }),
        );
      },
      use_fedcm_for_prompt: true,
      auto_select: true,
    });

    const token = this.store.selectSignal(generalFeature.selectLoginToken)();
    if (!token) {
      window.google.accounts.id.prompt(); // prompt login only if user is not yet logged in
    }
  }
}
