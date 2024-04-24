import { Pipe, PipeTransform } from '@angular/core';
import { SecondConversionOutput } from '../entities/validation-email';

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {

    const diff = new Date().getTime() - new Date(value).getTime();
    const converted: SecondConversionOutput = this.convertMilliseconds(diff / 1000);

    let timeMsg = '';
    if (converted.year && converted.year >= 1) {
      if (converted.year === 1) {
        timeMsg = `${converted.year} year ago`;
      } else {
        timeMsg = `${converted.year} years ago`;
      }
    } else if (converted.months && converted.months >= 1) {
      let days = '';
      if (converted.day === 0) {
        days = ' ago';
      } else if (converted.day === 1) {
        days = `${converted.day} day ago`;
      } else {
        days = `${converted.day} days ago`;
      }
      if (converted.months === 1) {
        timeMsg = `${converted.months} month ${days}`;
      } else {
        timeMsg = `${converted.months} months ${days}`;
      }
    } else if (converted.day && converted.day >= 1) {
      if (converted.day === 1) {
        timeMsg = 'Yesterday';
      } else {
        timeMsg = `${converted.day} days ago`;
      }
    } else if (converted.hour && converted.hour >= 1) {
      if (converted.hour === 1) {
        timeMsg = `${converted.hour} hour ago`;
      } else {
        timeMsg = `${converted.hour} hours ago`;
      }
    } else if (converted.min && converted.min >= 1) {
      if (converted.min === 1) {
        timeMsg = `${converted.min} minute ago`;
      } else {
        timeMsg = `${converted.min} minutes ago`;
      }
    } else {
      if (converted.secs < 30) {
        timeMsg = 'Just now';
      } else {
        timeMsg = `${converted.secs} seconds ago`;

      }
    }
    return timeMsg;
  }

  convertMilliseconds(seconds: number): SecondConversionOutput {
    const years = Math.floor(seconds / 31536000);
    const days = Math.floor((seconds % 31536000) / 86400);
    const month = Math.floor((seconds % 31536000) / (86400 * 30));
    const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const sec = Math.floor(((seconds % 31536000) % 86400) % 3600) % 60;

    return {
      year: years,
      day: days,
      hour: hours,
      min: minutes,
      secs: sec,
      months: month
    };
  }
}
