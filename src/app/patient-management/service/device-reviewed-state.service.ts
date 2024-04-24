import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReviewSummary } from 'src/app/shared/entities/review-summary';

@Injectable({
  providedIn: 'root'
})
export class DeviceReviewedStateService {
  private deviceReviewedState: BehaviorSubject<ReviewSummary | null>;
  constructor() {
    this.deviceReviewedState = new BehaviorSubject(JSON.parse(localStorage.getItem('review')));
  }


  setReviewState(value: ReviewSummary): void {
    this.deviceReviewedState.next(value);
    localStorage.setItem('review', JSON.stringify(value));
  }

  get reviewState(): Observable<ReviewSummary> {
    return this.deviceReviewedState.asObservable();
  }
}
