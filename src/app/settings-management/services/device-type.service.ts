import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { DeviceUpload } from 'src/app/shared/entities/device';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
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

  getAllDeviceType(
    pageNumber = 0,
    pageSize = 10,

    searchQuery = null
  ): any {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (searchQuery != null) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllDeviceTypes`, { params })
      .pipe(
        map((devicetypes) => {
          return devicetypes;
        })
      );
  }
  getNewDeviceTypes() {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllDeviceTypes`, {}).pipe(
      map((devicetypes) => {
        return devicetypes;
      })
    );

    // return this.http.get<any>(`${this.apiBaseUrl}/getDeviceNameList`, {}).pipe(
    //   map((devicetypes) => {
    //     return devicetypes;
    //   })
    // );
  }
  getAllDeviceTypeWithoutPagination() {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllDeviceType`).pipe(
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

  // getCategory() {
  //   return this.http.get<any>(`${this.apiBaseUrl}/deviceTypes`, {}).pipe(
  //     map((devicetypes) => {
  //       return devicetypes;
  //     })
  //   );

  // }
  getVendorNames() {
    return this.http.get<any>(`${this.apiBaseUrl}/getVendorName`).pipe(
      map((vendors) => {
        return vendors;
      })
    );
  }

  getVendors(pageNumber = 0, pageSize = 10, searchQuery = null): any {
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
    if (searchQuery != null && searchQuery != '') {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/getVendorNameList`, { params })
      .pipe(
        map((vendors) => {
          return vendors;
        })
      );
  }

  getModelId(val) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getVendorAndTypeByDeviceModelId/${val}`, {})
      .pipe(
        map((vendors) => {
          return vendors;
        })
      );
  }
  getAllDeviceList(vid, did) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllDeviceList/${vid}/${did}`, {})
      .pipe(
        map((vendors) => {
          return vendors;
        })
      );
  }
  getDeviceTypeDropdownList(): any {
    return this.http.get<any>(`${this.apiBaseUrl}/deviceTypes/list`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  createVendor(value): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/createVendorName`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  downloadVendorFile(fileDownloadUrl) {
    return this.http
      .get<Blob>(
        `${environment.apiBaseUrl}/${environment.profile_service}/downloadFile?keyName=${fileDownloadUrl}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAllVendorListById(id) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllVendorListById/${id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteAttachment(id) {
    return this.http
      .delete<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/deleteVendorAttachement/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateVendor(value, id): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/editVendorName/${id}`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  bulkUploadDevice(val): Observable<DeviceUpload> {
    return this.http
      .post<DeviceUpload>(`${this.apiBaseUrl}/bulkuploaddev`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  public downloadFile(response: DeviceUpload): any {
    const byteCharacters = atob(response.blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.type });
    const file = new File([blob], response.fileName, { type: response.type });
    saveAs(file);
  }
  public downloadFileForHospital(response): any {
    const byteCharacters = atob(response.blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.type });
    const file = new File([blob], response.fileName, { type: response.type });
    saveAs(file);
  }
}
