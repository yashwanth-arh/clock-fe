import { Injectable } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: Observable<Date>;

  constructor() {
    this.timer = timer(0, 1000).pipe(
      map(tick => new Date()),
      shareReplay(1)
    );
  }

  get time(): Observable<Date> {
    return this.timer;
  }
}

