import { CaregiverService } from './../caregiver.service';
import { Caregiver, CaregiverResponse } from './caregiver';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export class CaregiverDataSource implements DataSource<Caregiver> {
  private caregiverSubject = new BehaviorSubject<Caregiver[]>([]);
  private loadingCaregivers = new BehaviorSubject<boolean>(false);
  private totalElements = new BehaviorSubject<number>(null);
  public loadingObservable = this.loadingCaregivers.asObservable();
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private caregiverService: CaregiverService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<Caregiver[]> {
    return this.caregiverSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.caregiverSubject.complete();
    this.loadingCaregivers.complete();
    this.totalElements.complete();
  }

  loadCaregivers(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'creationDate',
    sortDirection = 'desc',
    orgId,
    branchId,
    searchQuery
  ): void {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    this.loadingCaregivers.next(true);
    const sort = `${sortColumn},${sortDirection}`;
    this.caregiverService
      .getAllCaregivers(
        pageNumber,
        pageSize,
        sort,
        orgId,
        branchId,
        searchQuery
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingCaregivers.next(false))
      )
      .subscribe(
        (data: CaregiverResponse) => {
          const patientData: Caregiver[] = data.content;
          this.caregiverSubject.next(patientData);
          this.totalElements.next(data.totalElements);
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
  // eslint-disable-next-line max-len
  loadCaregiverSearch(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortDirection: string,
    searchData: string
  ): void {
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.caregiverService
      .getCaregiverSearchList(pageNumber, pageSize, sort, searchData)
      .pipe(catchError(() => of([])))
      .subscribe((data: CaregiverResponse) => {
        const hospitalData: Caregiver[] = data.content;
        this.caregiverSubject.next(hospitalData);
        this.totalElements.next(data.totalElements);
      });
  }
}
