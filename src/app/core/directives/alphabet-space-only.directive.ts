import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphabetSpaceOnly]',
})
export class AlphabetSpaceOnlyDirective {
  // eslint-disable-next-line
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = event as KeyboardEvent;
    if (
      (e.keyCode >= 16 && e.keyCode <= 31) ||
      //Restrict special characters
      (e.keyCode >= 123 && e.keyCode <= 222) ||
      (e.keyCode >= 96 && e.keyCode <= 111) ||
      (e.keyCode >= 48 && e.keyCode <= 57)
    ) {
      event.preventDefault();
    }
  }
  constructor(private el: ElementRef) {}
}
