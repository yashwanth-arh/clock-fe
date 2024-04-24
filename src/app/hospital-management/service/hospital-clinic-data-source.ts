import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { Branch, BranchResponse } from '../../branches/enitities/branch';

export class hospitalClinicDataSource implements DataSource<Branch>{

  private hospitalClinicSubject = new BehaviorSubject<Branch[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(private branchService: BranchService) { }

  connect(): Observable<Branch[]> {
    return this.hospitalClinicSubject.asObservable();
  }

  disconnect(): void {
    this.hospitalClinicSubject.complete();
    this.totalElements.complete();
  }

  // eslint-disable-next-line max-len
  loadOrgBranchList(pageNumber: number, pageSize = 10, sortColumn = 'lastUpdatedAt', sortDirection = 'desc', orgId: string): void {
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.branchService.getOrgBranchList(pageNumber, pageSize, sort, orgId).pipe(
      catchError(() => of([]))
    ).subscribe((data: BranchResponse) => {
      const hospitalData: Branch[] = data.content;
      this.hospitalClinicSubject.next(hospitalData);
      this.totalElements.next(data.totalElements);
    });
  }
}
