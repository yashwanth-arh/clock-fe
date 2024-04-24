import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DateTransformationService {
  constructor(private datepipe: DatePipe) {}

  transformDate(date): any {
    const incoming = moment(date).format('DD/MM/YYYY, hh:mm a');
    return incoming;
  }
  dateTransformation(date): any {
    const splittedDateTime = date.split('T');
    const _date = splittedDateTime[0];
    const _time = splittedDateTime[1].split(':');
    return _date + ',' + _time[0] + ':' + _time[1];
  }
  twelveHoursFormat(date) {
    const splittedDateTime = date?.split('T');
    const splittedTime = splittedDateTime[1]?.split(':');
    if (splittedTime[0] === '12') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') +
        ' ' +
        '12' +
        ':' +
        splittedTime[1] +
        ' ' +
        'PM'
      );
    } else if (splittedTime[0] === '13') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '01' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '14') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '02' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '15') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '03' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '16') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '04' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '17') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '05' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '18') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '06' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '19') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '07' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '20') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '08' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '21') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '09' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '22') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '10' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else if (splittedTime[0] === '23') {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') + ' ' + '11' + ':' + splittedTime[1] + ' ' + 'PM'
      );
    } else {
      return (
        this.datepipe.transform(new Date(splittedDateTime[0]), 'dd/MM/yyyy') +
        ' ' +
        splittedTime[0] +
        ':' +
        splittedTime[1] +
        ' ' +
        'AM'
      );
    }
  }
}
