import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  public apiBaseUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
  }

  forgotPassword(emailId: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiBaseUrl}/forgotPassword/${emailId}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updatePassword(val, token) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/updatePassword/${token}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  bpGainPatternGraph(val, id, sessionId) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/bpGainPatternGraph/${id}/${sessionId}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
