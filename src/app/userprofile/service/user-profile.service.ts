import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResetPassword, Profile } from '../entities/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  public apiBaseUrl: string;
  public iheathApi: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  // getUserDetails(): Observable<Profile> {
  //   return this.http.get<Profile>(`${this.apiBaseUrl}/getProfileDetails`).pipe
  //     (map(data => {
  //       return data;
  //     }));
  // }

  updateUserDetails(userData: Profile): Observable<Profile> {
    return this.http
      .put<Profile>(`${this.apiBaseUrl}/getProfileDetails`, userData)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  resetPassword(resetPassword: ResetPassword): Observable<ResetPassword> {
    return this.http
      .post<ResetPassword>(`${this.apiBaseUrl}/resetpassword`, resetPassword)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
