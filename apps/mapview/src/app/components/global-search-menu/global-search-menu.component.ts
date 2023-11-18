import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { ICustomFlyRoute } from '../../services/custom-fly-routes/custom-fly-routes.service';
import { globalSearchMenu } from '../../store/actions/navigation.actions';
import { Store } from '@ngrx/store';

export type GlobalMenuInput = { type: 'route' } & ICustomFlyRoute;

@Component({
  selector: 'laamap-global-search-menu',
  standalone: true,
  imports: [TranslocoModule, MatListModule],
  templateUrl: './global-search-menu.component.html',
  styleUrl: './global-search-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchMenuComponent {
  private readonly bottomSheetRef = inject(
    MatBottomSheetRef<GlobalSearchMenuComponent>,
  );
  readonly data = inject(MAT_BOTTOM_SHEET_DATA) as GlobalMenuInput;
  private readonly store = inject(Store);

  activateRoute(route: ICustomFlyRoute): void {
    this.store.dispatch(globalSearchMenu.activateRoute({ route }));
    this.bottomSheetRef.dismiss();
  }
}
