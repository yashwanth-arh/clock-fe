import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { CaregiverResponse } from './entities/caregiver';
import { AuthStateService } from '../core/services/auth-state.service';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CaregiverService {
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

  // getAllCaregivers(): any {
  // 	return this.http
  // 		.get<any>(`${this.apiBaseUrl}/caregiver/getCareGivers`, {
  // 		})
  // 		.pipe(
  // 			map((caregivers) => {
  // 				return caregivers;
  // 			})
  // 		);
  // }

  getAllCaregivers(
    pageNumber,
    pageSize,
    sort,
    orgId,
    branchId,
    searchQuery
  ): Observable<CaregiverResponse> {
    let api;
    if (searchQuery && !orgId && !branchId) {
      api = `getAllCareGivers?searchQuery=${searchQuery}`;
    } else if (orgId && searchQuery && !branchId) {
      api = `getAllCareGivers?searchQuery=${searchQuery}&&practice=${orgId}`;
    } else if (!orgId && searchQuery && branchId) {
      api = `getAllCareGivers?searchQuery=${searchQuery}&&clinic=${branchId}`;
    } else if (orgId && !branchId && !searchQuery) {
      api = `getAllCareGivers?practice=${orgId}`;
    } else if (orgId && branchId && !searchQuery) {
      api = `getAllCareGivers?practice=${orgId}&&clinic=${branchId}`;
    } else if (searchQuery && branchId && orgId) {
      api = `getAllCareGivers?searchQuery=${searchQuery}&&clinic=${branchId}&&practice=${orgId}`;
    } else if (!searchQuery && !branchId && !orgId) {
      api = `getAllCareGivers`;
    }
    return this.http
      .get<CaregiverResponse>(`${this.apiBaseUrl}/${api}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('sort', sort),
      })
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  addCaregiver(params: any) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/addCareGiver`, params)
      .pipe(map((res) => {}));
  }
  editCaregiver(id: any, val: any) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateCaregiver/${id}`, val)
      .pipe(map((res) => {}));
  }

  changeStatus(email, val) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/status/${email}/${val}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getCaregiverSearchList(
    pageNumber,
    pageSize,
    sort = 'creationDate,desc',
    searchData
  ): Observable<CaregiverResponse> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sort);
    return this.http
      .get<CaregiverResponse>(
        `${this.apiBaseUrl}/caregivers/search?${params}&searchQuery=${searchData}`,
        {}
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
