import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomFlyRoutesService } from '../../services/custom-fly-routes/custom-fly-routes.service';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { HighlightTextDirective } from '../../directives/highlight-text.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatOption, MatOptionModule } from '@angular/material/core';
import {
  GlobalMenuInput,
  GlobalSearchMenuComponent,
} from '../global-search-menu/global-search-menu.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';
import { InterestPointsService } from '../../services/interest-points/interest-points.service';
import { MatListModule } from '@angular/material/list';
import { OnMapAirportsService } from '../../services/map/on-map-airports/on-map-airports.service';

@Component({
  selector: 'laamap-global-search',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    OverlayModule,
    HighlightTextDirective,
    MatOptionModule,
    TranslocoModule,
    MatListModule,
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  @ViewChild('inputElm') inputElm!: ElementRef<HTMLInputElement>;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption<GlobalMenuInput>>;
  private readonly customFlyRoutesService = inject(CustomFlyRoutesService);
  private readonly interestPointsService = inject(InterestPointsService);
  private readonly onMapAirportsService = inject(OnMapAirportsService);
  private readonly bottomSheet = inject(MatBottomSheet);
  searchControl = new FormControl('');
  isOpen = false;
  searchResults$: Observable<
    { label: string; values: { name: string; data: GlobalMenuInput }[] }[]
  > = this.searchControl.valueChanges.pipe(
    // TODO move out of component
    map((val) => ((val?.length ?? 0) >= 2 ? val : '')),
    switchMap((val) =>
      forkJoin({
        routes: this.customFlyRoutesService.searchRoute(val),
        points: this.interestPointsService.searchPoints(val),
        airports: Promise.resolve(this.onMapAirportsService.searchAirport(val)),
      }),
    ),
    // eslint-disable-next-line max-lines-per-function
    map((values) => [
      ...(values.routes.length === 0
        ? []
        : [
            {
              label: 'routes',
              values: values.routes.map((route) => ({
                name: route.routeName,
                data: { itemType: 'route' as const, ...route },
              })),
            },
          ]),
      ...(values.points.length === 0
        ? []
        : [
            {
              label: 'interestPoints',
              values: values.points.map((point) => ({
                name: point.properties.name,
                data: { itemType: 'interestPoint' as const, ...point },
              })),
            },
          ]),
      ...(values.airports.length === 0
        ? []
        : [
            {
              label: 'airports',
              values: values.airports.map((airport) => ({
                name:
                  airport.properties.name +
                  (airport.properties.icaoCode
                    ? `(${airport.properties.icaoCode})`
                    : ''),
                data: { itemType: 'airports' as const, ...airport },
              })),
            },
          ]),
    ]),
  );

  constructor() {}

  searchBoxClicked(): void {
    this.inputElm.nativeElement.focus();
    this.isOpen = true;
  }

  backDropClicked(): void {
    this.closeInteraction();
  }

  // TODO remove eslint
  // eslint-disable-next-line max-statements
  keyDown(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.closeInteraction();
      event.preventDefault();
    }
    if (event.code === 'ArrowDown') {
      let index = this.matOptions.toArray().findIndex((opt) => opt.selected);
      if (index === this.matOptions.length - 1) index = -1;
      this.matOptions.forEach((opt) => opt.deselect());
      this.matOptions.get(index + 1)?.select();
      event.preventDefault();
    }
    if (event.code === 'ArrowUp') {
      let index = this.matOptions.toArray().findIndex((opt) => opt.selected);
      if (index <= 0) index = this.matOptions.length;
      this.matOptions.forEach((opt) => opt.deselect());
      this.matOptions.get(index - 1)?.select();
      event.preventDefault();
    }
    if (event.code === 'Enter') {
      const selected = this.matOptions.find((opt) => opt.selected);
      if (selected) {
        this.optionSelected(selected.value);
      }
      event.preventDefault();
    }
  }

  optionSelected(data: GlobalMenuInput): void {
    this.closeInteraction();
    this.bottomSheet.open(GlobalSearchMenuComponent, { data });
  }

  private closeInteraction(): void {
    this.inputElm.nativeElement.blur();
    this.isOpen = false;
    this.searchControl.reset();
  }
}
