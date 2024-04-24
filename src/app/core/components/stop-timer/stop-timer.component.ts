import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TimeModel } from 'src/app/shared/models/time.model';
import { StopTimerService, StopWatchEvent } from '../../services/stop-timer.service';

@Component({
  selector: 'app-stop-timer',
  templateUrl: './stop-timer.component.html',
  styleUrls: ['./stop-timer.component.scss']
})
export class StopTimerComponent implements OnInit, OnDestroy {

  @Input()
  lapEnabled = true;
  @Input()
  showMillis = true;
  @Input()
  maxLaps = 10;
  @Input()
  cycleLaps = false;
  @Input()
  language = 'en';
  @Input()
  showControls = true;
  @Output()
  getTimePassed: EventEmitter<number> = new EventEmitter<number>();
  startButtonLabel: string;
  resetButtonLabel: string;
  laps: TimeModel[] = [];
  running = false;
  start: any;
  millisToHoursCotient: number = (1000 * 60 * 60);
  millisToMinutesCotient: number = (1000 * 60);
  millisToSecondsCotient = 1000;
  counter: number;
  time: TimeModel;
  increment = 50;
  timerObservable: Subscription;
  getStopwatchObservable: Subscription;

  constructor(protected stopwatchService: StopTimerService) { }

  ngOnInit(): void {
    this.i18nInit();
    this.time = new TimeModel();
    this.initStopwatch();
    this.getStopwatchObservable = this.stopwatchService.getStopwatch().subscribe((stopwatchEvent: StopWatchEvent) => {
      if (stopwatchEvent.event === 'start') {
        this.startStopwatch();
      }

      if (stopwatchEvent.event === 'reset') {
        this.resetStopwatch();
      }
    });
  }

  ngOnDestroy(): void {
    this.getStopwatchObservable.unsubscribe();
    this.timerObservable.unsubscribe();
  }
  private initStopwatch(): void {
    this.time = new TimeModel();
    this.start = new Date().getTime();
  }

  resetStopwatch(): void {
    if (this.running) {
      this.running = !this.running;
      this.timerObservable.unsubscribe();
      this.getTimePassed.emit(this.convertToMillis(this.time));
      this.initStopwatch();
    } else {
      this.initStopwatch();
    }

    if (this.lapEnabled && this.laps.length > 0) {
      this.laps = [];
    }
  }

  startStopwatch(): void {
    if (!this.running) {
      this.start = new Date().getTime();
      this.counter = 0;
      this.running = true;
      this.timerObservable = timer(0, this.increment).subscribe(() => {
        this.incrementStopwatch();
      });
    } else {
      if (this.lapEnabled && this.laps.length <= this.maxLaps) {
        if (this.laps.length === this.maxLaps) {
          this.laps = [];
        }
        this.laps.push(Object.assign({}, this.time));
      }
    }
  }

  formatTime(time: number, digits: number): string {
    let fixedDigitNumber: string = time.toFixed(0);
    while (fixedDigitNumber.length < digits) {
      fixedDigitNumber = '0' + fixedDigitNumber;
    }
    return fixedDigitNumber;
  }

  incrementStopwatch(): void {
    let timeDifference: number = new Date().getTime() - this.start;
    // eslint-disable-next-line no-bitwise
    const hours: number = ~~(timeDifference / this.millisToHoursCotient);
    if (hours >= 1) {
      timeDifference = timeDifference - (hours * this.millisToHoursCotient);
      this.time.hours = hours;
    }

    // eslint-disable-next-line no-bitwise
    const minutes: number = ~~(timeDifference / this.millisToMinutesCotient);
    if (minutes >= 1) {
      timeDifference = timeDifference - (minutes * this.millisToMinutesCotient);
      this.time.minutes = minutes;
    }

    // eslint-disable-next-line no-bitwise
    const seconds: number = ~~(timeDifference / this.millisToSecondsCotient);
    if (seconds >= 1) {
      timeDifference = timeDifference - (seconds * this.millisToSecondsCotient);
      this.time.seconds = seconds;
    }
    this.time.milliseconds = timeDifference;

  }

  private setEN(): void {
    if (this.lapEnabled) {
      this.startButtonLabel = 'Start/Lap';
    } else {
      this.startButtonLabel = 'Start';
    }
    this.resetButtonLabel = 'Reset';
  }

  convertToMillis(time: TimeModel): number {
    return Number(
      time.milliseconds + (
        time.seconds * this.millisToSecondsCotient
      ) + (
        time.minutes * this.millisToMinutesCotient
      ) + (
        time.hours * this.millisToHoursCotient
      )
    );
  }

  private i18nInit(): void {

    switch (this.language) {
      default:
        this.setEN();
        break;
    }
  }
}
