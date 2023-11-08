import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CustomFlyRoutesService,
  ICustomFlyRoute,
} from '../../../services/custom-fly-routes/custom-fly-routes.service';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
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

  remove(route: ICustomFlyRoute): void {
    this.customFlyRoutesService.deleteRoute(route.routeName).then(
      () => {
        this.routeList = this.customFlyRoutesService.getAllRoutes();
      },
      () => {},
    );
  }

  startNavigation(route: ICustomFlyRoute): void {
    this.store.dispatch(customFlyRouteListDialogActions.routeUsed({ route }));
    this.dialogRef.close();
  }

  trackByRouteName(index: number, item: { routeName: string }): string {
    return item.routeName;
  }
}
