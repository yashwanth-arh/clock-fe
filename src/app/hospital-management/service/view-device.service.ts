import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class viewDeviceService {
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

  getHealthDeviceByHospitalId(OrgId, status, pageNumber = 0, pageSize = 10) {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    // if (!this.omitIgnoreCase.includes(sortColumn)) {
    //   sortDirection += '';
    // }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sortDirection);
    // if (searchQuery != null && searchQuery != '') {
    //   params = params.set('searchQuery', searchQuery);
    // }
    return this.http
      .get(
        `${this.apiBaseUrl}/getHealthDeviceByHospitalId/${OrgId}?status=${status}`,
        { params }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getHealthDeviceByHospitalWithoutPaginationId(status) {
    return this.http
      .get(`${this.apiBaseUrl}/searchHealthDeviceForAssign?status=${status}`)
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getAllUnsignedHealthDevice() {
    return this.http.get(`${this.apiBaseUrl}/getAllUnsignedHealthDevice`).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getUnassignedDeviceList(status, pageNumber, pageSize) {
    return this.http
      .get(
        `${this.apiBaseUrl}/searchHealthDevice?${
          status ? status : ''
        }&page=${pageNumber}&size=${pageSize}`
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getUnassignedDeviceListForDropdown(status) {
    return this.http
      .get(`${this.apiBaseUrl}/searchHealthDevice?status=${status}`)
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  assignHealthDeviceToHospital(imei, hid) {
    return this.http
      .put(
        `${this.apiBaseUrl}/assignHealthDeviceToHospital/imeiNumber/${imei}`,
        { hospitalId: hid }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  unAssignHealthDeviceToHospital(imei, Hid) {
    return this.http
      .put(`${this.apiBaseUrl}/unAssignPatient/${imei}/unAssignDevice`, {
        hospitalId: Hid,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  unAssignHealthDeviceToPatient(imei, Pid) {
    return this.http
      .put(`${this.apiBaseUrl}/unAssignPatient/${imei}/unAssignDevice`, {
        patientId: Pid,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  bulkUploadDevice(val) {
    return this.http.post(`${this.apiBaseUrl}/bulkuploaddev`, val).pipe(
      map((data) => {
        return data;
      })
    );
  }
  bulkUploadDevices(val) {
    return this.http.post(`${this.apiBaseUrl}/bulkupload`, val).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
