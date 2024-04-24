import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { LeadershipBoardService } from './leadership-services/leadership-board.service';

export class LeadershipBoardDataSource implements DataSource<any> {
  private loadingLeadershipBoard = new BehaviorSubject<boolean>(false);
  public loadingObservable = this.loadingLeadershipBoard.asObservable();
  private leadershipBoardSubject = new BehaviorSubject<any[]>([]);
  private totalElements = new BehaviorSubject<number>(0);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private leadershipService: LeadershipBoardService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.leadershipBoardSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.leadershipBoardSubject.complete();
    this.totalElements.complete();
    this.loadingLeadershipBoard.complete();
  }

  loadLeadershipBoard(
    pageNumber: number,
    pageSize: number,
    // practice:any,
    // clinic:any,
    search: any,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): void {
    pageSize =
      screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    this.loadingLeadershipBoard.next(true);

    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.leadershipService
      .getLeadershipBoardList(pageNumber, pageSize, sort, search)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingLeadershipBoard.next(false))
      )
      .subscribe(
        (data: any) => {
          // if (data['err'] === 403) {
          //   this.snackbarService.error(data['message']);
          // }
          // const deviceData: Device[] = data.content.filter(element => element.vendorName != null);
          const leadershipData: any[] = data.content;

          this.leadershipBoardSubject.next(leadershipData);
          this.totalElements.next(data.totalElements);
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }

  loadLeadershipBoardByPatient(
    id,
    body,
    pageNumber: number,
    pageSize: number,
    sortColumn = 'createdAt',
    sortDirection = 'desc'
  ): void {
    pageSize =
      screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    this.loadingLeadershipBoard.next(true);
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.leadershipService
      .getLeadershipBoardListById(id, body, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingLeadershipBoard.next(false))
      )
      .subscribe(
        (data: any) => {
          // if (data['err'] === 403) {
          //   this.snackbarService.error(data['message']);
          // }
          // const deviceData: Device[] = data.content.filter(element => element.vendorName != null);
          const leadershipData: any[] = data.content;
          this.leadershipBoardSubject.next(leadershipData);
          this.totalElements.next(data.totalElements);
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
}
