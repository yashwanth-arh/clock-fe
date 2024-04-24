import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { catchError } from 'rxjs/operators';
import { DoctorResponse } from '../entities/doctor';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProviderNPIValidation } from 'src/app/shared/entities/npi-validation';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
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

  getDoctorList(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): Observable<DoctorResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<DoctorResponse>(
        `${
          this.apiBaseUrl
        }/getAllProviders?page=${pageNumber}&size=${pageSize}${
          searchData ? `&${searchData}` : ''
        }`
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  getDoctorById(doctorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/doctors/${doctorId}`).pipe(
      map((doctorData) => {
        return doctorData;
      })
    );
  }

  editDoctor(doctorId: number, editDoctorData: any): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/updateCareProviderDetails/${doctorId}`,
        editDoctorData
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  createCareProvider(createDoctorData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiBaseUrl}/addNewCareProvider`, createDoctorData)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  getPracticeList(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/hospitals/list`).pipe(
      map((hospitalData) => {
        return hospitalData;
      })
    );
  }
  searchFacility(value): any {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getFacilityUsersForHospitalUser?searchQuery=${value}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getFacilityList(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getFacilityUsersForHospitalUser`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  mapFacilityToProvider(value) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/mapFacilityToProviderByHospital`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  unmapFacilityFromProvider(value) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/facilityUnmappedforCareprovider`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  mappedFacilities(id) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllMappedFacilities/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getCareProviders() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllProvidersByRole`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getCareProvidersById(id) {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllProvidersByRole?careproviderId=${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  searchFacilityAdminCareProviders(value) {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllProvidersByRole?searchQuery=${value}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  searchHospitalAdminCareProviders(id, value) {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllProvidersByRole?careproviderId=${id}&searchQuery=${value}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  mapCareproviderToProvider(value) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/mapProviderToProvider`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  mappedCareProviders(id) {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllMappedCareProviders/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  unmapCareProviderFromProvider(value) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/unmapCareprovider`, value)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getSpecialization(): any {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllCareProviderSpecialties`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  addClinicsToDoctor(doctorId: string, clinicIds: string): any {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/doctors/${doctorId}/clinics?clinicIds=${clinicIds}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDoctorsDropdownList(): any {
    return this.http.get<any>(`${this.apiBaseUrl}/plaindoctorlist`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDoctorSearchList(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): Observable<DoctorResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<DoctorResponse>(`${this.apiBaseUrl}/getAllProviders?${searchData}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString()),
        // .set('sort', sortStr),
      })
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  checkIfProvderNPIExists(
    providerNPI: string
  ): Observable<ProviderNPIValidation> {
    return this.http
      .get<Observable<ProviderNPIValidation>>(
        `${this.apiBaseUrl}/providerNPIExists/${providerNPI}`
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getCareCoordinators(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): Observable<DoctorResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    return this.http
      .get<DoctorResponse>(
        `${
          this.apiBaseUrl
        }/getAllCareCoordinators?page=${pageNumber}&size=${pageSize}&${
          searchData ? searchData : ''
        }`
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  getCareCoordinatorSearchList(
    pageNumber = 0,
    pageSize = 10,
    searchData
  ): Observable<DoctorResponse> {
    // let sortStr = `${sortColumn},${sortDirection}`;
    // if (!this.omitIgnoreCase.includes(sortColumn)) {
    //   sortStr += ',ignorecase';
    // }
    return this.http
      .get<DoctorResponse>(
        `${this.apiBaseUrl}/getAllCareCoordinators?${searchData}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        }
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  createCareCoordinator(values: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiBaseUrl}/addNewCareCoordinator`, values)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  updateCareCoordinator(id, values: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateCareCoordinatorDetails/${id}`, values)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  updateStatusCoordinator(value, id) {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/changeCareCoordinatorStatus/${id}/status/${value}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateStatusCareprovider(value, id) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/careProvider/${id}/status/${value}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
