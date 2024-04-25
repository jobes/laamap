import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { TracingService } from '../../../services/tracing/tracing.service';
import { generalFeature } from '../../../store/features/settings/general.feature';

@Component({
  selector: 'laamap-fly-tracing-history-dialog',
  templateUrl: './fly-tracing-history-dialog.component.html',
  styleUrls: ['./fly-tracing-history-dialog.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogModule,
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    PushPipe,
    DigitalTimePipe,
  ],
})
export class FlyTracingHistoryDialogComponent {
  private readonly tracingService = inject(TracingService);
  private readonly store = inject(Store);
  private readonly pageSizeSubj$ = new BehaviorSubject({ offset: 0, limit: 5 });
  statistic$ = this.store.select(generalFeature.selectAirplaneName).pipe(
    switchMap((airPlaneName) =>
      forkJoin({
        all: this.tracingService.getFlyTime(airPlaneName, 'all'),
        year: this.tracingService.getFlyTime(airPlaneName, 'year'),
        month: this.tracingService.getFlyTime(airPlaneName, 'month'),
        today: this.tracingService.getFlyTime(airPlaneName, 'today'),
      }),
    ),
  );

  displayedColumns: string[] = ['name', 'duration'];
  items$ = this.pageSizeSubj$.pipe(
    concatLatestFrom(() =>
      this.store.select(generalFeature.selectAirplaneName),
    ),

    switchMap(([pageSize, airPlaneName]) =>
      this.tracingService.getFlyHistoryListWithTime(
        airPlaneName,
        pageSize.offset,
        pageSize.limit,
      ),
    ),
  );

  handlePageEvent(e: PageEvent) {
    this.pageSizeSubj$.next({
      offset: e.pageIndex * e.pageSize,
      limit: e.pageSize,
    });
  }
}
