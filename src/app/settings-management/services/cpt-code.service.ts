import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CptCode, CptListing, CptResponse } from '../entities/cpt-code';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
@Injectable({
  providedIn: 'root',
})
export class CptCodeService {
  public omitIgnoreCase = ['createdAt'];
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

  /**
   * post request to create the cpt code
   * @param cptCode : CptCode
   */
  addCPTCode(cptCode: CptCode): Observable<CptCode> {
    return this.http.post<CptCode>(`${this.apiBaseUrl}/cptcodes`, cptCode).pipe(
      map((code: CptCode) => {
        return code;
      })
    );
  }

  /**
   * put request to create the cpt code
   * @param cptCode : CptCode
   */
  editCPTCode(cptCode: CptCode, codeId: string): Observable<CptCode> {
    return this.http
      .put<CptCode>(`${this.apiBaseUrl}/cptcodes/${codeId}`, cptCode)
      .pipe(
        map((code) => {
          return code;
        })
      );
  }

  /**
   * get all disease
   * @param disease : Disease
   */
  getAllCPTCode(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchQuery = null
  ): Observable<CptResponse> {
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += '';
    }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sortStr);

    if (searchQuery != null && searchQuery != '') {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<CptResponse>(`${this.apiBaseUrl}/cptcodes`, { params })
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   * get all disease for dropdown
   * @param disease : Disease
   */
  getPlainCPTList(id): Observable<CptListing> {
    return this.http
      .get<CptListing>(`${this.apiBaseUrl}/plaincptcodelist?patientId=${id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPlainPatientList(): Observable<CptListing> {
    return this.http.get<any>(`${this.apiBaseUrl}/plainPatientlist`).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
