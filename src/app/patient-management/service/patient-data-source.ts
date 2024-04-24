import { SnackbarService } from './../../core/services/snackbar.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { Patient, PatientResponse } from '../entities/patient';
import { PatientManagementService } from './patient-management.service';
import { AuthService } from 'src/app/core/services/auth.service';

export class PatientDataSource implements DataSource<Patient> {
  private patientSubject = new BehaviorSubject<Patient[]>([]);
  private loadingPatients = new BehaviorSubject<boolean>(false);
  private totalElements = new BehaviorSubject<number>(0);
  public loadingObservable = this.loadingPatients.asObservable();
  public totalElemObservable = this.totalElements.asObservable();
  userRole: string;
  constructor(
    private pateintService: PatientManagementService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {
    const user = this.authService.authData;
    this.userRole = user?.userDetails?.userRole;
  }

  connect(collectionViewer: CollectionViewer): Observable<Patient[]> {
    return this.patientSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.patientSubject.complete();
    this.loadingPatients.complete();
    this.totalElements.complete();
  }

  loadPatients(
    pageNumber: number,
    pageSize: number,
    // sortColumn = 'createdAt',
    // sortDirection = 'desc',
    clinic,
    provider,
   searchData
  ): void {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      if (pageSize <= 10) {
        pageSize =
          screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
      }
      // sortDirection = sortDirection === '' ? 'desc' : sortDirection;

      this.pateintService
        .getAllPatients(
          pageNumber,
          pageSize,
          clinic,
          provider,
          searchData
        )
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingPatients.next(false))
        )
        .subscribe(
          (data: PatientResponse) => {
            if (this.userRole === 'BRANCH_USER') {
              data.content.map((res) => {
                this.pateintService
                  .getPatientConsentFormByPatId(res.id)
                  .subscribe(
                    (response) => {
                      if (response['consentFormListMap'].length) {
                        res['consentFormExists'] = true;
                        res['consentFormUrl'] =
                          response['consentFormListMap'][0].fileDownloadUrl;
                      } else {
                        res['consentFormExists'] = false;
                        res['consentFormUrl'] = null;
                      }
                    },
                    (err) => {}
                  );
              });
            }
            const patientData: Patient[] = data.content;

            this.patientSubject.next(patientData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error.message);
          }
        );
    }
  }

  loadPatientsSearch(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData: string
  ): void {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      this.loadingPatients.next(true);
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;
      const sort = `${sortColumn},${sortDirection}`;
      this.pateintService
        .getAllPatientsSearch(pageNumber, pageSize, sort, searchData)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingPatients.next(false))
        )
        .subscribe(
          (data: PatientResponse) => {
            const patientData: Patient[] = data.content;
            //
            this.patientSubject.next(patientData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error);
          }
        );
    }
  }
}
