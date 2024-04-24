import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoctorSharedService {
    dryWeight: any;
    public editDataDetails: any = [];
    public subject = new Subject<any>();
    private messageSource = new BehaviorSubject(this.editDataDetails);
    currentId = this.messageSource.asObservable();
    constructor() { }

    changeMessage(message) {
        this.messageSource.next(message);
    }

    formatDate(date) {
        const strTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        const year = strTime.getFullYear();
        let month = strTime.getMonth() + 1;
        let dt = strTime.getDate();
        if (dt < 10) {
            dt = dt;
        }
        if (month < 10) {
            month =  month;
        }
        let hours = strTime.getHours();
        let minutes = strTime.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? + minutes : minutes;
        const time = hours + ':' + minutes + ' ' + ampm;
        return (dt + "/" + month) + "/" + year + " " + time;
    }
}
