import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { TracingService } from '../../../services/tracing/tracing.service';

@Component({
  selector: 'laamap-fly-tracing-history-dialog',
  templateUrl: './fly-tracing-history-dialog.component.html',
  styleUrls: ['./fly-tracing-history-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    PushPipe,
    DigitalTimePipe,
  ],
})
export class FlyTracingHistoryDialogComponent {
  private readonly tracingService = inject(TracingService);
  private readonly pageSizeSubj$ = new BehaviorSubject({ offset: 0, limit: 5 });
  statistic$ = forkJoin({
    all: this.tracingService.getFlyTime('all'),
    year: this.tracingService.getFlyTime('year'),
    month: this.tracingService.getFlyTime('month'),
    today: this.tracingService.getFlyTime('today'),
  });

  displayedColumns: string[] = ['name', 'flightTime'];
  items$ = this.pageSizeSubj$.pipe(
    switchMap((pageSize) =>
      this.tracingService.getFlyHistoryListWithTime(
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
