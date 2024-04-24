import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CptCode, CptResponse } from '../entities/cpt-code';
import { CptCodeService } from './cpt-code.service';

export class CPTDataSource implements DataSource<CptCode> {
  private cptSubject = new BehaviorSubject<CptCode[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(private cptService: CptCodeService, private snackbarService: SnackbarService) { }

  connect(collectionViewer: CollectionViewer): Observable<CptCode[]> {
    return this.cptSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.cptSubject.complete();
    this.totalElements.complete();
  }

  // eslint-disable-next-line max-len
  loadCodes(pageNumber: number, pageSize: number, sortColumn = 'id', sortDirection = 'desc', searchQuery = null): void {
    pageSize = screen.availWidth>= 1920 && screen.availHeight >=1080 ? 15 :10

    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    const sort = `${sortColumn},${sortDirection}`;
    this.cptService
      .getAllCPTCode(pageNumber, pageSize, sortColumn, sortDirection, searchQuery)
      .pipe(catchError(() => of([])))
      .subscribe((data: CptResponse) => {
        // if (data['err'] === 403) {
        //   this.snackbarService.error(data['message']);
        // }
        const cptData: CptCode[] = data.content;
        this.cptSubject.next(cptData);
        this.totalElements.next(data.totalElements);
      }, err => {
        // this.snackbarService.error(err.error.message);
      });
  }
}
