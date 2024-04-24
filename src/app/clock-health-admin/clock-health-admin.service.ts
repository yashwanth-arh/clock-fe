import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { catchError } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProviderNPIValidation } from 'src/app/shared/entities/npi-validation';

@Injectable({
  providedIn: 'root',
})
export class CHAdminService {
  public omitIgnoreCase = [
    'createdAt',
    'name',
    'clinicNames',
    'specializations',
    'homeNumber',
    'cellNumber',
    'emailId',
    'address.addressLine',
    'address.state',
    'address.city',
    'docNPI',
    'locNPI',
  ];

  public apiBaseUrl: string;
  public ignorecase = '';
  public userBaseUrl: any = [];
  public baseUrl: string;
  constructor(
    private http: HttpClient,
    private stateService: AuthStateService,
    private authService: AuthService
  ) {
    this.baseUrl = environment.apiBaseUrl;
    this.stateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  getCHAdmins(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): Observable<any> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllClockHealthUser`, {
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
  createCHAdmin(value): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/createClockHealthUser`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateCHAdmin(id, value): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/clockHealthUsers/${id}`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  CHAdminStatusChange(id, value) {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/clockHealthUser/${id}/status/${value}`,
        value
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
