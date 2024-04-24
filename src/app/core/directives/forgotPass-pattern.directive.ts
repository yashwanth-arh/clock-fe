import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]',
})
export class RestrictInputDirective {
  @Input() allowedChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^*()-_&';

  constructor() {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    let sanitizedValue = '';

    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue.charAt(i);
      if (this.allowedChars.includes(char)) {
        sanitizedValue += char;
      }
    }

    inputElement.value = sanitizedValue;
  }
}
