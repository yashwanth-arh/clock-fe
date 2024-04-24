import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class ZipStateCityService {
  public apiBaseUrl: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private http: HttpClient
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }
  getUSZip() {
    return this.http.get<any>(`${this.apiBaseUrl}/api/zip`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getStateCity(zip) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/api/zip/search?zip=${zip}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
