import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HospitalResponse } from '../entities/hospital';
import {
  hospitalUserResponse,
  hospitalUserResponseDevice,
} from '../entities/hospital-user';

@Injectable({
  providedIn: 'root',
})
export class hospitalUserService {
  public omitIgnoreCase = [
    'createdAt',
    'firstName',
    'userRole',
    'designation',
    'emailId',
    'contactNumber',
    'status',
  ];
  public apiBaseUrl: string;
  public ignorecase = '';

  constructor(
    private http: HttpClient,
    private stateService: AuthStateService,
    private authService: AuthService
  ) {
    this.stateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  gethospitalUsersList(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): Observable<hospitalUserResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;

    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<HospitalResponse>(`${this.apiBaseUrl}/hospitalusers`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString()),
        // .set('sort', sortStr),
      })
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  createhospitalUser(params: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/hospitalsUsers`, params)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  updatehospitalUser(hospitalId: any, params: any): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/hospitalsUsers/${hospitalId}`, params)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  adminAccess(hospitalId: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/provideAccess/${hospitalId}`, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  updatehospitalUserStatus(hospitalId: any, params: any): any {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/hospitalsUsers/${hospitalId}/status/${params}`,
        {}
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  gethospitalUserById(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    OrgId,
    searchData
  ): Observable<hospitalUserResponse> {
    searchData ? searchData : '';
    let sortStr = `${sortColumn},${sortDirection}`;

    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/hospitalsUsers?hospital=${OrgId}${
          searchData ? '&' + searchData : ''
        }`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getHealthDeviceByHospitalId(OrgId) {
    return this.http
      .get(`${this.apiBaseUrl}/getHealthDeviceByHospitalId/${OrgId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
