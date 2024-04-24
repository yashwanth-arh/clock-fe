import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Disease,
  DiseaseDropDownList,
  DiseaseResponse,
  IcdCodeDropDownList,
} from '../entities/disease';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
@Injectable({
  providedIn: 'root',
})
export class DiseaseService {
  baseResource: string;
  deleteDisease(deleteDisease: any) {
    throw new Error('Method not implemented.');
  }
  addDisease(addDisease: any) {
    throw new Error('Method not implemented.');
  }
  updateDisease(updateDisease: any) {
    throw new Error('Method not implemented.');
  }
  public omitIgnoreCase = ['createdAt'];
  public apiBaseUrl: string;
  public ignorecase = '';
  public icdUrl = 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private stateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
    this.stateService.baseResource.subscribe((res) => {
      this.baseResource = res;
    });
  }

  /**
   * post request to create the disease
   * @param disease : Disease
   */
  createDisease(disease: Disease): Observable<Disease> {
    return this.http
      .post<Disease>(`${this.apiBaseUrl}/newIcdCodes`, disease)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  createDeviceType(device) {
    return this.http.post(`${this.apiBaseUrl}/createDeviceType`, device).pipe(
      map((doctorData) => {
        return doctorData;
      })
    );
  }
  createTicketTitle(body) {
    return this.http
      .post(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/createDefaultIssuesWithPermission`,
        body
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  editTicketTitle(body, id) {
    return this.http
      .put(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/updateDefaultSupportsIssues/${id}`,
        body
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }
  getUserRole() {
    return this.http
      .get(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getSupportPermissionById`
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  getTitles(pageNo, pageSize) {
    return this.http
      .get(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllDefaultSupports?page=${pageNo}&size=${pageSize}`
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  getTitlesSearch(pageNo, pageSize, search) {
    return this.http
      .get(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllDefaultSupports?searchQuery=${search}&page=${pageNo}&size=${pageSize}`
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  editDeviceType(device, id) {
    return this.http
      .put(`${this.apiBaseUrl}/editDeviceType/${id}`, device)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  editbaselineBp(val, id) {
    return this.http.post(`${this.apiBaseUrl}/updateBaseLine/${id}`, val).pipe(
      map((doctorData) => {
        return doctorData;
      })
    );
  }

  updateClinicBp(val, id) {
    return this.http.post(`${this.apiBaseUrl}/updateClinicBp/${id}`, val).pipe(
      map((doctorData) => {
        return doctorData;
      })
    );
  }

  /**
   * put request to create the disease
   * @param disease : Disease
   */
  // editDisease(disease: Disease, diseaseId: string): Observable<Disease> {
  //   return this.http
  //     .put<Disease>(`${this.apiBaseUrl}/diseases/${diseaseId}`, disease)
  //     .pipe(
  //       map((doctorData) => {
  //         return doctorData;
  //       })
  //     );
  // }
  editDisease(disease: Disease, diseaseId: string): Observable<Disease> {
    return this.http
      .put<Disease>(`${this.apiBaseUrl}/updateIcdCode/${diseaseId}`, disease)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  changeIcdCodeStatus(diseaseId: string, status: string) {
    return this.http
      .put<Disease>(
        `${this.apiBaseUrl}/changeIcdCodeStatus/${diseaseId}/${status}`,
        {}
      )
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  /**
   * get all disease
   * @param disease : Disease
   */
  getAllDisease(
    pageNumber = 0,
    pageSize = 10,
    searchQuery
  ): Observable<DiseaseResponse> {
    // let sortStr = `${sortDirection}`;
    // if (!this.omitIgnoreCase.includes(sortColumn)) {
    //   sortStr += '';
    // }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sortStr);

    // if (searchQuery != null && searchQuery != '') {
    //   params = params.set('searchQuery', searchQuery);
    // }
    return this.http
      .get<DiseaseResponse>(
        `${this.apiBaseUrl}/getAllIcdCodes?${searchQuery ? searchQuery : ''}`,
        { params }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  // getAllDisease(
  //   pageNumber = 0,
  //   pageSize = 10,
  //   sortColumn = 'createdAt',
  //   sortDirection = 'desc',
  //   searchQuery
  // ): Observable<DiseaseResponse> {
  //   let sortStr = `${sortColumn},${sortDirection}`;
  //   if (!this.omitIgnoreCase.includes(sortColumn)) {
  //     sortStr += '';
  //   }
  //   let params = new HttpParams()
  //     .set('page', pageNumber.toString())
  //     .set('size', pageSize.toString())
  //     .set('sort', sortStr);

  //   if (searchQuery != null && searchQuery != '') {
  //     params = params.set('searchQuery', searchQuery);
  //   }
  //   return this.http
  //     .get<DiseaseResponse>(`${this.apiBaseUrl}/diseases`, { params })
  //     .pipe(
  //       catchError((errorResponse) => {
  //         return of(errorResponse);
  //       })
  //     );
  // }

  /**
   * get all disease for dropdown
   * @param disease : Disease
   */
  getDiseaseList(): Observable<DiseaseDropDownList> {
    return this.http
      .get<DiseaseDropDownList>(`${this.apiBaseUrl}/plaindiseaselist`)
      .pipe(
        map((doctorData) => {
          return doctorData;
        })
      );
  }

  /**
   * get disease ICD codes
   */
  getICDCodes(searchText: string, listSize = 50): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.icdUrl}`, {
        params: new HttpParams()
          .set('sf', 'code,name')
          .set('terms', searchText)
          .set('maxList', listSize.toString()),
      })
      .pipe(
        map((data) => data[3]),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   * Fetch disease list based on search
   */
  fetchDiseaseList(searchText: string): Observable<IcdCodeDropDownList> {
    return this.http
      .get<IcdCodeDropDownList>(
        `${this.apiBaseUrl}/diseases/byname/${searchText}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
