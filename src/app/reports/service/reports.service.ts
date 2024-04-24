import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import moment from 'moment';

export interface PatientExcelInterface {
  blob: string;
  fileName: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  public apiBaseUrl: string;
  private reportsDate: BehaviorSubject<string | null>;
  constructor(
    private http: HttpClient,
    private stateService: AuthStateService,
    private authService: AuthService
  ) {
    const currentDate = localStorage.getItem('reportDate')
      ? localStorage.getItem('reportDate')
      : moment().format('YYYY-MM-DD');
    this.reportsDate = new BehaviorSubject(currentDate);
    this.stateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }
  get reportsDate$(): Observable<string | null> {
    return this.reportsDate.asObservable();
  }
  setReportDate(value: string): void {
    localStorage.setItem('reportDate', value);
    this.reportsDate.next(value);
  }
  // getPatientReports(patientId: string, date: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiBaseUrl}/patient/${patientId}/reports?date=${date}`)
  //     .pipe(map((data) => data),
  //       catchError(
  //         errorResponse => {
  //           return of(errorResponse);
  //         }
  //       ));
  // }
  getPatientReports(patientId: string, date: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getPatient/${patientId}/reports?date=${date}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getOverallPatientReports(date: string): Observable<PatientExcelInterface> {
    return this.http
      .get<PatientExcelInterface>(
        `${this.apiBaseUrl}/getPatientData?date=${date}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
