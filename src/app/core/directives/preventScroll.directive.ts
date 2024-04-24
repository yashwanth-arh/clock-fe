import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[preventScroll]'
})
export class PreventScrollDirective {

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent) {        
        event.preventDefault();
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        event.preventDefault();
    }
}