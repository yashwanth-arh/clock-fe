import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Notification, NotificationResponse } from '../entities/notification';
import { NotificationService } from './notification.service';

export class NotificationDataSource implements DataSource<Notification>{

  public notificatioSubject = new BehaviorSubject<Notification[]>([]);
  public totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(private claimService: NotificationService, private snackbarService: SnackbarService) { }

  connect(collectionViewer: CollectionViewer): Observable<Notification[] | readonly Notification[]> {
    return this.notificatioSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.notificatioSubject.complete();
    this.totalElements.complete();
  }

  loadNotification(pageNumber: number, pageSize = 10, sortColumn = 'createdTime', sortDirection = 'desc'): void {
    const sort = `${sortColumn},${sortDirection}`;
    this.claimService.getAllNotification(pageNumber, pageSize, sortColumn, sortDirection).pipe(
      catchError(() => of([])),

    ).subscribe((data: NotificationResponse) => {
      const notificationData: Notification[] = data.content;
      this.notificatioSubject.next(notificationData);
      this.totalElements.next(data.totalElements);
    }, err => {
      this.snackbarService.error(err.message);
    });

  }


  loadNotificationSearch(
    pageNumber: number,
    pageSize = 10,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    formData: any): void {
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.claimService.getSearchNotification(pageNumber, pageSize, sortColumn, sortDirection, formData).pipe(
      catchError(() => of([])),

    ).subscribe((data: NotificationResponse) => {
      const notificationData: Notification[] = data.content;
      this.notificatioSubject.next(notificationData);
      this.totalElements.next(data.totalElements);
    });

  }
}
