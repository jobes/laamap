import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { navigationNextPointWidgetActions } from '../../../store/actions/widgets.actions';
import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import { navigationSettingsFeature } from '../../../store/features/settings/navigation.feature';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { map } from 'rxjs';

@Component({
  selector: 'laamap-navigation-next-point-widget',
  templateUrl: './navigation-next-point-widget.component.html',
  styleUrls: ['./navigation-next-point-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetDirective,
    NgIf,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
    DigitalTimePipe,
  ],
})
export class NavigationNextPointWidgetComponent {
  @ViewChildren(CdkDrag, { read: ElementRef })
  readonly containers!: QueryList<ElementRef<HTMLElement>>;
  private readonly safePositionService = inject(WidgetSafePositionService);
  private readonly store = inject(Store);
  running$ = this.store.select(navigationFeature.selectRunning);
  activeGps$ = this.store.select(mapFeature.selectGeoLocationTrackingActive);
  navigationSettings$ = this.store.select(
    navigationSettingsFeature.selectWidgetNextPoint,
  );
  navStats$ = this.store.select(selectNavigationStats);
  safePosition$ = this.safePositionService.safePosition$(
    this.navigationSettings$.pipe(map((val) => val.position)),
    this,
  );

  dragEnded(event: CdkDragEnd): void {
    this.store.dispatch(
      navigationNextPointWidgetActions.positionMoved({
        position: {
          x: event.source.element.nativeElement.getBoundingClientRect().x,
          y: event.source.element.nativeElement.getBoundingClientRect().y,
        },
      }),
    );
  }
}
