import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationCountStateService {
  private notificationCount: BehaviorSubject<number>;
  constructor() {
    this.notificationCount = new BehaviorSubject<number>(0);
  }

  setCount(value: number): void {
    this.notificationCount.next(value);
  }

  get notificationCountObs(): Observable<number> {
    return this.notificationCount.asObservable();
  }
}
