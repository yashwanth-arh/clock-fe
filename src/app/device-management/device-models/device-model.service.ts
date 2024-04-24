import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
@Injectable({
  providedIn: 'root',
})
export class DeviceModelService {
  public omitIgnoreCase = ['createdAt'];
  public apiBaseUrl: string;
  public ignorecase = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  getAllModels(
    pageNumber = 0,
    pageSize,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchQuery = null
  ): any {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortDirection += '';
    }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sortDirection);
    if (searchQuery != null && searchQuery != '') {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllDeviceList`, { params })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAllModelsWithoutPagination(): any {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllDevice`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addDeviceModel(params: any) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/createDeviceName`, params)
      .pipe(map((res) => {}));
  }

  editDeviceModel(id, params) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateDeviceName/${id}`, params)
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }
}
