import { SnackbarService } from './../../core/services/snackbar.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PracticeNPIValidation } from 'src/app/shared/entities/npi-validation';
import { HospitalResponse } from '../entities/hospital';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalManagementService {
  public omitIgnoreCase = [
    'createdAt',
    'name',
    'contactNumber',
    'emailId',
    'address.addressLine',
    'address.state',
    'address.city',
    'practiceNPI',
    'status',
  ];
  public apiBaseUrl: string;
  public ignorecase = '';
  public baseResource: string;
  constructor(
    private http: HttpClient,
    private stateService: AuthStateService,
    private authService: AuthService
  ) {
    this.stateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = environment.apiBaseUrl;
      this.baseResource = res;
    });
  }

  gethospitalList(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): Observable<HospitalResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;

    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<HospitalResponse>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  gethospitalById(hospitalId: any): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals/${hospitalId}`
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }

  edithospital(hospitalId: number, hospitalEditData: any): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals/${hospitalId}`,
        hospitalEditData
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }
  checkUserIsLoggedIn(hospitalId: any): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/checkUserLoggedIn/${hospitalId}`
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }

  createhospital(hospital: any) {
    return this.http
      .post<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals`,
        hospital
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }

  getPracticeList(): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals`
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }

  searchPracticelist(name): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals/list/${name}`
      )
      .pipe(
        map((hospitalData) => {
          return hospitalData;
        })
      );
  }

  gethospitalSearchList(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): Observable<HospitalResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }

    return this.http
      .get<HospitalResponse>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals?${searchData}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr)
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  gethospitalSearchListStatus(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): Observable<HospitalResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }

    return this.http
      .get<HospitalResponse>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitals?status=${searchData}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr)
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  checkIfPracticeNPIExists(
    practiceNPI: string
  ): Observable<PracticeNPIValidation> {
    return this.http
      .get<Observable<PracticeNPIValidation>>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/hospitalNPIExists/${practiceNPI}`
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getSupportTicketsp(statusFilter, pageNumber, pageSize) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getSupportTickets?status=${statusFilter}&page=${pageNumber}&size=${pageSize}`
    );
  }

  changeStatus(e, ticketId) {
    return this.http.put<any>(
      `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/updateTicketStatus/${ticketId}/status/${e}`,
      {}
    );
  }
  closeSupportTicket(ticketId) {
    return this.http.post<any>(
      `${this.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/closeSupportTicketStatus/${ticketId}`,
      {}
    );
  }
  reopenSupportTicket(ticketId) {
    return this.http.post<any>(
      `${this.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/reOpenSupportTicketStatus/${ticketId}/REOPEN`,
      {}
    );
  }
  reassignSupportTicket(ticketId) {
    return this.http.post<any>(
      `${this.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/assignSupportTicket/${ticketId}`,
      {}
    );
  }

  searchStatus(e, pageNumber, pageSize, status) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getSupportTickets?searchQuery=${e}&status=${status}&page=${pageNumber}&size=${pageSize}`
    );
  }
  getSupportTicketsId(id) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getSupportTickets/${id}`
    );
  }
  getSupportTicketsActivity(id) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getSupportTicketsLogs/${id}`
    );
  }
  update;
}
