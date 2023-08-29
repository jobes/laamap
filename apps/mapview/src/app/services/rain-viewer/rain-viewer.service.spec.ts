import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { take } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RainViewerService } from './rain-viewer.service';

describe('RainViewerService', () => {
  let service: RainViewerService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RainViewerService);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make observable for periodical showing frames with rain', () => {
    testScheduler.run(({ expectObservable }) => {
      service.startAnimationTimer(99, [
        { time: 50, isPast: true },
        { time: 100, isPast: true },
        { time: 150, isPast: false },
      ]);

      expectObservable(service.currentAnimationFrame$.pipe(take(13))).toBe(
        'a 9ms b 9ms c 59ms a 9ms b 9ms c 59ms a 9ms b 9ms c 59ms a 9ms b 9ms c 59ms (a|)',
        {
          a: { frameNum: 0, time: 50, pastTime: true },
          b: { frameNum: 1, time: 100, pastTime: true },
          c: { frameNum: 2, time: 150, pastTime: false },
        }
      );
    });
  });
});
