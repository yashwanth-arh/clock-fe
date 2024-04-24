import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { Observable } from 'rxjs';
import { Notification, NotificationResponse } from '../entities/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public omitIgnoreCase = [
    'description',
    'createdTime',
    'seen',
    'lastUpdatedAt',
  ];
  public apiBaseUrl: string;
  public ignorecase = '';

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

  // eslint-disable-next-line max-len
  getAllNotification(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdTime',
    sortDirection = 'desc'
  ): Observable<NotificationResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;

    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/notifications`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('sort', sortStr),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getStatus(notificationId): Observable<Notification> {
    return this.http
      .put<any>(`${this.apiBaseUrl}/notifications/${notificationId}/status`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  // eslint-disable-next-line max-len
  getAllUnreadNotify(
    pageNumber = 0,
    pageSize = 5,
    sortColumn = 'createdTime',
    sortDirection = 'desc'
  ): Observable<NotificationResponse> {
    const sort = `${sortColumn},${sortDirection}`;
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sort);
    return this.http
      .get<any>(`${this.apiBaseUrl}/notifications/unread`, { params })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getSearchNotification(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdTime',
    sortDirection = 'desc',
    formData: any
  ): Observable<NotificationResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;

    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/notifications?${formData}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('sort', sortStr),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
