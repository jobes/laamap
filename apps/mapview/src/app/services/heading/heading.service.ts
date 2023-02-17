import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';

import { LoggerService } from '../logger/logger.service';
import { MapService } from '../map/map.service';
import { NavigationService } from '../navigation/navigation.service';

declare class AbsoluteOrientationSensor {
  constructor(param: { referenceFrame: 'screen' });
  addEventListener(
    eventName: 'reading',
    eventValue: (param: { target: { quaternion: number[] } }) => void
  ): void;
  start(): void;
}

@Injectable({
  providedIn: 'root',
})
export class HeadingService {
  heading$: Observable<number>;
  private compassHeadingSubj$ = new BehaviorSubject(0);
  private gpsHeading$ = this.mapService.geolocation$.pipe(
    filter((geoLocation) => !isNaN(geoLocation?.coords.heading as number)),
    map((geoLocation): number => geoLocation?.coords.heading ?? 0)
  );

  constructor(
    private readonly mapService: MapService,
    private readonly navigationService: NavigationService,
    private readonly logger: LoggerService
  ) {
    this.initCompass();

    this.heading$ = combineLatest([
      this.compassHeadingSubj$,
      this.gpsHeading$,
      this.navigationService.navigationMinSpeedHit$,
    ]).pipe(
      map(([compass, gps, minSpeedHit]) => (minSpeedHit ? gps : compass))
    );
  }

  private initCompass(): void {
    this.requestCompassPermission()
      .then((res) => {
        if (res) {
          this.setupCompass()?.start();
        }
      })
      .catch(() => {
        this.logger.logErrorMsg(
          'mapComponent compass permission',
          'Can not get permission for using compass'
        );
      });
  }

  private async requestCompassPermission(): Promise<boolean> {
    const results = await Promise.all([
      navigator.permissions?.query({ name: 'accelerometer' as never }),
      navigator.permissions?.query({ name: 'magnetometer' as never }),
      navigator.permissions?.query({ name: 'gyroscope' as never }),
    ]);
    const result = results.every((result) =>
      result ? result.state === 'granted' : true
    );
    return result;
  }

  private setupCompass(): AbsoluteOrientationSensor | undefined {
    if (`AbsoluteOrientationSensor` in window) {
      const sensor = new AbsoluteOrientationSensor({
        referenceFrame: 'screen',
      });

      sensor.addEventListener('reading', (e) => {
        const q = e.target.quaternion;
        const heading =
          Math.atan2(
            2 * q[0] * q[1] + 2 * q[2] * q[3],
            1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]
          ) *
          (-180 / Math.PI);
        this.compassHeadingSubj$.next(heading);
      });
      return sensor;
    }
    return undefined;
  }
}
