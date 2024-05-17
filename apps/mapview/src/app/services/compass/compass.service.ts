import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';

import { compassDuration } from '../../helper';
import { compassActions } from '../../store/actions/map.actions';
import { LoggerService } from '../logger/logger.service';

declare class AbsoluteOrientationSensor {
  constructor(param: { referenceFrame: 'screen'; frequency: number });
  addEventListener(
    eventName: 'reading',
    eventValue: (param: { target: { quaternion: number[] } }) => void,
  ): void;
  removeEventListener(): void;
  start(): void;
}

@Injectable({
  providedIn: 'root',
})
export class CompassService {
  constructor(
    private readonly logger: LoggerService,
    private readonly store: Store,
  ) {}

  public init(): void {
    this.requestPermission()
      .then((res) => {
        if (res) {
          this.setup()?.start();
        }
      })
      .catch(() => {
        this.logger.logErrorMsg(
          'mapComponent compass permission',
          'Can not get permission for using compass',
        );
      });
  }

  private async requestPermission(): Promise<boolean> {
    const results = await Promise.all([
      navigator.permissions?.query({ name: 'accelerometer' as never }),
      navigator.permissions?.query({ name: 'magnetometer' as never }),
      navigator.permissions?.query({ name: 'gyroscope' as never }),
    ]);
    const result = results.every((result) =>
      result ? result.state === 'granted' : true,
    );
    return result;
  }

  private setup(): AbsoluteOrientationSensor | undefined {
    if (`AbsoluteOrientationSensor` in window) {
      const sensor = new AbsoluteOrientationSensor({
        referenceFrame: 'screen',
        frequency: compassDuration,
      });

      fromEvent(sensor, 'reading').subscribe((e) => {
        const q = e.target.quaternion;
        const heading =
          Math.atan2(
            2 * q[0] * q[1] + 2 * q[2] * q[3],
            1 - 2 * q[1] * q[1] - 2 * q[2] * q[2],
          ) *
          (-180 / Math.PI);
        this.store.dispatch(compassActions.headingChanged({ heading }));
      });
      return sensor;
    }
    return undefined;
  }
}
