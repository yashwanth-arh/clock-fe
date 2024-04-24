import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  hospitalUser,
  hospitalUserDevice,
  hospitalUserResponse,
  hospitalUserResponseDevice,
} from '../entities/hospital-user';
import { hospitalUserService } from './hospital-user.service';

export class hospitalUserDataSource
  implements DataSource<hospitalUser>
{
  private hospitalSubject = new BehaviorSubject<hospitalUser[]>([]);
  // private hospitalDeviceSubject = new BehaviorSubject<hospitalUserDevice[]>([]);

  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(private hospitalUserService: hospitalUserService) {}

  connect(): Observable<hospitalUser[]> {
    return this.hospitalSubject.asObservable();
  }

  disconnect(): void {
    this.hospitalSubject.complete();
    this.totalElements.complete();
  }
  // connect(): Observable<hospitalUserDevice[]> {
  //   return this.hospitalDeviceSubject.asObservable();
  // }

  // disconnect(): void {
  //   this.hospitalDeviceSubject.complete();
  //   this.totalElements.complete();
  // }

  // eslint-disable-next-line max-len
  loadhospitalUser(
    pageNumber: number,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    orgId: string,
    searchData
  ): void {
    // const sort = `${sortColumn},${sortDirection}`;
    this.hospitalUserService
      .gethospitalUserById(
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        orgId,
        searchData
      )
      .pipe(catchError(() => of([])))
      .subscribe((data: hospitalUserResponse) => {
        const hospitalData: hospitalUser[] = data.content?.filter(
          (element) => element.firstName != null
        );
        this.hospitalSubject.next(hospitalData);
        this.totalElements.next(data.totalElements);
      });
  }
  loadhospitalDevice(
    // pageNumber: number,
    // pageSize = 10,
    // sortColumn = 'createdAt',
    // sortDirection = 'desc',
    orgId: string
  ): void {
    // const sort = `${sortColumn},${sortDirection}`;
    this.hospitalUserService
      .getHealthDeviceByHospitalId(
        // pageNumber,
        // pageSize,
        // sortColumn,
        // sortDirection,
        orgId
      )
      .pipe(catchError(() => of([])))
      .subscribe((data: hospitalUserResponseDevice) => {
        const hospitalData: hospitalUserDevice[] = data.content?.filter(
          (element) => element.imei_number != null
        );
        // this.hospitalSubject.next(hospitalData);
        this.totalElements.next(data.totalElements);
      });
  }
}
