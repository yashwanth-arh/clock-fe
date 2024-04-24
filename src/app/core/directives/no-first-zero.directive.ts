import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoFirstZero]',
})
export class NoFirstZeroDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === '0' && this.el.nativeElement.selectionStart === 0) {
      event.preventDefault();
    }
  }
}
