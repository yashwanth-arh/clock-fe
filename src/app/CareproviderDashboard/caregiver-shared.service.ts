import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './../core/services/auth.service';
import { AuthStateService } from './../core/services/auth-state.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CaregiverSharedService {
  diffTime: any;
  public apiBaseUrl: string;
  month: any;
  year: number;
  day: any;
  constructor(private http: HttpClient, private _decimalPipe: DecimalPipe) {}
  dryWeight: any;
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public loadPatientHeader: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public drawerToggled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public triggeredMedicationAdherence: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public overlayTriggered: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public caregiverHighAlert: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredhighAlertPatientNotification: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredPatientTabCount: BehaviorSubject<any> =
    new BehaviorSubject<any>(false);
  public triggeredhighAlertTabsCount: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredloadNotes: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggeredNoteCarePlan: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public triggeredalertTabsCount: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredgoodTabsCount: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredHeaderTitle: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  public triggeredNotificationCount: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggerdMaps: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public triggerednonAdherencePagination: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredNonAdherenceTabsCount: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredPatientDrawer: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredScheduleCallDrawer: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggerdScheduleCall: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggerdScheduleCallCount: BehaviorSubject<boolean> =
    new BehaviorSubject<any>(false);
  public triggerdgraphs: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggerdObservation: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggerdAppointment: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggerdObservatioHist: BehaviorSubject<any> =
    new BehaviorSubject<any>({});
  public triggerdVitalsHist: BehaviorSubject<any> =
    new BehaviorSubject<boolean>(false);
  public triggerdSelectedMedication: BehaviorSubject<any> =
    new BehaviorSubject<boolean>(false);
  public triggerdClaims: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public triggerdMedications: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggerdMatdrawer: BehaviorSubject<any> = new BehaviorSubject<any>(
    MatDrawer
  );
  public triggerdDates: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public triggeredAppts: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public triggeredPatientCard: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public triggerdBGTrend: BehaviorSubject<string> = new BehaviorSubject<any>(
    ''
  );
  public triggerdBPTrend: BehaviorSubject<string> = new BehaviorSubject<any>(
    ''
  );
  public triggerdBPLine: BehaviorSubject<string> = new BehaviorSubject<any>('');
  public triggerdBGLine: BehaviorSubject<string> = new BehaviorSubject<any>('');
  public triggeredPatientonBoardDate: BehaviorSubject<string> =
    new BehaviorSubject<any>('');
  public triggeredPatientSidenavData: BehaviorSubject<string> =
    new BehaviorSubject<any>('');

  public triggerdBPAdherence: BehaviorSubject<string> =
    new BehaviorSubject<any>('');
  public triggerdBGAdherence: BehaviorSubject<string> =
    new BehaviorSubject<any>('');
  public triggerMap: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public triggeredAdherenceNonAdherence: BehaviorSubject<boolean> =
    new BehaviorSubject<any>({});
  currentId = this.messageSource.asObservable();

  changeScheduleCallDrawer(message) {
    this.triggeredScheduleCallDrawer.next(message);
  }
  callNotesCarePlans(message) {
    this.triggeredNoteCarePlan.next(message);
  }
  loadNotes(message) {
    this.triggeredloadNotes.next(message);
  }
  changeOverlay(message) {
    this.overlayTriggered.next(message);
  }
  changeAdherenceNonAdherence(message) {
    this.triggeredAdherenceNonAdherence.next(message);
  }
  changeMedicationAdhrence(message) {
    this.triggeredMedicationAdherence.next(message);
  }
  changeDrawerToggled(message) {
    this.drawerToggled.next(message);
  }
  changeMapValue(message) {
    this.triggerMap.next(message);
  }
  changeLoggedIn(message) {
    this.loggedIn.next(message);
  }
  changeLoadPatientHeader(message) {
    this.loadPatientHeader.next(message);
  }
  changeHighAlertPatient(message) {
    this.triggeredhighAlertPatientNotification.next(message);
  }
  changeTabCounts(val) {
    this.triggeredPatientTabCount.next(val);
  }
  changeCaregiverHighAlertPatient(message) {
    this.caregiverHighAlert.next(message);
  }
  changeMessage(message) {
    this.messageSource.next(message);
  }

  changeHeaderTitle(message) {
    this.triggeredHeaderTitle.next(message);
  }
  changeCount(message) {
    this.triggeredNotificationCount.next(message);
  }
  changeSchedule(message) {
    this.triggerdScheduleCall.next(message);
  }
  changeScheduleCallCount(message) {
    this.triggerdScheduleCallCount.next(message);
  }
  changeGraphs(message) {
    this.triggerdgraphs.next(message);
  }
  changeMaps(message) {
    this.triggerdMaps.next(message);
  }
  changeObservation(message) {
    this.triggerdObservation.next(message);
  }
  changeMatDrawer(message) {
    this.triggerdMatdrawer.next(message);
  }
  changeDates(message) {
    this.triggerdDates.next(message);
  }
  changeApptDate(message) {
    this.triggeredAppts.next(message);
  }
  changeAppointment(message) {
    this.triggerdAppointment.next(message);
  }
  changeObservationHist(message) {
    this.triggerdObservatioHist.next(message);
  }
  changeVitalsHist(message) {
    this.triggerdVitalsHist.next(message);
  }
  changeClaims(message) {
    this.triggerdClaims.next(message);
  }
  changeSelectedMedications(message) {
    this.triggerdSelectedMedication.next(message);
  }
  changeMedications(message) {
    this.triggerdMedications.next(message);
  }
  changeBGTrend(message) {
    this.triggerdBGTrend.next(message);
  }
  changeBPTrend(message) {
    this.triggerdBPTrend.next(message);
  }
  changeBGLine(message) {
    this.triggerdBGLine.next(message);
  }
  changeBPLine(message) {
    this.triggerdBPLine.next(message);
  }
  changeBGAdherence(message) {
    this.triggerdBGAdherence.next(message);
  }
  changeBPAdherence(message) {
    this.triggerdBPAdherence.next(message);
  }
  changehighAlertTabCounts(message) {
    this.triggeredhighAlertTabsCount.next(message);
  }
  changealertTabCounts(message) {
    this.triggeredalertTabsCount.next(message);
  }
  changegoodTabCounts(message) {
    this.triggeredgoodTabsCount.next(message);
  }

  changeNonAdherenceTabCounts(message) {
    this.triggeredNonAdherenceTabsCount.next(message);
  }

  changePatientDrawer(message) {
    this.triggeredPatientDrawer.next(message);
  }

  changePatientCardData(message) {
    this.triggeredPatientCard.next(message);
  }
  changePatientSideNavData(message) {
    this.triggeredPatientSidenavData.next(message);
  }

  changeOnBoardPatientDate(message) {
    this.triggeredPatientonBoardDate.next(message);
  }

  formatDateTime(date) {
    const strTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    this.year = strTime.getFullYear();
    this.month = strTime.getMonth() + 1;
    let dt = strTime.getDate();
    if (dt < 10) {
      dt = dt;
    }
    if (this.month < 10) {
      this.month = this.month;
    }
    let hours = strTime.getHours();
    let minutes = strTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? +minutes : minutes;
    let mins;
    let hrs;
    if (hours.toString().length < 2) {
      // var time = '0' + hours + ':' + minutes + '0' + ' ' + ampm;
      hrs = '0' + hours;
    } else {
      hrs = hours;
    }
    if (minutes.toString().length < 2) {
      // var time = '0' + hours + ':' + minutes + '0' + ' ' + ampm;
      mins = '0' + minutes;
    } else {
      mins = minutes;
    }

    const dateTime =
      dt +
      '/' +
      this.month +
      '/' +
      this.year +
      '\n' +
      hrs +
      ':' +
      mins +
      ' ' +
      ampm;
    return dateTime;
  }
  timeSince(date) {
    const now = new Date();

    const different = now.getTime() - new Date(date).getTime();

    const secondsInMilli = 1000;
    const minutesInMilli = secondsInMilli * 60;
    const hoursInMilli = minutesInMilli * 60;
    const daysInMilli = hoursInMilli * 24;
    const mothsInMilli = daysInMilli * 30;
    const yearInMilli = mothsInMilli * 12;

    let elapsedYear = different / yearInMilli;
    // different = different % yearInMilli;

    const year = elapsedYear.toString().split('.');
    elapsedYear = Number(year[0]);

    let elapsedMonths = different / mothsInMilli;
    // different = different % mothsInMilli;

    const months = elapsedMonths.toString().split('.');
    elapsedMonths = Number(months[0]);

    let elapsedDays = different / daysInMilli;
    // different = different % daysInMilli;
    const days = elapsedDays.toString().split('.');
    if (Number(days[0]) === 0) {
      if (Number(days[0]) === 0 && Number(days[1].charAt(0)) >= 5) {
        elapsedDays = 1;
      } else {
        elapsedDays = 0;
      }
    } else {
      elapsedDays = Number(days[0]);
    }

    if (elapsedDays > 1 && elapsedMonths >= 1 && elapsedYear == 0) {
      if (elapsedMonths > 1) {
        return (
          this._decimalPipe.transform(elapsedMonths, '1.0-0') +
          ' Months, ' +
          this._decimalPipe.transform(elapsedDays, '1.0-0') +
          ' days'
        );
      }
      return (
        this._decimalPipe.transform(elapsedMonths, '1.0-0') +
        ' Month, ' +
        this._decimalPipe.transform(elapsedDays, '1.0-0') +
        ' days'
      );
    }
    if (elapsedDays > 1 && elapsedMonths == 0 && elapsedYear == 0) {
      return this._decimalPipe.transform(elapsedDays, '1.0-0') + ' Days';
    }
    if (elapsedYear > 1 && elapsedMonths > 1 && elapsedDays > 1) {
      return (
        elapsedYear +
        ' Year, ' +
        elapsedMonths +
        ' Months, ' +
        elapsedDays +
        ' days'
      );
    }
    if (elapsedMonths == 0 && elapsedYear == 0) {
      if (elapsedDays > 1) {
        return this._decimalPipe.transform(elapsedDays, '1.0-0') + ' Days';
      } else {
        return this._decimalPipe.transform(elapsedDays, '1.0-0') + ' Day';
      }
    }
    if (elapsedYear == 0 && elapsedMonths != 0) {
      if (elapsedMonths > 1) {
        return this._decimalPipe.transform(elapsedMonths, '1.0-0') + ' Months';
      }
      return this._decimalPipe.transform(elapsedMonths, '1.0-0') + ' Month';
    } else {
      if (elapsedYear && elapsedMonths && elapsedDays) {
        return (
          this._decimalPipe.transform(elapsedYear, '1.0-0') +
          ' Year, ' +
          this._decimalPipe.transform(elapsedMonths, '1.0-0') +
          ' Month ' +
          this._decimalPipe.transform(elapsedDays, '1.0-0') +
          'days '
        );
      } else {
        return '-';
      }
    }
  }

  formatDate(date) {
    const d = new Date(date);
    (this.month = '' + (d.getMonth() + 1)),
      (this.day = '' + d.getDate()),
      (this.year = d.getFullYear());

    if (this.month.length < 2) {
      this.month = '0' + this.month;
    }
    if (this.day.length < 2) {
      this.day = '0' + this.day;
    }

    return [this.year, this.month, this.day].join('-');
  }
}
