import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Disease, DiseaseResponse } from '../entities/disease';
import { DiseaseService } from './disease.service';

export class DiseaseDataSource implements DataSource<Disease> {
  private diseaseSubject = new BehaviorSubject<Disease[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();

  constructor(
    private diseaseService: DiseaseService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<Disease[]> {
    return this.diseaseSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.diseaseSubject.complete();
    this.totalElements.complete();
  }

  // eslint-disable-next-line max-len
  loadDisease(pageNumber: number, pageSize: number, searchQuery): void {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    this.diseaseService
      .getAllDisease(pageNumber, pageSize, searchQuery)
      .pipe(catchError(() => of([])))
      .subscribe(
        (data: DiseaseResponse) => {
          // if (data['err'] === 403) {
          //   this.snackbarService.error(data['message']);
          // }
          const diseaseData: Disease[] = data.content;
          this.diseaseSubject.next(diseaseData);
          this.totalElements.next(data.totalElements);
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
}
