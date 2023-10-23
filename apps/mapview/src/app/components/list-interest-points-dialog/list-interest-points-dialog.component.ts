import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Feature, Point } from '@turf/turf';
import { LngLat } from 'maplibre-gl';
import { BehaviorSubject, switchMap, take } from 'rxjs';

import {
  IInterestPoint,
  InterestPointsService,
} from '../../services/interest-points/interest-points.service';
import { poiListDialogActions } from '../../store/actions/navigation.actions';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../create-interest-point-dialog/create-interest-point-dialog.component';

@Component({
  selector: 'laamap-list-interest-points-dialog',
  standalone: true,
  imports: [
    TranslocoModule,
    NgFor,
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './list-interest-points-dialog.component.html',
  styleUrls: ['./list-interest-points-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInterestPointsDialogComponent {
  readonly interestPointsService = inject(InterestPointsService);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(
    MatDialogRef<ListInterestPointsDialogComponent>,
  );
  private readonly interestPointsSubj$ = new BehaviorSubject<
    Feature<Point, IInterestPoint>[]
  >([]);
  interestPoints$ = this.interestPointsSubj$.asObservable();

  constructor() {
    void this.interestPointsService
      .getPoints()
      .then((poiList) => this.interestPointsSubj$.next(poiList));
  }

  startNavigation(point: Feature<Point, IInterestPoint>): void {
    this.store.dispatch(
      poiListDialogActions.addedPointToNavigation({
        point: {
          lat: point.geometry.coordinates[1],
          lng: point.geometry.coordinates[0],
        } as LngLat,
        name: point.properties.name,
      }),
    );
    this.dialogRef.close(true);
  }

  showDetails(point: Feature<Point, IInterestPoint>): void {
    this.dialog
      .open(CreateInterestPointDialogComponent, {
        width: '100%',
        data: {
          mode: 'edit',
          value: { id: point.id, properties: point.properties },
        } as CreateInterestPointDialogInput,
      })
      .afterClosed()
      .pipe(
        switchMap(() => this.interestPointsService.getPoints()),
        take(1),
      )
      .subscribe({
        next: (poiList) => this.interestPointsSubj$.next(poiList),
      });
  }

  userTrackPoi(index: number, point: Feature<Point, IInterestPoint>): string {
    return point.properties.id;
  }
}
