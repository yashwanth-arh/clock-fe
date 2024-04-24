import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientActivationService {
  public apiBaseUrl: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
  }

  // setPassword(val: any): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiBaseUrl}/setPassword`, val)
  //     .pipe(
  //       map((data) => {
  //         return data
  //       }),
  //     )
  // }
  setPassword(val, token) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/setPassword/${token}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  // activationTokenValidation(key, val) {
  //   return this.http
  //     .post<any>(`${this.apiBaseUrl}/checkActivationTokenValid?key=${key}`, val)
  //     .pipe(
  //       map((data) => {
  //         return data
  //       }),
  //     )
  // }
  activationTokenValidation(val) {
    return this.http.post<any>(`${this.apiBaseUrl}/checkTokenValid`, val).pipe(
      map((data) => {
        return data;
      })
    );
  }
  tokenValidation(key, val) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/checkTokenValid?key=${key}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
