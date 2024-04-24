import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTimeoutService {
  private isTimedOut: BehaviorSubject<boolean>;
  private failedCount: BehaviorSubject<number>;
  constructor() {
    this.isTimedOut = new BehaviorSubject<boolean>(false);
    this.failedCount = new BehaviorSubject<number>(0);
  }

  get isTimedOut$(): Observable<boolean> {
    return this.isTimedOut.asObservable();
  }

  setIsTimedOut(value: boolean): void {
    this.isTimedOut.next(value);
  }

  get failedCount$(): Observable<number> {
    return this.failedCount.asObservable();
  }

  get failedCountValue(): number {
    return this.failedCount.value;
  }

  setFailedCount(value: number): void {
    this.failedCount.next(value);
  }

  incrementFailedCount(): void {
    const count = this.failedCountValue + 1;
    this.setFailedCount(count);
  }
}
