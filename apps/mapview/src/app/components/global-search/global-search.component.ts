import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@jsverse/transloco';

import { HighlightTextDirective } from '../../directives/highlight-text.directive';
import { GamepadGlobalMenuHandler } from '../../services/gamepad-handler/gamepad-global-menu-handler';
import {
  GlobalMenuInput,
  GlobalSearchService,
} from '../../services/global-search/global-search.service';
import { GlobalSearchMenuComponent } from '../global-search-menu/global-search-menu.component';

@Component({
  selector: 'laamap-global-search',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    OverlayModule,
    HighlightTextDirective,
    MatOptionModule,
    TranslocoModule,
    MatListModule,
    AsyncPipe,
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  inputElm = viewChild<ElementRef<HTMLInputElement>>('inputElm');
  matOptions = viewChildren<MatOption<GlobalMenuInput>>(
    MatOption<GlobalMenuInput>,
  );
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
    this.inputElm()?.nativeElement.focus();
    this.isOpen.set(true);
  }

  backDropClicked(): void {
    this.closeInteraction();
  }

  keyDown(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.closeInteraction();
      event.preventDefault();
    }

    if (event.code === 'Enter') {
      const selected = this.matOptions().find((opt) => opt.selected);
      if (selected) {
        this.optionSelected(selected.value);
      }
      event.preventDefault();
    }
    this.processKeyForArrows(event);
  }

  optionSelected(data: GlobalMenuInput): void {
    this.closeInteraction();
    this.bottomSheet.open(GlobalSearchMenuComponent, { data });
  }

  private processKeyForArrows(event: KeyboardEvent): void {
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
      event.preventDefault();
      let index = this.matOptions().findIndex((opt) => opt.selected);
      this.matOptions().forEach((opt) => opt.deselect());

      if (event.code === 'ArrowDown') {
        if (index === this.matOptions().length - 1) {
          index = -1;
        }
        this.matOptions()[index + 1]?.select();
      } else {
        if (index <= 0) {
          index = this.matOptions().length;
        }
        this.matOptions()[index - 1]?.select();
      }
    }
  }

  private closeInteraction(): void {
    this.inputElm()?.nativeElement.blur();
    this.isOpen.set(false);
    this.searchControl.reset();
  }
}
