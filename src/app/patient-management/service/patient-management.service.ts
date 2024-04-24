import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Patient, PatientResponse } from '../entities/patient';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PatientManagementService {
  public apiBaseUrl: string;
  public iheathApi: string;
  private sanitizer: DomSanitizer;
  public uniqueUrl: string;

  fileUrl;
  baseResource: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);
    this.uniqueUrl = environment.uniqueUrl;

    this.authStateService.baseResource.subscribe((res) => {
      this.baseResource = res;
      // this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      // this.apiBaseUrl += `/${res}`;
    });
  }
  getPatientByBranchId(
    id,
    pageNumber,
    pageSize,
    sort
  ): Observable<PatientResponse> {
    return this.http
      .get<any>(`${this.apiBaseUrl}/patients/clinic=${id}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('sort', sort),
      })
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getPatientByBranchIdnDocId(branchId, docId, pageNumber, pageSize, sort) {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllpatients/clinic=${branchId}&&provider=${docId}`,
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
  bulkUploadDevice(val, orgId, orgName, branchId, branchName, docId, docName) {
    return this.http
      .post<any>(
        `${this.apiBaseUrl}/bulkuploadpat/${orgId}/${orgName}/${branchId}/${branchName}/${docId}/${docName}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  /**
   * Get Patient List
   */

  // eslint-disable-next-line max-len
  public getAllPatients(
    pageNumber = 0,
    pageSize = 10,
    // sort = 'createdAt,desc',
    clinic,
    provider,
    searchData
  ): Observable<PatientResponse> {
    //

    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    let api;
    // if (searchQuery && !provider && !clinic) {;
    //   api = `getAllpatients?searchQuery=${searchQuery}`;
    //   //;
    // } else if (searchStatus && !searchQuery) {;
    //   api = `getAllpatients?status=${searchStatus}`;
    // } else if (provider && !searchQuery && !clinic) {;
    //   api = `getAllpatients?provider=${provider}`;
    // } else if (!provider && searchQuery && clinic) {;
    //   api = `getAllpatients?searchQuery=${searchQuery}&&clinic=${clinic}`;
    // } else if (clinic && !provider && !searchQuery) {;
    //   api = `getAllpatients?clinic=${clinic}`;
    // } else if (clinic && provider && !searchQuery) {;
    //   api = `getAllpatients?clinic=${clinic}&&provider=${provider}`;
    // } else if (searchQuery && clinic && provider) {;
    //   api = `getAllpatients?searchQuery=${searchQuery}&&clinic=${clinic}&&provider=${provider}`;
    // } else if (searchQuery && !clinic && provider) {;
    //   api = `getAllpatients?searchQuery=${searchQuery}&&provider=${provider}`;
    // } else if (!searchQuery && !clinic && !provider) {;
    //   api = `getAllpatients`;
    // };
    //

    return this.http
      .get<PatientResponse>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${
          this.baseResource
        }/getAllpatients?${searchData ? searchData : ''}`,
        { params }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   * Add patient
   */
  addPatient(patientData: Patient): Observable<Patient> {
    return this.http
      .post<Patient>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/addNewPatient`,
        patientData
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDiagnosis(patientData: any): Observable<Patient> {
    return this.http
      .get<Patient>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getDiagnosisListOfPatientByPatientId?patientId=${patientData}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getXpPoints(id, body) {
    return this.http
      .post<Patient>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllPatientsExperiencePoints/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  /**
   * Edit patient
   */
  editPatient(patientData: Patient, patientId: string): Observable<Patient> {
    return this.http
      .put<Patient>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/updatePatientDetails/${patientId}`,
        patientData
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  /**
   * Get Patient
   */
  changeStatus(email, val) {
    return this.http
      .post<Patient>(`${this.apiBaseUrl}/status/${email}/${val}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatient(patientId: string): Observable<Patient> {
    return this.http
      .get<Patient>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllpatients/${patientId}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getInsuranceDetails() {
    return this.http.get<any>(`${this.apiBaseUrl}/getInsurancelist`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getIhealthRegistrationURL(): any {
    return this.http.get(`${this.iheathApi}/ihealth/redirectionuri`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  uploadPatientConsentForm(body, id): any {
    return this.http
      .post(`${this.apiBaseUrl}/upload/concentForm/${id}`, body)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deletePatientConsentForm(cfid): any {
    return this.http
      .delete(`${this.apiBaseUrl}/deleteConsentForm/${cfid}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  downloadPatientConsentForm(fileDownloadUrl) {
    return this.http
      .get<Blob>(
        `${environment.apiBaseUrl}/${environment.data_service}/downloadFile?keyName=${fileDownloadUrl}`
      )
      .subscribe((res) => {
        this.downloadFile(res);
      });
  }
  public downloadFile(response: any): any {
    const byteCharacters = atob(response.file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.type });
    const file = new File([blob], response.fileName, { type: response.type });
    saveAs(file);
  }
  getPatientbyDoctor(
    pageNumber = 0,
    pageSize = 10,
    sort = 'createdAt,desc',
    doctorId: string
  ): Observable<PatientResponse> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/patients/bydoctors/${doctorId}`,
        {
          params: new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString())
            .set('offset', sort),
        }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatientConsentFormByPatId(id) {
    return this.http
      .get(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllConsentForm/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatientList(): any {
    return this.http.get(`${this.apiBaseUrl}/plainpatientlist`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // eslint-disable-next-line max-len
  public getAllPatientsSearch(
    pageNumber = 0,
    pageSize = 10,
    sort = 'createdAt,desc',
    searchData
  ): Observable<PatientResponse> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sort);
    return this.http
      .get<PatientResponse>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllpatients?searchQuery=${searchData}`,
        { params }
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
