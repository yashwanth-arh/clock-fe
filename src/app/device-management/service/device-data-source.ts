import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Device, DeviceResponse } from '../entities/device';
import { DeviceManagementService } from './device.management.service';

export class DeviceDataSource implements DataSource<Device> {
  private loadingDevices = new BehaviorSubject<boolean>(false);
  public loadingObservable = this.loadingDevices.asObservable();
  private deviceSubject = new BehaviorSubject<Device[]>([]);
  private totalElements = new BehaviorSubject<number>(0);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private deviceService: DeviceManagementService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<Device[]> {
    return this.deviceSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.deviceSubject.complete();
    this.totalElements.complete();
    this.loadingDevices.complete();
  }

  loadDevice(pageNumber: number, pageSize: number): void {
    this.loadingDevices.next(true);
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    // sortDirection =
    //   sortDirection === '' ? 'desc' : sortColumn + ',' + sortDirection;
    this.deviceService
      .getDeviceList(pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingDevices.next(false))
      )
      .subscribe(
        (data: DeviceResponse) => {
          // if (data['err'] === 403) {
          //   this.snackbarService.error(data['message']);
          // }
          // const deviceData: Device[] = data.content.filter(element => element.vendorName != null);
          const deviceData: Device[] = data.content;
          this.deviceSubject.next(deviceData);
          this.totalElements.next(data.totalElements);
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }

  // eslint-disable-next-line max-len
  loadDeviceSearch(
    pageNumber: number,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): void {
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.deviceService
      .getDeviceFilters(pageNumber, pageSize, sort, searchData)
      .pipe(catchError(() => of([])))
      .subscribe((data: any) => {
        // const deviceData: Device[] = data.content.filter(element => element.vendorName != null);
        const deviceData: Device[] = data.content;
        this.deviceSubject.next(deviceData);
        this.totalElements.next(data.totalElements);
      });
  }
}
