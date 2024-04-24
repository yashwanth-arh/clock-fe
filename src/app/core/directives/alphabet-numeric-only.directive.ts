import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphabetNumericOnly]',
})
export class AlphabetNumericOnlyDirective {
  // eslint-disable-next-line
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = event as KeyboardEvent;
    if (
      (e.keyCode >= 16 && e.keyCode <= 47) ||
      (e.keyCode >= 123 && e.keyCode <= 222) ||
      (e.keyCode >= 106 && e.keyCode <= 111) ||
      (e.keyCode >= 48 && e.keyCode <= 57 && e.shiftKey)
    ) {
      event.preventDefault();
    }
  }
  constructor(private el: ElementRef) {}
}
