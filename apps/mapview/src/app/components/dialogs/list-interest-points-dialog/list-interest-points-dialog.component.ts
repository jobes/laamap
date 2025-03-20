import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Feature, Point } from 'geojson';
import { LngLat } from 'maplibre-gl';
import { BehaviorSubject, switchMap, take } from 'rxjs';

import { IDbInterestPoint } from '../../../database/synced-db.service';
import { InterestPointsService } from '../../../services/interest-points/interest-points.service';
import { poiListDialogActions } from '../../../store/actions/navigation.actions';
import {
  CreateInterestPointDialogComponent,
  CreateInterestPointDialogInput,
} from '../../dialogs/create-interest-point-dialog/create-interest-point-dialog.component';

@Component({
  selector: 'laamap-list-interest-points-dialog',
  imports: [
    TranslocoModule,
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
    Feature<Point, IDbInterestPoint>[]
  >([]);
  interestPoints$ = this.interestPointsSubj$.asObservable();

  constructor() {
    void this.interestPointsService
      .getPoints()
      .then((poiList) => this.interestPointsSubj$.next(poiList));
  }

  startNavigation(point: Feature<Point, IDbInterestPoint>): void {
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

  showDetails(point: Feature<Point, IDbInterestPoint>): void {
    this.dialog
      .open(CreateInterestPointDialogComponent, {
        maxWidth: '100%',
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
}
