import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CallHistory, callStatus } from 'src/app/shared/entities/call-history';

@Injectable({
  providedIn: 'root',
})
export class CallHistoryService {
  public apiBaseUrl: string;
  public omitIgnoreCase = ['roomName', 'status', 'typeOfCall'];
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  createCallRecord(callData: CallHistory): Observable<CallHistory> {
    return this.http
      .post<CallHistory>(`${this.apiBaseUrl}/scheduleCall/create`, callData)
      .pipe(map((data) => data));
  }

  updateCallRecord(callData: CallHistory): Observable<CallHistory> {
    return this.http
      .put<CallHistory>(`${this.apiBaseUrl}/scheduleCall/update`, callData)
      .pipe(map((data) => data));
  }

  getCallRecords(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'scheduledAt',
    sortDirection = 'desc',
    status: callStatus,
    fromDate: string,
    toDate: string,
    searchQuery: string
  ): Observable<any> {
    const sortStr = `${sortColumn},${sortDirection}`;
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sortStr);

    if (status !== null) {
      params = params.set('status', status);
    }
    if (fromDate !== null) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate !== null) {
      params = params.set('toDate', toDate);
    }
    if (searchQuery !== null) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/scheduleCall/getCallDetails`, { params })
      .pipe(
        map((records) => {
          return records;
        })
      );
  }

  searchCallRecords(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'scheduledAt',
    sortDirection = 'desc',
    fromDate: string,
    toDate: string,
    searchQuery: string
  ): Observable<any> {
    const sortStr = `${sortColumn},${sortDirection}`;
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sortStr);
    if (fromDate !== null) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate !== null) {
      params = params.set('toDate', toDate);
    }
    if (searchQuery !== null) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/scheduleCall/getCallDetails`, { params })
      .pipe(
        map((records) => {
          return records;
        })
      );
  }
}
