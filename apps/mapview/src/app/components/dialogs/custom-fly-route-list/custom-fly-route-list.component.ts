import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { IDbCustomRoute } from '../../../database/synced-db.service';
import { CustomFlyRoutesService } from '../../../services/custom-fly-routes/custom-fly-routes.service';
import { customFlyRouteListDialogActions } from '../../../store/actions/navigation.actions';

@Component({
  selector: 'laamap-custom-fly-route-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatListModule,
  ],
  templateUrl: './custom-fly-route-list.component.html',
  styleUrls: ['./custom-fly-route-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFlyRouteListComponent {
  private customFlyRoutesService = inject(CustomFlyRoutesService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly store = inject(Store);
  routeList = this.customFlyRoutesService.getAllRoutes();

  remove(route: IDbCustomRoute): void {
    this.customFlyRoutesService.deleteRoute(route.id).then(
      () => {
        this.routeList = this.customFlyRoutesService.getAllRoutes();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
    );
  }

  startNavigation(route: IDbCustomRoute): void {
    this.store.dispatch(customFlyRouteListDialogActions.routeUsed({ route }));
    this.dialogRef.close();
  }
}
