import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { escapeStringRegexp } from '../helper';

@Directive({
  selector: '[laamapHighlightText]',
})
export class HighlightTextDirective implements OnChanges {
  @Input() laamapHighlightText!: string | null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges() {
    setTimeout(() => {
      this.highlight();
    }, 100); // wait until value is rendered
  }

  private highlight(): void {
    let text = this.el.nativeElement.innerText;
    if (
      this.laamapHighlightText &&
      this.laamapHighlightText.length > 0 &&
      text.length > 0
    ) {
      this.el.nativeElement.innerHTML = this.el.nativeElement.innerHTML
        .replace(/<mark>/gi, '')
        .replace(/<\/mark>/gi, '');
      text = this.el.nativeElement.innerText;
      const regex = new RegExp(
        `(${escapeStringRegexp(this.laamapHighlightText)})`,
        'gi',
      );
      const highlightedText = text.replace(regex, '<mark>$1</mark>');

      this.el.nativeElement.innerHTML = highlightedText;
    }
  }
}
