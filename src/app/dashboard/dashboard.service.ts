import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { AuthStateService } from '../core/services/auth-state.service';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public apiBaseUrl: string;
  public iheathApi: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);
    // eslint-disable-next-line import/no-deprecated
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }
  getDashboardCardData() {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllSummary`, {}).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getHospitalsGraph() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getHospitalSummaryByFilter`, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getFacilityGraph() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getFacilitySummaryByFilter`, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getPatientGraph() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getPatientSummaryByFilter`, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getCareProviderGraph() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getCareProviderSummaryByFilter`, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
