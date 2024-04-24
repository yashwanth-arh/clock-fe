import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PatientDeviceService {
  public apiBaseUrl = `${environment.apiBaseUrl}`;

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
  getAllDeviceList(
    patientid,
    status = null,
    pageNumber,
    pageSize,
    searchQuery = null,
    category = null
  ): any {
    // const sort = `${sortColumn},${sortDirection}`;
    let params = new HttpParams();
    // .set('page', pageNumber.toString())
    // .set('size', pageSize.toString())
    // if (category) {
    //   params = params.set('category', category);
    // }
    if (status) {
      params = params.set('status', status);
    }
    if (searchQuery) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/healthdevices/byPatientId/${patientid}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('status', status.toString()),
        // .set('searchQuery', searchQuery.toString()),
      })

      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  assignDevice(deviceId: any, body: any): any {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/healthdevices/${deviceId}/assignDevice`,
        body
      )
      .pipe(map(() => {}));
  }
  assignHealthDevicesToPatient(imei: any, body: any) {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/assignHealthDevicesToPatient/imeiNumber/${imei}`,
        body
      )
      .pipe(map(() => {}));
  }
  unAssignPatientForFacilityUser(imei: any, patientId: any) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/unAssignPatient/${imei}/unAssignDevice`, {
        patientId: patientId,
      })
      .pipe(map(() => {}));
  }

  unassignDevice(deviceId: any, body: any): any {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/healthdevices/${deviceId}/unAssignDevice`,
        body
      )
      .pipe(map(() => {}));
  }

  getUnassignedDevice(id): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/healthdevices/unassigned/${id}`)
      .pipe(
        map((unassignedDevice) => {
          return unassignedDevice;
        })
      );
  }
  getDevicesByOrgId(id): any {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/healthdevices?practice=${id}&status=UNASSIGNED`,
        {}
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getDevicesPracticeAdmin(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/healthdevices?status=UNASSIGNED`, {})
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getDevicesClinicAdmin(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/healthdevices/unassigned`, {})
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getUnassignedDevicesByUser(): any {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllDevicesUnAssignedForRoleFacilityUser/unassigned`,
        {}
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getUnassignedDeviceList(status) {
    return this.http
      .get(
        `${this.apiBaseUrl}/searchHealthDevice?${
          status !== 'ASSIGNED_HOS' ? status : `status=${status}`
        }`
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
