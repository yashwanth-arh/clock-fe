import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface StopWatchEvent {
  event: string;
}


@Injectable({
  providedIn: 'root'
})
export class StopTimerService {

  constructor() { }

  public stopwatchObservable: Subject<StopWatchEvent> = new Subject<StopWatchEvent>();

  getStopwatch(): Observable<StopWatchEvent> {
    return this.stopwatchObservable.asObservable();
  }

  public start(): Promise<any> {
    return new Promise((resolve) => {
      this.stopwatchObservable.next({ event: 'start' });
      resolve(true);
    });
  }

  public reset(): Promise<any> {
    return new Promise((resolve) => {
      this.stopwatchObservable.next({ event: 'reset' });
      resolve(true);
    });
  }

  public stop(): Promise<any> {
    return new Promise((resolve) => {
      this.stopwatchObservable.next({ event: 'stop' });
      resolve(true);
    });
  }
}
