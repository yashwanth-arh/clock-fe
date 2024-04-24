import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class BulkUploadService {
  public apiBaseUrl: string;
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

  uploadReport(params: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/patients/bulk/upload`, params)
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }
}
