import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersStateService {

  private filtersArray: BehaviorSubject<string[] | null>;

  constructor() {
    this.filtersArray = new BehaviorSubject<string[] | null>([]);
  }

  setFiltersArrayValues(value: string[] | null): void {
    this.filtersArray.next(value);
  }

  getFiltersArrayValues(): Observable<string[]> {
    return this.filtersArray.asObservable();
  }
}
