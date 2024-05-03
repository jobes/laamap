import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { DigitalTimePipe } from '../../../pipes/digital-time/digital-time.pipe';
import { WidgetSafePositionService } from '../../../services/widget-safe-position/widget-safe-position.service';
import { navigationNextPointWidgetActions } from '../../../store/actions/widgets.actions';
import { selectNavigationStats } from '../../../store/advanced-selectors';
import { mapFeature } from '../../../store/features/map.feature';
import { navigationFeature } from '../../../store/features/navigation.feature';
import { navigationSettingsFeature } from '../../../store/features/settings/navigation.feature';

@Component({
  selector: 'laamap-navigation-next-point-widget',
  templateUrl: './navigation-next-point-widget.component.html',
  styleUrls: ['./navigation-next-point-widget.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    LetDirective,
    CdkDrag,
    AsyncPipe,
    TranslocoLocaleModule,
    DigitalTimePipe,
  ],
})
export class NavigationNextPointWidgetComponent {
  containers = viewChildren<CdkDrag, ElementRef<HTMLElement>>(CdkDrag, {
    read: ElementRef,
  });
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
    toObservable(this.containers),
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
