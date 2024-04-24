import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  HeartRate,
  HighPressure,
  LowPressure,
  ReportChartDataOutput,
} from 'src/app/shared/entities/report.category';
import { ReviewSummary } from 'src/app/shared/entities/review-summary';
import { ReportData } from '../entities/reports';

@Injectable({
  providedIn: 'root',
})
export class IhealthService {
  public apiBaseUrl: string;
  public apiBaseUrlHealth: string;
  public HPressure = HighPressure;
  public LPressure = LowPressure;
  public HR = HeartRate;
  constructor(
    private authStateService: AuthStateService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrlHealth = this.authService.generateBaseUrl('IHEALTH');
      this.apiBaseUrl += `/${res}`;
    });
  }

  getPatientVitals(
    patientId: string,
    category: string,
    fromDate: Date,
    toDate: Date,
    pageSize = 100
  ): Observable<ReportData> {
    return this.http
      .get<Observable<ReportData>>(
        `${this.apiBaseUrlHealth}/vitals/${category}/bypatient/${patientId}?`,
        {
          params: new HttpParams()
            .set('fromDate', fromDate.toString())
            .set('toDate', toDate.toString())
            .set('size', pageSize.toString())
            .set('sort', 'measurementDate,desc'),
        }
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getPatientReviewSummary(patientId: string): Observable<ReviewSummary> {
    return this.http
      .get<Observable<ReviewSummary>>(
        `${this.apiBaseUrlHealth}/patientreviewsummary/${patientId}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  updatePatientReviewSummary(
    patientId: string,
    data: ReviewSummary
  ): Observable<ReviewSummary> {
    return this.http
      .put<Observable<ReviewSummary>>(
        `${this.apiBaseUrlHealth}/patientreviewsummary/${patientId}`,
        data
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  syncIhealthData(patientId: string): Observable<any> {
    return this.http
      .post<Observable<any>>(
        `${this.apiBaseUrlHealth}/ihealth/cronjobs`,
        {},
        {
          params: new HttpParams().set('patientId', patientId),
        }
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
