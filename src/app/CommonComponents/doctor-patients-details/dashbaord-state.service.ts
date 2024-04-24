import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashbaordStateService {
  private currentPageNo: BehaviorSubject<number>;
  constructor() {
    const currentPage = localStorage.getItem('currentPage') ? Number(localStorage.getItem('currentPage')) : 1;
    this.currentPageNo = new BehaviorSubject<number>(currentPage);
  }

  get currentPageNo$(): Observable<number> {
    return this.currentPageNo.asObservable();
  }

  setCurrentPageNo(pageNo: number): void {
    this.currentPageNo.next(pageNo);
    localStorage.setItem('currentPage', pageNo.toString());
  }
}
