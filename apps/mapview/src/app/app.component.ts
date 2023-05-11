import { Component } from '@angular/core';

import { AltimeterWidgetComponent } from './components/widgets/altimeter-widget/altimeter-widget.component';
import { NavigationWidgetComponent } from './components/widgets/navigation-widget/navigation-widget.component';
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
    NavigationWidgetComponent,
  ],
})
export class AppComponent {}
