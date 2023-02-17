import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  readonly tileSize = 256;
  currentAnimationFrame$: Observable<{
    frameNum: number;
    time: number;
    pastTime: boolean;
  }>;

  private animationChangeSubj$ = new BehaviorSubject(
    null as null | {
      itemCounts: number;
      animationSpeed: number;
      timeArray: { time: number; isPast: boolean }[];
    }
  );

  constructor(private http: HttpClient) {
    this.currentAnimationFrame$ = this.animationChangeSubj$.asObservable().pipe(
      switchMap((def) =>
        def
          ? of(def).pipe(
              map((def) => ({
                ...def,
                stepTime: this.animationSpeedStepDuration(def.animationSpeed),
              })),
              switchMap((def) =>
                timer(0, def.stepTime * (def.itemCounts + 5)).pipe(
                  switchMap(() =>
                    timer(0, def.stepTime).pipe(take(def.itemCounts))
                  ),
                  map((frameNum) => ({
                    frameNum,
                    time: def.timeArray[frameNum].time,
                    pastTime: def.timeArray[frameNum].isPast,
                  }))
                )
              )
            )
          : of(null)
      ), // stop timer
      filter((def): def is NonNullable<typeof def> => !!def),
      share()
    );
  }

  getUrls$(): Observable<IRainViewerUrls> {
    return this.http
      .get<IRainViewerUrls>(
        'https://api.rainviewer.com/public/weather-maps.json'
      )
      .pipe(
        map((defs) => ({
          ...defs,
          coverage: `/v2/coverage/0/${this.tileSize}/{z}/{x}/{y}/0/0_0.png`,
        }))
      );
  }

  startAnimationTimer(
    itemCounts: number,
    animationSpeed: number,
    timeArray: { time: number; isPast: boolean }[]
  ): void {
    this.animationChangeSubj$.next({ itemCounts, animationSpeed, timeArray });
  }

  stopAnimationTimer(): void {
    this.animationChangeSubj$.next(null);
  }

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
