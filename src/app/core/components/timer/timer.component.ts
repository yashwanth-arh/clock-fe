import {
  Component,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnDestroy, OnChanges {
  get timerDuration(): any {
    return {
      minutes: parseInt(this.minutes, 0),
      seconds: parseInt(this.seconds, 0),
      duration: this.minutes + ':' + this.seconds,
    };
  }
  constructor() {}
  clock: any;
  minutes: any = '00';
  seconds: any = '00';
  milliseconds: any = '00';
  duration: string;
  @Input() start: boolean;
  @Input() showTimerControls: boolean;
  @Output() callDuration = new EventEmitter();

  laps: any = [];
  counter: number;
  timerRef: any;
  running = false;
  startText = 'Start';

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.start.currentValue) {
      this.startTimer();
    } else {
      localStorage.setItem('durationCall', JSON.stringify(this.timerDuration));
      this.clearTimer();
    }
  }

  startTimer(): void {
    this.running = !this.running;

    if (this.running) {
      this.startText = 'Stop';
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.milliseconds = Math.floor(
          Math.floor(this.counter % 1000) / 10
        ).toFixed(0);
        this.minutes = Math.floor(this.counter / 60000);
        this.seconds = Math.floor(
          Math.floor(this.counter % 60000) / 1000
        ).toFixed(0);
        if (Number(this.minutes) < 10) {
          this.minutes = '0' + this.minutes;
        } else {
          this.minutes = '' + this.minutes;
        }
        if (Number(this.milliseconds) < 10) {
          this.milliseconds = '0' + this.milliseconds;
        } else {
          this.milliseconds = '' + this.milliseconds;
        }
        if (Number(this.seconds) < 10) {
          this.seconds = '0' + this.seconds;
        } else {
          this.seconds = '' + this.seconds;
        }

        localStorage.setItem(
          'durationCall',
          JSON.stringify(this.timerDuration)
        );
        // this.callDuration.emit(this.duration);
      });
      //
    } else {
      this.startText = 'Resume';
      clearInterval(this.timerRef);
    }
  }

  lapTimeSplit(): void {
    const lapTime = this.minutes + ':' + this.seconds + ':' + this.milliseconds;
    this.laps.push(lapTime);
  }

  clearTimer(): void {
    this.running = false;
    this.startText = 'Start';
    this.counter = undefined;
    (this.milliseconds = '00'), (this.seconds = '00'), (this.minutes = '00');
    this.laps = [];
    clearInterval(this.timerRef);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }
}
