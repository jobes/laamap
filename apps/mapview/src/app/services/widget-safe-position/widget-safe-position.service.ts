import { ElementRef, Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  map,
  of,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WidgetSafePositionService {
  private resizeObsSubj$ = new BehaviorSubject({ width: 0, height: 0 });

  constructor() {
    this.resizeObsSubj$.next({
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    });
    addEventListener('resize', () => {
      this.resizeObsSubj$.next({
        width: document.body.offsetWidth,
        height: document.body.offsetHeight,
      });
    });
  }

  safePosition$(
    position$: Observable<{ x: number; y: number }>,
    widget$: Observable<readonly ElementRef<HTMLElement>[]>,
  ): Observable<{
    x: number;
    y: number;
  }> {
    // wait until initialization is finished
    return of(true).pipe(
      switchMap(() =>
        combineLatest([
          this.resizeObsSubj$.pipe(debounceTime(100)),
          position$,
          widget$,
        ]),
      ),
      map((val) => this.getSafePosition(val[2][0], val[0], val[1])),
    );
  }

  safePosition(
    position$: Observable<{ x: number; y: number }>,
    widget: Signal<readonly ElementRef<HTMLElement>[]>,
  ): Signal<{ x: number; y: number }> {
    return toSignal(this.safePosition$(position$, toObservable(widget)), {
      initialValue: { x: 0, y: 0 },
    });
  }

  private getSafePosition(
    container: ElementRef<HTMLElement>,
    containerSize: { width: number; height: number },
    position: { x: number; y: number },
  ): {
    x: number;
    y: number;
  } {
    if (!container) {
      return position;
    }
    const bounding = container.nativeElement.getBoundingClientRect();

    return {
      x:
        bounding.width + position.x > containerSize.width
          ? containerSize.width - bounding.width
          : bounding.width + position.x < 0
            ? 0
            : position.x,
      y:
        bounding.height + position.y > containerSize.height
          ? containerSize.height - bounding.height
          : bounding.height + position.y < 0
            ? 0
            : position.y,
    };
  }
}
