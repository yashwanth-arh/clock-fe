import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  public toolbarLabel: BehaviorSubject<string>;
  constructor() {
    this.toolbarLabel = new BehaviorSubject<any>({});
  }

  setToolbarLabel(label): void {
    this.toolbarLabel.next(label);
  }

  getToolbarLabelObs(): Observable<string> {
    return this.toolbarLabel.asObservable();
  }

  getToolbarLabelValue(): string {
    return this.toolbarLabel.value;
  }

}
