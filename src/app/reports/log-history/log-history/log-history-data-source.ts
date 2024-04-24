import { LogHistoryService } from './../../service/log-history.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export class LogHistoryDataSource implements DataSource<any> {
  private logHistSubject = new BehaviorSubject<any[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private logService: LogHistoryService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.logHistSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logHistSubject.complete();
    this.totalElements.complete();
  }

  loadLogHist(pageNumber: number, pageSize: number, searchData): void {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    // const sort = `${sortColumn},${sortDirection}`;
    this.logService.getLoggedInList(pageNumber, pageSize, searchData).subscribe(
      (data: any) => {
        // if (data.err === 403) {
        //   this.snackbarService.error(data.message);
        // }
        const logData: any[] = data.content;
        this.logHistSubject.next(logData);
        this.totalElements.next(data.totalElements);
        localStorage.setItem(
          'searchDataLength',
          JSON.stringify(data.totalElements)
        );
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
}
