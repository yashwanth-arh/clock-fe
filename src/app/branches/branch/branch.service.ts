import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { ClinicNPIValidation } from 'src/app/shared/entities/npi-validation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  public omitIgnoreCase = [
    'lastUpdatedAt',
    'createdAt',
    'name',
    'hospital',
    'address.addressLine',
    'address.city',
    'address.state',
    'primaryContactNumber',
    'clinicNPI',
    'status',
  ];
  public apiBaseUrl: string;
  public ignorecase = '';

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

  getAllBranch(
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    status,
    practice,
    city,
    searchQuery
  ): any {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sortStr);

    if (status !== null) {
      params = params.set('status', status);
    }
    if (practice !== null) {
      params = params.set('practice', practice);
    }
    if (city !== null) {
      params = params.set('city', city);
    }
    if (searchQuery !== null) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http.get<any>(`${this.apiBaseUrl}/facilities`, { params }).pipe(
      map((branches) => {
        return branches;
      })
    );
  }
  getAllBranchforProviders(pageNumber, pageSize): any {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sortStr);

    return this.http.get<any>(`${this.apiBaseUrl}/facilities`, { params }).pipe(
      map((branches) => {
        return branches;
      })
    );
  }
  getAllBranchforProvidersWithoutPagination(): any {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllSpecialitieslist`).pipe(
      map((branches) => {
        return branches;
      })
    );
  }

  addBranch(params: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/facility`, params)
      .pipe(map(() => {}));
  }

  updateStatusForFacility(status, FId) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/facility/${FId}/status/${status}`, {})
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }

  editBranch(branchId, params: any): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/facility/${branchId}`, params)
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }
  getBranchById(branchId): any {
    return this.http.get<any>(`${this.apiBaseUrl}/branchs/${branchId}`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getOrgBranchList(pageNumber = 0, pageSize = 10, sort, orgId): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/branchs/byhospital/${orgId}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('sort', sort),
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getBranchListBydocId(id): any {
    return this.http.get<any>(`${this.apiBaseUrl}/branchlist/${id}`).pipe(
      map((branchData) => {
        return branchData;
      })
    );
  }
  getBranchDropdownList(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllFacilitiesByHospital`)
      .pipe(
        map((branchData) => {
          return branchData;
        })
      );
  }

  getFilteredhospitalBranch(key: string): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/branchlist/byhospital/${key}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  statusChange(key: string, id): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/patient/${id}/status/${key}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getBranchDoctor(key: string, role: any): any {
    if (role == 'FACILITY_USER') {
      return this.http.get<any>(`${this.apiBaseUrl}/getPrimaryPhysician`).pipe(
        map((data) => {
          return data;
        })
      );
    } else {
      return this.http
        .get<any>(`${this.apiBaseUrl}/getPrimaryPhysician?facilityId=${key}`)
        .pipe(
          map((data) => {
            return data;
          })
        );
    }
  }

  getBranchDoctor1(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllProvidersByHospital`)
      .pipe(
        map((data) => {
          return data.doctorList;
        })
      );
  }

  getOrgClinicList(orgId): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/branchs/byhospital/${orgId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getClinicDropdownList(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllFacilitiesByHospital`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  addClinicTiming(params: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/createClinicSession`, params)
      .pipe(map(() => {}));
  }
  updateClinicTiming(params: any, id: any): any {
    return this.http
      .post<any>(`${this.apiBaseUrl}/updateClinicTiming/${id}`, params)
      .pipe(map((res) => {}));
  }

  checkIfClinicNPIExists(clinicNPI: string) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/facilityNPIExists/${clinicNPI}`)
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
