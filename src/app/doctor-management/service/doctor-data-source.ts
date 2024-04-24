import { SnackbarService } from './../../core/services/snackbar.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Doctor, DoctorResponse } from '../entities/doctor';
import { DoctorService } from './doctor.service';
import { AuthService } from 'src/app/core/services/auth.service';

export class DoctorDataSource implements DataSource<Doctor> {
  private doctorSubject = new BehaviorSubject<Doctor[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();
  userRole: any;

  constructor(
    private doctorService: DoctorService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<Doctor[]> {
    return this.doctorSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.doctorSubject.complete();
    this.totalElements.complete();
  }

  loadCareProviders(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    filterValues
  ): any {
    this.userRole = this.authService?.authData?.userDetails['userRole'];

    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      if (pageSize <= 10) {
        pageSize =
          screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
      }
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;
      const sort = `${sortColumn},${sortDirection}`;
      this.doctorService
        .getDoctorList(
          pageNumber,
          pageSize,
          sortColumn,
          sortDirection,
          filterValues
        )
        .pipe(catchError(() => of([])))
        .subscribe(
          (data: DoctorResponse) => {
            const doctorData: Doctor[] = data.content;
            this.doctorSubject.next(doctorData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error.message);
          }
        );
    }
  }

  // eslint-disable-next-line max-len
  loadDoctorsSearch(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): any {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;
      const sort = `${sortColumn},${sortDirection}`;

      this.doctorService
        .getDoctorSearchList(
          pageNumber,
          pageSize,
          sortColumn,
          sortDirection,
          searchData
        )
        .pipe(catchError(() => of([])))
        .subscribe(
          (data: DoctorResponse) => {
            const doctorData: Doctor[] = data.content;
            this.doctorSubject.next(doctorData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error);
          }
        );
    }
  }

  loadCoordinators(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): any {
    this.userRole = this.authService?.authData?.userDetails['userRole'];

    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      if (pageSize <= 10) {
        pageSize =
          screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
      }
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;
      const sort = `${sortColumn},${sortDirection}`;
      this.doctorService
        .getCareCoordinators(
          pageNumber,
          pageSize,
          sortColumn,
          sortDirection,
          searchData
        )
        .pipe(catchError(() => of([])))
        .subscribe(
          (data: DoctorResponse) => {
            const doctorData: Doctor[] = data.content;
            this.doctorSubject.next(doctorData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error.message);
          }
        );
    }
  }

  // eslint-disable-next-line max-len
  loadCoordinatorsSearch(
    pageNumber: number,
    pageSize: number,
    searchData: HttpParams
  ): any {
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    // const sort = `${sortColumn},${sortDirection}`;
    this.userRole = this.authService?.authData?.userDetails['userRole'];

    if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'FACILITY_USER'
    ) {
      this.doctorService
        .getCareCoordinatorSearchList(pageNumber, pageSize, searchData)
        .pipe(catchError(() => of([])))
        .subscribe(
          (data: DoctorResponse) => {
            const doctorData: Doctor[] = data.content;
            this.doctorSubject.next(doctorData);
            this.totalElements.next(data.totalElements);
          },
          (err) => {
            // this.snackbarService.error(err.error);
          }
        );
    }
  }
}
