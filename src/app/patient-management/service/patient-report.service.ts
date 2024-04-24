import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  ClaimTimes,
  PatientDeviceCategory,
  PatientReport,
  ReportData,
} from '../entities/reports';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class PatientReportService {
  public apiBaseUrl: string;
  public notesContent: BehaviorSubject<string | null>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.notesContent = new BehaviorSubject('');
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  get notesContentObs(): Observable<string | null> {
    return this.notesContent.asObservable();
  }

  setNotesContent(value: string): void {
    this.notesContent.next(value);
  }

  public getPatientCategoryData(
    patientId: string,
    category: string,
    pageIndex: number
  ): Observable<ReportData> {
    return this.http
      .get<ReportData>(`${this.apiBaseUrl}/ihealth/patientdata`, {
        params: new HttpParams()
          .set('patientId', patientId)
          .set('category', category)
          .set('pageIndex', pageIndex.toString()),
      })
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getClaimRPMTimeByPatient(patientId: string): Observable<ClaimTimes> {
    return this.http
      .get<ClaimTimes>(
        `${this.apiBaseUrl}/claims/remainingclaimtime/${patientId}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getCategories(patientId: string): Observable<PatientDeviceCategory> {
    return this.http
      .get<Observable<PatientDeviceCategory>>(
        `${this.apiBaseUrl}/healthdevices/CategoryByPatientId/${patientId}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  addNote(noteData: any): Observable<PatientDeviceCategory> {
    return this.http
      .post<PatientDeviceCategory>(`${this.apiBaseUrl}/comments`, noteData)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getNote(
    patientId: string,
    sortColumn = 'createdAt',
    sortDirection = 'asc',
    fromDate: any,
    toDate: any,
    category: string
  ): Observable<PatientDeviceCategory> {
    const sortStr = `${sortColumn},${sortDirection}`;
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('sort', sortStr);
    return this.http
      .get<Observable<PatientDeviceCategory>>(
        `${this.apiBaseUrl}/comments/${patientId}/${category}?${params}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  downloadReport(
    patientId: string,
    fromdate: string,
    todate: string,
    vitals: boolean,
    notes: boolean,
    comment: boolean,
    claims: boolean
  ): Observable<PatientReport> {
    return this.http
      .get<Observable<PatientReport>>(
        `${this.apiBaseUrl}/patient/${patientId}/reports?fromDate=${fromdate}&toDate=${todate}&vitals=${vitals}&notes=${notes}&comments=${comment}&claims=${claims}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  editNote(commentId: string, formData): Observable<PatientDeviceCategory> {
    return this.http
      .put<Observable<PatientDeviceCategory>>(
        `${this.apiBaseUrl}/comments/${commentId}`,
        formData
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  deleteNote(commentId: string): Observable<PatientDeviceCategory> {
    return this.http
      .delete<Observable<PatientDeviceCategory>>(
        `${this.apiBaseUrl}/comments/${commentId}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
