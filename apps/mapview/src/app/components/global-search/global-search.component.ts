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
import {
  CustomFlyRoutesService,
  ICustomFlyRoute,
} from '../../services/custom-fly-routes/custom-fly-routes.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { HighlightTextDirective } from '../../directives/highlight-text.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatOption, MatOptionModule } from '@angular/material/core';
import {
  GlobalMenuInput,
  GlobalSearchMenuComponent,
} from '../global-search-menu/global-search-menu.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';

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
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  @ViewChild('inputElm') inputElm!: ElementRef<HTMLInputElement>;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption<ICustomFlyRoute>>;
  private readonly customFlyRoutesService = inject(CustomFlyRoutesService);
  private readonly bottomSheet = inject(MatBottomSheet);
  searchControl = new FormControl('');
  isOpen = false;
  searchResults$ = this.searchControl.valueChanges.pipe(
    // TODO move out of component
    switchMap((val) =>
      forkJoin({ routes: this.customFlyRoutesService.searchRoute(val) }),
    ),
    map((values) => [
      ...(values.routes.length === 0
        ? []
        : [
            {
              label: 'routes',
              values: values.routes.map((route) => ({
                name: route.routeName,
                data: route,
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

  optionSelected(option: ICustomFlyRoute): void {
    this.closeInteraction();
    this.bottomSheet.open(GlobalSearchMenuComponent, {
      data: {
        type: 'route',
        ...option,
      } as GlobalMenuInput,
    });
  }

  private closeInteraction(): void {
    this.inputElm.nativeElement.blur();
    this.isOpen = false;
    this.searchControl.reset();
  }
}
