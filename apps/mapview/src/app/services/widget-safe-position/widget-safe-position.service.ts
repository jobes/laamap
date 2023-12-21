import { ElementRef, Injectable, QueryList } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  map,
  of,
  startWith,
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
    widget: { containers: QueryList<ElementRef<HTMLElement>> },
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
          widget.containers?.changes.pipe(startWith(true)),
        ]),
      ),
      map((val) =>
        this.getSafePosition(widget.containers?.first, val[0], val[1]),
      ),
    );
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
