import { SnackbarService } from './../../core/services/snackbar.service';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Hospital, HospitalResponse } from '../entities/hospital';
import { HospitalManagementService } from './hospital-management.service';
import { AuthService } from 'src/app/core/services/auth.service';

export class hospitalDataSource implements DataSource<Hospital> {
  private hospitalSubject = new BehaviorSubject<Hospital[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();
  userRole: any;

  constructor(
    private hospitalService: HospitalManagementService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  connect(): Observable<Hospital[]> {
    return this.hospitalSubject.asObservable();
  }

  disconnect(): void {
    this.hospitalSubject.complete();
    this.totalElements.complete();
  }

  loadhospital(
    pageNumber: number,
    pageSize: number = screen.availWidth >= 1920 && screen.availHeight >= 1080
      ? 15
      : 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): void {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (this.userRole === 'RPM_ADMIN') {
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;
      sortColumn = sortColumn === '' ? 'createdAt' : sortColumn;
      this.hospitalService
        .gethospitalList(pageNumber, pageSize, sortColumn, sortDirection)
        .subscribe(
          (data: HospitalResponse) => {
            // if (data['err'] === 403) {
            //   this.snackbarService.error(data['message']);
            // }

            const hospitalData: Hospital[] = data.content;
            this.hospitalSubject.next(hospitalData);

            this.totalElements.next(data.totalElements);
          },
          (err) => {
            this.snackbarService.error(err.message);
          }
        );
    }
  }

  // eslint-disable-next-line max-len
  loadhospitalSearch(
    pageNumber: number,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): void {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (this.userRole === 'RPM_ADMIN') {
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;

      // const sort = `${sortColumn},${sortDirection}`;

      this.hospitalService
        .gethospitalSearchList(
          pageNumber ? pageNumber : 0,
          pageSize,
          sortColumn,
          sortDirection,
          searchData
        )
        .pipe(catchError(() => of([])))
        .subscribe((data: HospitalResponse) => {
          const hospitalData: Hospital[] = data.content;
          this.hospitalSubject.next(hospitalData);
          this.totalElements.next(data.totalElements);
        });
    }
  }
  loadhospitalSearchStatus(
    pageNumber: number,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData: any
  ): void {
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (this.userRole === 'RPM_ADMIN') {
      sortDirection = sortDirection === '' ? 'desc' : sortDirection;

      // const sort = `${sortColumn},${sortDirection}`;

      this.hospitalService
        .gethospitalSearchListStatus(
          pageNumber ? pageNumber : 0,
          pageSize,
          sortColumn,
          sortDirection,
          searchData
        )
        .pipe(catchError(() => of([])))
        .subscribe((data: HospitalResponse) => {
          const hospitalData: Hospital[] = data.content;
          this.hospitalSubject.next(hospitalData);
          this.totalElements.next(data.totalElements);
        });
    }
  }
}
