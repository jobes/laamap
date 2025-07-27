import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleModule } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { TracingService } from '../../../services/tracing/tracing.service';
import { FlyTracingHistoryDeleteDialog } from './fly-tracing-history-delete-dialog/fly-tracing-history-delete-dialog';
import { FlyTracingHistoryJoinDialog } from './fly-tracing-history-join-dialog/fly-tracing-history-join-dialog';
import { FlyTracingHistoryRenameDialog } from './fly-tracing-history-rename-dialog/fly-tracing-history-rename-dialog';

@Component({
  selector: 'laamap-fly-tracing-history-dialog',
  templateUrl: './fly-tracing-history-dialog.component.html',
  styleUrls: ['./fly-tracing-history-dialog.component.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    PushPipe,
    DigitalTimePipe,
    MatMenuModule,
    MatIconModule,
    TranslocoLocaleModule,
  ],
})
export class FlyTracingHistoryDialogComponent {
  private readonly dialog = inject(MatDialog);
  private readonly tracingService = inject(TracingService);
  private readonly pageSizeSubj$ = new BehaviorSubject({ offset: 0, limit: 5 });
  private readonly statisticSubj$ = new BehaviorSubject(undefined);
  statistic$ = this.statisticSubj$.pipe(
    switchMap(() =>
      forkJoin({
        all: this.tracingService.getFlyTime('all'),
        year: this.tracingService.getFlyTime('year'),
        month: this.tracingService.getFlyTime('month'),
        today: this.tracingService.getFlyTime('today'),
      }),
    ),
  );

  displayedColumns: string[] = ['name', 'startTime', 'flightTime', 'actions'];
  items$ = this.pageSizeSubj$.pipe(
    switchMap((pageSize) =>
      this.tracingService.getFlyHistoryListWithTime(
        pageSize.offset,
        pageSize.limit,
      ),
    ),
  );
  flyRouteAvailable = signal(false);

  handlePageEvent(e: PageEvent) {
    this.pageSizeSubj$.next({
      offset: e.pageIndex * e.pageSize,
      limit: e.pageSize,
    });
  }

  downloadGpx(id: string, name: string) {
    this.tracingService.downloadGpx(id, name);
  }

  getFlyRouteAvailability(id: string): void {
    this.flyRouteAvailable.set(false);
    this.tracingService.flyTracingAvailable(id).then((available) => {
      this.flyRouteAvailable.set(available);
    });
  }

  renameDialog(id: string, name: string) {
    const dg = this.dialog.open(FlyTracingHistoryRenameDialog, {
      data: { id, name },
    });
    dg.afterOpened().subscribe(() => {
      setTimeout(
        () =>
          dg.componentRef?.location.nativeElement
            .querySelector('input')
            .focus(),
        0,
      );
    });
    dg.afterClosed().subscribe((newName) => {
      if (newName) {
        this.tracingService.renameFlyTrace(id, newName).then(() => {
          this.pageSizeSubj$.next(this.pageSizeSubj$.value);
        });
      }
    });
  }

  deleteDialog(id: string) {
    this.dialog
      .open(FlyTracingHistoryDeleteDialog)
      .afterClosed()
      .subscribe((answer) => {
        if (answer) {
          this.tracingService.deleteFlyTrace(id).then(() => {
            this.pageSizeSubj$.next(this.pageSizeSubj$.value);
          });
          this.statisticSubj$.next(undefined);
        }
      });
  }

  joinRoutesDialog(id: string) {
    this.dialog
      .open(FlyTracingHistoryJoinDialog, { data: { id } })
      .afterClosed()
      .subscribe((toId) => {
        if (toId) {
          this.tracingService.joinFlyTraces(id, toId).then(() => {
            this.pageSizeSubj$.next(this.pageSizeSubj$.value);
            this.statisticSubj$.next(undefined);
          });
        }
      });
  }
}
