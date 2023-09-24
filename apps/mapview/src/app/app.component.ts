import { Component } from '@angular/core';

import { CenterIconComponent } from './components/center-icon/center-icon.component';
import { AltimeterWidgetComponent } from './components/widgets/altimeter-widget/altimeter-widget.component';
import { NavigationGoalWidgetComponent } from './components/widgets/navigation-goal-widget/navigation-goal-widget.component';
import { NavigationNextPointWidgetComponent } from './components/widgets/navigation-next-point-widget/navigation-next-point-widget.component';
import { RadarWidgetComponent } from './components/widgets/radar-widget/radar-widget.component';
import { SpeedMeterWidgetComponent } from './components/widgets/speed-meter-widget/speed-meter-widget.component';
import { TrackingWidgetComponent } from './components/widgets/tracking-widget/tracking-widget.component';
import { VariometerWidgetComponent } from './components/widgets/variometer-widget/variometer-widget.component';

@Component({
  selector: 'laamap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RadarWidgetComponent,
    SpeedMeterWidgetComponent,
    AltimeterWidgetComponent,
    VariometerWidgetComponent,
    TrackingWidgetComponent,
    NavigationGoalWidgetComponent,
    NavigationNextPointWidgetComponent,
    CenterIconComponent,
  ],
})
export class AppComponent {}
