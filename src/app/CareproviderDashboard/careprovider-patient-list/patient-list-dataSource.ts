import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export class CaregiverPatientDataSource implements DataSource<any> {
  private patientlistSubject = new BehaviorSubject<any[]>([]);
  private totalElements = new BehaviorSubject<number>(-1);
  public totalElemObservable = this.totalElements.asObservable();
  loadRes: boolean;
  totalCounts: any;
  constructor(
    private service: CaregiverDashboardService,
    private snackbarService: SnackbarService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.patientlistSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.patientlistSubject.complete();
    this.totalElements.complete();
  }

  loadPatients(zone, pageNumber: number, pageSize = 10): void {
    this.patientlistSubject.next([]);
    this.loadRes = true;

    this.service
      .getPatientsByZone(zone, pageNumber, pageSize)
      .pipe(catchError(() => of([])))
      .subscribe(
        (data: any) => {
          const patientData: any[] = data.content;
          patientData?.forEach((patient: any) => {
            if (patient && patient !== null && patient !== 'NA') {
              if (
                patient?.symptomsBp &&
                patient?.symptomsBp !== 'NULL' &&
                patient?.symptomsBp !== 'NA'
              ) {
                const symptomsBp = JSON.parse(patient.symptomsBp);
                symptomsBp.forEach((symptom) => {
                  if (symptom.symptomUrl || symptom?.b) {
                    symptom.fileName =
                      symptom?.symptomUrl?.substring(
                        symptom.symptomUrl.lastIndexOf('/') + 1
                      ) ||
                      symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
                  }
                });
                patient.symptomsBp = symptomsBp;
              } else {
                patient.symptomsBp = [];
              }
            } else {
              patient = {};
            }
          });
          this.patientlistSubject.next(patientData);
          this.totalElements.next(data.totalElements);
          if (zone === 1) {
            localStorage.setItem(
              'highAlertZonePatients',
              JSON.stringify(patientData)
            );
          } else if (zone === 2) {
            localStorage.setItem(
              'alertZonePatients',
              JSON.stringify(patientData)
            );
          } else if (zone === 3) {
            localStorage.setItem(
              'goodZonePatients',
              JSON.stringify(patientData)
            );
          }
          this.loadRes = false;
          this.totalCounts = data?.totalElement;
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
  loadNonAdherencePatients(pageNumber: number, pageSize = 10): void {
    this.patientlistSubject.next([]);
    // sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    // const sort = `${sortColumn},${sortDirection}`;
    this.loadRes = true;
    this.service
      .getNonadherence(pageNumber, pageSize)
      .pipe(catchError(() => of([])))
      .subscribe(
        (data: any) => {
          const patientData: any[] = data.content;
          // if (pageNumber > 1) {
          //   patientData.concat(data.patients);
          // }

          patientData.forEach((patient: any) => {
            if (patient && patient !== null && patient !== 'NA') {
              if (
                patient.symptomsBp &&
                patient?.symptomsBp !== 'NULL' &&
                patient?.symptomsBp !== 'NA' &&
                patient?.symptomsBp !== 'string'
              ) {
                const symptomsBp = JSON.parse(patient?.symptomsBp);
                // const symptomsBp = patient??.symptomsBp.split(',');
                if (symptomsBp.length) {
                  symptomsBp?.forEach((symptom) => {
                    if (symptom.symptomUrl || symptom?.b) {
                      symptom.fileName =
                        symptom?.symptomUrl?.substring(
                          symptom.symptomUrl.lastIndexOf('/') + 1
                        ) ||
                        symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
                    }
                    // return symptom;
                  });
                  patient.symptomsBp = symptomsBp;
                } else {
                  patient.symptomsBp = [];
                }
              }
            } else {
              patient = {};
            }

            if (patient && patient !== null && patient !== 'NA') {
              if (
                patient?.symptomsBS &&
                patient?.symptomsBS !== 'NULL' &&
                patient?.symptomsBS !== 'NA' &&
                patient?.symptomsBS !== 'string'
              ) {
                const symptomsBS = JSON.parse(patient?.symptomsBS);

                symptomsBS.forEach((symptom) => {
                  if (symptom.symptomUrl || symptom?.b) {
                    symptom.fileName =
                      symptom?.symptomUrl?.substring(
                        symptom.symptomUrl.lastIndexOf('/') + 1
                      ) ||
                      symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
                  }
                });
                patient.symptomsBS = symptomsBS;
              } else {
                patient.symptomsBS = [];
              }
            } else {
              patient = {};
            }
          });
          this.patientlistSubject.next(patientData);
          this.totalElements.next(data?.totalElements);
          this.loadRes = false;
          localStorage.setItem(
            'nonAdherencePatients',
            JSON.stringify(patientData)
          );
          localStorage.setItem(
            'nonAdherenceTotalElements',
            JSON.stringify(data.pageContent?.totalPages)
          );
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
  }
}
