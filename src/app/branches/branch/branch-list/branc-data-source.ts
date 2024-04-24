import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Branch, BranchResponse } from '../../enitities/branch';
import { BranchService } from '../branch.service';

export class BranchDataSource implements DataSource<Branch> {
  private branchSubject = new BehaviorSubject<Branch[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private branchService: BranchService,
    private snackbarService: SnackbarService
  ) {}

  connect(): Observable<Branch[]> {
    return this.branchSubject.asObservable();
  }

  disconnect(): void {
    this.branchSubject.complete();
    this.totalElements.complete();
  }

  // eslint-disable-next-line max-len
  loadData(
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    status = null,
    practice = null,
    city = null,
    searchQuery = null
  ): any {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }


    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    // const sort = `${sortColumn},${sortDirection}`;

    this.branchService
      .getAllBranch(
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        status,
        practice,
        city,
        searchQuery
      )
      .pipe(catchError(() => of([])))
      .subscribe(
        (data: BranchResponse) => {
          const branchData: Branch[] = data.content?.filter(
            (branch: Branch) => branch.name !== null
          );
          this.branchSubject.next(branchData);
          this.totalElements.next(data.totalElements);
          localStorage.setItem(
            'searchDataLength',
            JSON.stringify(data.totalElements)
          );
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
}
