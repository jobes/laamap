import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { radarFeature } from '../../../store/features/settings/radar.feature';
import { RadarWidgetComponent } from './radar-widget.component';

describe(RadarWidgetComponent.name, () => {
  it('renders', () => {
    cy.mount(RadarWidgetComponent, {
      providers: [
        {
          provide: RainViewerService,
          useValue: {
            currentAnimationFrame$: of({
              frameNum: 3,
              time: new Date(2023, 2, 2, 14, 25, 36).getTime() / 1000,
              pastTime: true,
            }),
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: radarFeature['selectSettings.radarState'],
              value: {
                enabled: true,
                type: 'radar',
                colorScheme: 0,
                snow: 0,
                smooth: 0,
                animationSpeed: 0,
                opacity: 0.2,
                widget: {
                  enabled: true,
                  position: {
                    x: 10,
                    y: 30,
                  },
                  background: '#00cc00',
                  textColorPast: '#ff0000',
                  textColorFuture: '#0000FF',
                },
              },
            },
          ],
        }),
      ],
    });
    cy.get('.value').contains('14:25');
  });
});
