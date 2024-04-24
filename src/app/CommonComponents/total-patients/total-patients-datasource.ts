import { TotalPatients } from './../Interfaces/totalPatients';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { SnackbarService } from './../../core/services/snackbar.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export class TotalPatientsDataSource implements DataSource<any>{

    private patientlistSubject = new BehaviorSubject<any[]>([]);
    private totalElements = new BehaviorSubject<number>(-1);
    public totalElemObservable = this.totalElements.asObservable();
    loadRes: boolean;
    constructor(private service: CaregiverDashboardService, private snackbarService: SnackbarService) { }
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.patientlistSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.patientlistSubject.complete();
        this.totalElements.complete();
    }

    loadTotalPatients(pageNumber: number, pageSize = 10, sortDirection = 'createdAt,desc'): void {
        sortDirection = sortDirection === '' ? 'desc' : sortDirection;
        this.patientlistSubject.next([]);
        this.loadRes = true;
        this.service.getPatientList(pageNumber, pageSize, sortDirection).subscribe((data: any) => {
            // if (data.err === 403) {
            //     this.snackbarService.error(data.message);
            // }
            const patientData: TotalPatients[] = data.content;
            this.patientlistSubject.next(patientData);
            this.totalElements.next(data.totalElements);
            localStorage.setItem(
                'allPatients',
                JSON.stringify(patientData),
            );
            this.loadRes = false;
        }, err => {
            // this.snackbarService.error(err.message);
        });
    }
    loadTotalPatientsBySearchQuery(searchParameter, pageNumber: number, pageSize = 10): void {

        this.patientlistSubject.next([]);
        this.loadRes = true;
        this.service.searchPatients(searchParameter, pageNumber, pageSize).pipe(
            catchError(() => of([]))

        ).subscribe((data: any) => {
            const patientData: TotalPatients[] = data.content;
            this.patientlistSubject.next(patientData);
            this.totalElements.next(data.totalElements);
            this.loadRes = false;
        }, err => {
            // this.snackbarService.error(err.error.message);
        });
    }

}

