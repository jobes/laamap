import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  of,
  share,
  switchMap,
  take,
  timer,
} from 'rxjs';

import { IRainViewerUrls } from './rain-viewer.interface';

@Injectable({
  providedIn: 'root',
})
export class RainViewerService {
  private readonly http = inject(HttpClient);
  readonly tileSize = 256;
  currentAnimationFrame$: Observable<{
    frameNum: number;
    time: number;
    pastTime: boolean;
  }>;

  private animationChangeSubj$ = new BehaviorSubject(
    null as null | {
      animationSpeed: number;
      timeArray: { time: number; isPast: boolean }[];
      pauseOnEnd: number;
    },
  );

  constructor() {
    this.currentAnimationFrame$ = this.animationChangeSubj$.asObservable().pipe(
      switchMap((def) =>
        def
          ? of(def).pipe(
              map((def) => ({
                ...def,
                stepTime: this.animationSpeedStepDuration(def.animationSpeed),
              })),
              switchMap((def) =>
                timer(
                  0,
                  def.stepTime * def.timeArray.length + def.pauseOnEnd,
                ).pipe(
                  // duration of 1 cycle containing all frames
                  switchMap(
                    () =>
                      timer(0, def.stepTime).pipe(take(def.timeArray.length)), // duration of 1 frame for all frame, then stop
                  ),
                  map((frameNum) => ({
                    frameNum,
                    time: def.timeArray[frameNum].time,
                    pastTime: def.timeArray[frameNum].isPast,
                  })),
                ),
              ),
            )
          : of(null),
      ), // stop timer
      filter((def): def is NonNullable<typeof def> => !!def),
      share(),
    );
  }

  getUrls$(): Observable<IRainViewerUrls> {
    return this.http
      .get<IRainViewerUrls>(
        'https://api.rainviewer.com/public/weather-maps.json',
      )
      .pipe(
        map((defs) => ({
          ...defs,
          coverage: `/v2/coverage/0/${this.tileSize}/{z}/{x}/{y}/0/0_0.png`,
        })),
      );
  }

  startAnimationTimer(
    animationSpeed: number,
    timeArray: { time: number; isPast: boolean }[],
    pauseOnEnd: number,
  ): void {
    this.animationChangeSubj$.next({ animationSpeed, timeArray, pauseOnEnd });
  }

  stopAnimationTimer(): void {
    this.animationChangeSubj$.next(null);
  }

  // convert percentage to 2000ms for 0% to 10ms for 99%
  private animationSpeedStepDuration(percentage: number): number {
    const durationMin = 10;
    const durationMax = 2000 - durationMin;
    const result =
      durationMax -
      (Math.log10(percentage + 1) / 2) * durationMax +
      durationMin;
    return result;
  }
}
