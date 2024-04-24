import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { FileService } from './file.service';
export interface TimerObj {
  clinincalNotes?: number;
  patientCall?: number;
  dasboardReview?: number;
  graphReview?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimsTimerService {
  private timer: Observable<number> = interval(1000);
  private timerSubscription: Subscription;
  private time = 0;
  constructor(
    private fileService: FileService
  ) { }


  getTimerObj(patientId: string): TimerObj | null {
    return this.fileService.isValidJson(
      localStorage.getItem(`timerObj_${patientId}`)) ? JSON.parse(localStorage.getItem(`timerObj_${patientId}`)) : null;
  }


  updateTimerObj(patientId: string, key: string, value: number): void {
    const timerObj: TimerObj | null = this.getTimerObj(patientId);
    if (timerObj && timerObj !== null && key) {
      timerObj[key] = value;
      this.storeTimerObj(patientId, timerObj);
    }
  }

  storeTimerObj(patientId: string, obj: TimerObj): void {
    localStorage.setItem(`timerObj_${patientId}`, JSON.stringify(obj));
  }

  removeTimerObj(patientId): void {
    localStorage.removeItem(`timerObj_${patientId}`);
  }

  getTimerObjVal(patientId: string, key: any): number {
    const timerObj: TimerObj | null = this.getTimerObj(patientId);
    if (timerObj !== null) {
      return timerObj[key] ? timerObj[key] : 0;
    }
    return 0;

  }


  start(patientId: string, pageName: string): void {
    this.timerSubscription = this.timer.subscribe((t) => {
      this.time++;
      this.updateTimerObj(patientId, pageName, this.time);
      if (t % 30 === 0) {
        this.time = 0;
        this.updateTimerObj(patientId, pageName, this.time);
      }
    });
  }

  stop(patientId?: string): void {
    this.timerSubscription.unsubscribe();
  }
}
