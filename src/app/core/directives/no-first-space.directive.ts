import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoFirstSpace]',
})
export class NoFirstSpaceDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' && this.el.nativeElement.selectionStart === 0) {
      event.preventDefault();
    }
  }
}
