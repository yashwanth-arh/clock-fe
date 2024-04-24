import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationCount } from 'src/app/shared/entities/notification';
import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {
  private appNotificationCount: BehaviorSubject<number>;
  public apiBaseUrl: string;

  constructor(
    private authService: AuthService,
    private authStateService: AuthStateService,
    private http: HttpClient
  ) {
    this.appNotificationCount = new BehaviorSubject(0);
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  get notificationCount(): Observable<number> {
    return this.appNotificationCount.asObservable();
  }
  setNotificationCount(value: number): void {
    this.appNotificationCount.next(value);
  }

  getNotificationCount(): Observable<NotificationCount> {
    return this.http
      .get<NotificationCount>(`${this.apiBaseUrl}/notifications/count`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  postloginDetails(val) {
    return this.http.post<any>(`${this.apiBaseUrl}/addLoginDetails`, val).pipe(
      map((data) => {
        return data;
      })
    );
  }
  updatelogoutStatus(val) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateLogoutDuration`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
