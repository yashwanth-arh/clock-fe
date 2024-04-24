export class TimeModel {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  constructor(days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number) {
    this.days = days || 0;
    this.hours = hours || 0;
    this.minutes = minutes || 0;
    this.seconds = seconds || 0;
    this.milliseconds = milliseconds || 0;
  }
}
