import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DeviceResponse } from '../entities/device';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
@Injectable({
  providedIn: 'root',
})
export class DeviceManagementService {
  public apiBaseUrl = `${environment.apiBaseUrl}/${environment.profile_service}`;

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

  getDeviceList(pageNumber = 0, pageSize = 10): Observable<DeviceResponse> {
    return this.http
      .get<DeviceResponse>(
        `${this.apiBaseUrl}/searchHealthDevice?searchQuery`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sort),
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getDeviceById(deviceId: any): Observable<any> {
    return this.http
      .get<any>(`${this.apiBaseUrl}/healthdevices/${deviceId}`, {})
      .pipe(
        map((deviceData) => {
          return deviceData;
        })
      );
  }

  editDevice(deviceId: number, deviceEditData: any): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/updateHealthDevices/${deviceId}`,
        deviceEditData
      )
      .pipe(
        map((deviceData) => {
          return deviceData;
        })
      );
  }

  createDevice(device: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiBaseUrl}/createHealthDevice`, device)
      .pipe(
        map((deviceData) => {
          return deviceData;
        })
      );
  }

  getDeviceFilters(
    pageNumber = 0,
    pageSize = 10,
    sort = 'createdAt,desc',
    searchData
  ): Observable<DeviceResponse> {
    return this.http
      .get<DeviceResponse>(
        `${this.apiBaseUrl}/searchHealthDevice?${searchData ? searchData : ''}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sort),
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  assignDevice(deviceId: string, practice: string): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/assignHealthDeviceToHospital/imeiNumber/${deviceId}`,
        practice
      )
      .pipe(
        map((deviceData) => {
          return deviceData;
        })
      );
  }
}
