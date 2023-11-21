import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HighlightTextDirective } from '../../directives/highlight-text.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { GlobalSearchMenuComponent } from '../global-search-menu/global-search-menu.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';
import { MatListModule } from '@angular/material/list';
import { GamepadGlobalMenuHandler } from '../../services/gamepad-handler/gamepad-global-menu-handler';
import {
  GlobalMenuInput,
  GlobalSearchService,
} from '../../services/global-search/global-search.service';

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
  private readonly globalSearchService = inject(GlobalSearchService);
  private readonly bottomSheet = inject(MatBottomSheet);
  searchControl = new FormControl('');
  isOpen = signal(false);
  searchResults$ = this.globalSearchService.searchResults$(
    this.searchControl.valueChanges,
  );

  constructor() {
    inject(GamepadGlobalMenuHandler).searchComponent = this;
  }

  searchBoxClicked(): void {
    this.inputElm.nativeElement.focus();
    this.isOpen.set(true);
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
    this.isOpen.set(false);
    this.searchControl.reset();
  }
}
