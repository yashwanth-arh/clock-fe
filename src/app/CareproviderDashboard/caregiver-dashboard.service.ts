import { saveAs } from 'file-saver';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AuthStateService } from '../core/services/auth-state.service';
import { PatientsZone } from '../CommonComponents/Interfaces/patientsZone';
import { TotalPatients } from '../CommonComponents/Interfaces/totalPatients';
import { CallScheduleList } from '../CommonComponents/Interfaces/callScheduleList';
import { NotificationList } from '../CommonComponents/Interfaces/notificationList';
import {
  NotesList,
  TemplateList,
} from '../CommonComponents/Interfaces/notesTemplateList';
import { PatientObservationDetails } from '../CommonComponents/Interfaces/patientObservationDetails';
import { AppointmentScheduledList } from '../CommonComponents/Interfaces/appointmentScheduledList';
import { LatestVitalsList } from '../CommonComponents/Interfaces/latestVitalsList';
import { AppointmentList } from '../CommonComponents/Interfaces/appointmentList';
import { MedicationList } from '../CommonComponents/Interfaces/medicationList';
import { environment } from 'src/environments/environment';
import { id } from '@swimlane/ngx-datatable';

@Injectable({
  providedIn: 'root',
})
export class CaregiverDashboardService {
  public apiBaseUrl: string;
  public iheathApi: string;
  public uniqueUrl: string;
  public baseResource: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);
    this.uniqueUrl = environment.uniqueUrl;

    this.authStateService.baseResource.subscribe((res) => {
      this.baseResource = res;
      // this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      // this.apiBaseUrl += `/${res}`;
    });
  }
  getNotifications(): Observable<NotificationList> {
    return this.http
      .get<NotificationList>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotificationsList`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  clearAllNotifications(): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/clearAllNotifications`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAdherence(id: string, body): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAdherence/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getCareTeam(id: string): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment. profile_service}/${this.baseResource}/getCareTeamByPatientId/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }


  getPatientsByZone(
    zNo,
    pageNumber = 0,
    pageSize = 10
  ): Observable<PatientsZone> {
    // const key = `${zNo}-patient-list`;
    // const keyCount = `${zNo}-patient-list-page-count`
    // if (this.getPatientData(key) !== null && pageNumber === 0) {
    //   return of(JSON.parse(this.getPatientData(key)))
    // } else if (pageNumber > 0 || this.getPatientData(key) === null) {
    return this.http
      .get<PatientsZone>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getPatientsObsByStatus?zone=${zNo}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
        }
      )
      .pipe(
        map(
          (data) => {
            // this.storePatientPageCount(keyCount, pageNumber);
            // if (pageNumber === 0)
            //   this.storePatientData(key, data);
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
    // } else {
    //   return of(null);
    // }
  }
  getNonadherence(pageNumber, pageSize): Observable<PatientsZone> {
    // const key = 'non-adherence-patient-list';
    // const keyCount = 'non-adherence-patient-list-page-count';
    // if (this.getPatientData(key) !== null && pageNumber === 0) {
    //   return of(JSON.parse(this.getPatientData(key)));
    // } else if (pageNumber > 0 || this.getPatientData(key) === null) {
    return this.http
      .get<PatientsZone>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getPatientsNonAdherenceBpObs`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
        }
      )
      .pipe(
        map(
          (data) => {
            // this.storePatientPageCount(keyCount, pageNumber);
            // if (pageNumber === 0) {
            //   this.storePatientData(key, data);
            // }
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
    // } else {
    //   return of(null);
    // }
  }
  getPastActivities(patientId) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/pastActivities/${patientId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  storePatientData(key: any, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
  storePatientPageCount(key: any, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getPatientData(key: any): string | null {
    return sessionStorage.getItem(key);
  }
  getTabCounts() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/dashboard/patientCardData`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getPatientList(
    pageNumber = 0,
    pageSize = 10,
    sortDirection
  ): Observable<TotalPatients> {
    const sortStr = `${sortDirection}`;
    const keyCount = 'total-patient-list-page-count';
    return this.http
      .get<TotalPatients>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllpatients`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        }
      )
      .pipe(
        map(
          (data) => {
            this.storePatientPageCount(keyCount, pageNumber);
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  createAppointment(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/createAppointment`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateAppointment(id, val) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/updateAppointment/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  downloadProfileIcons(fileDownloadUrl) {
    return this.http
      .get<Blob>(`${this.uniqueUrl}/downloadFile?keyName=${fileDownloadUrl}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  downloadNotes(id, val) {
    return this.http
      .post<Blob>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/download/${id}`,
        val
      )
      .subscribe((res) => {
        this.downloadFile(res);
      });
  }
  public downloadFile(response: any): any {
    const byteCharacters = atob(response.blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.type });
    const file = new File([blob], response.fileName, { type: response.type });
    saveAs(file);
  }
  setCallStarted(id) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/callStarted/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getNotificationCount() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotificationsCount`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAppointmentHistoryList(
    id,
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'dateOfAppointments',
    sortDirection = 'desc'
  ): Observable<AppointmentList> {
    const sortStr = `${sortColumn},${sortDirection}`;
    return this.http
      .get<AppointmentList>(
        `${environment.apiBaseUrl}/getAppointments/byPatient/${id}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString())
            .set('sort', sortStr),
        }
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  getPrescriptions(id) {
    return (
      this.http
        .get<any>(
          `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllPrescriptionList/${id}`
        )
        // .get<any>(`${this.apiBaseUrl}/getAllPrescriptionList/${id}`)
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  updatePrescriptionStatus(id, status) {
    return (
      this.http
        .put<any>(
          `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/updatePrescriptionStatus/${id}/${status}`,
          {}
        )
        // .get<any>(`${this.apiBaseUrl}/getAllPrescriptionList/${id}`)
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  uploadPrescrition(id) {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .get<any>(
          `${environment.apiBaseUrl}/$${this.baseResource}/uploadPrescription/${id}`
        )
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  // getPrescriptionList(id): Observable<MedicationList> {
  //   return (
  //     this.http
  //       //get<any>(`${this.apiBaseUrl}/patientAppointment/getHistory`,id)
  //       .get<MedicationList>(
  //         `https://dev-api.clockhealth.ai/clock-data-mgmt/careprovider/getAllPrescriptionList/${id}`
  //       )
  //       .pipe(
  //         map(
  //           (data) => {
  //             return data;
  //           },
  //           catchError((err) => {
  //             return of(err);
  //           })
  //         )
  //       )
  //   );
  // }
  getMedicationHistory(id): Observable<MedicationList> {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .get<MedicationList>(
          `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllMedicationList/${id}`
        )
        .pipe(
          map(
            (data) => {
              return data;
            },
            catchError((err) => {
              return of(err);
            })
          )
        )
    );
  }
  getActionsList() {
    return this.http.get<any>(`${environment.apiBaseUrl}/getAction`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getMedicationNames(val) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getMedicine?medicinName=${val}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getWeightManagement() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientwtmngt`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatientLoactionsById(pId) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/getPatientLocationPlainList?patientId=${pId}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getUserDetails() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getCareProviderDetails`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deviceInfoDetails(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getPatientDetailsandCareProviderDetails/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateImmediateCompleteStatus(sId, duration) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/callcompleted/${sId}/${duration}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateScheduleCompleteStatus(sId, duration) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/callcompleted/${sId}/${duration}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  callNotJoined(sId) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/callNotJoined/${sId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  callNotAttended(sId) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/callNotAttended/${sId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateCallStatus(scheduleId: string): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/updateParticipantsCallStatus/${scheduleId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  removeCallRecord(patientId: string): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/completeSchedleCall/${patientId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getPatientById(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientbyPtsId/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getPatientCount() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/gettotalpatientcount`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  searchPatients(val, pageNumber = 0, pageSize = 10) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllpatients?searchQuery=${val}`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
        }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getResidualWeight(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/patientAppointment/residualweight/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getResidualWeightDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/patientAppointment/residualweightdate/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getWeightPattern(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/weightGainPattern/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getWeightPatternDate(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/weightGainPatterndate/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBGPatternDate(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/bgGainPatterndate/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getWeightTrend(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getWeightGainTrendGraph/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getWeightTrendDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/getWeightGainTrendGraphToFromDt/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBGTrendDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/getBgGainTrendGraphToFromDt/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBPTrend(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getBPGainTrendGraph/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBPTrendDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getBPGainTrendGraphToFromDt/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBPManagement(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/bpGainPattern/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  medicationadherenceBPBydate(id: string, body): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getMedicationAdherenceByPatient/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getMedicationAdherencelist(id, body) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/medicationAdheranceCount?patientId=${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  adherenceBPBydate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getPatientAdherenceData/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  adherenceWtBydate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/getCountadhereNonadhereBs/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  adherenceWtByDef(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/getCountAdhereNonadhereWtByDefault/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  adherenceBPByDef(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/getCountAdhereNonadhereBpByDefault/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getBPManagementDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/bpGainPatterndate/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  bpGainPatternGraph(val, id, sessionId) {
    const headers = new HttpHeaders({
      Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0TmFtZSI6ImsiLCJzdWIiOiJrcmlzaG5hckBnbWFpbC5jb20iLCJzY29wZUlkIjoiQ0FQX1dTOHZVRFhvNyIsImlzcyI6Inh5cmFtc29mdCIsInNlc3Npb25JZCI6ImI5ZGdGV3FuOEtIUyIsInVzZXJJZCI6IlVTUl9BUVFVVS1iaDMiLCJmaXJzdE5hbWUiOiJrcmlzaG5hIiwic2NvcGUiOiJCcmFuY2giLCJtaWRkbGVOYW1lIjpudWxsLCJpc3N1ZXJEYXRlIjoxNjkzNDAyODAwNjA2LCJ1c2VyUm9sZSI6IkNBUkVQUk9WSURFUiIsImV4cCI6MTcwODk1NDgwMCwiaWF0IjoxNjkzNDAyODAwfQ.mVQ79WBrY2gHfqdQwniTosmkgxKEosq4MriWbPWKAezIYwRu8uK-dvuwlXZZKO2vUOBwvU3WdvgwoCVoSyiS2w`,
    });
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/bpGainPatternGraph/${id}/${sessionId}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getObservationByPId(id): Observable<PatientObservationDetails> {
    return this.http
      .get<PatientObservationDetails>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getPatientById/${id}`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  getlatestApptReadings(id: string): Observable<LatestVitalsList[]> {
    return this.http
      .get<LatestVitalsList[]>(
        `${environment.apiBaseUrl}/getLatestVital/byPatient/${id}`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  gethealthDeviceByPId(id) {
    // return this.http
    //   .get<any>(`${environment.apiBaseUrl}/device/byPatientId/${id}`, {})
    //   .pipe(
    //     map((data) => {
    //       return data;
    //     })
    //   );
  }
  averageBP(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getMeanBP/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  averageBG(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getMeanBs/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  averageWt(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getMeanWt/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  averageResidualWt(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getMeanResidualWt/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  // getObservationHistoryByPId(id) {
  //   return this.http
  //     .post<any>(`${environment.apiBaseUrl}/getPatientObserHisListdateBS/${id}`, {})
  //     .pipe(
  //       map((data) => {
  //         return data;
  //       }),
  //     );
  // }
  getObservationHistoryByPIddate(val, id, zone) {
    const zoneUrl = `getAllObservationsList/${id}?zone=${zone}`;
    const url = `getAllObservationsList/${id}`;
    if (!zone) {
      return this.http
        .post<any>(
          `${environment.apiBaseUrl}/${environment.data_service}/careprovider/${url}`,
          val
        )
        .pipe(
          map((data) => {
            if (data) {
              return data;
            }
          })
        );
    } else {
      return this.http
        .post<any>(
          `${environment.apiBaseUrl}/${environment.data_service}/careprovider/${zoneUrl}`,
          val
        )
        .pipe(
          map((data) => {
            if (data) {
              return data;
            }
          })
        );
    }
  }

  /**
   * Add Diagnostic
   */
  addDiagnostic(id: string, body: any): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/createDiagnosis?patientId=${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateDiagnostic(id: string, body: any): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/updateDiagnosis/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  /**
   * Diagnostic List Names
   */
  getdiagnosislistNames(val: string) {
    return this.http
      .get<any>(
        // r/getAllIcdCodes?searchQuery=abc&page=0&size=10
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllIcdCodesBySearch?searchQuery=${val}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getdiagnosislist() {
    return this.http
      .get<any>(
        // r/getAllIcdCodes?searchQuery=abc&page=0&size=10
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllIcdCodesBySearch`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  /**
   * Edit patient
   */
  editPatient(id: string, body: any): Observable<any> {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/updateDiagnosis//${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDiagnosticListOfPatient(id: any): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getDiagnosisListOfPatientByPatientId?patientId=${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getLatestDiagnosticList(id: any, val): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getDiagnosisDetailsForPrefill?patientId=${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDiagnosticListByPatient(id: any, body): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getDiagnosis?patientId=${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getGuardianList(id: string, pageNumber, pageSize): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllGuardiansByPatient?patientId=${id}&page=${pageNumber}&size=${pageSize}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  addGuardian(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/addGuardian`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  editGuardian(val, id) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/updateGuardians/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getGuardianRelationList(): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllRelations`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getGuardianDetailsByContactNo(contactNo): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getGuardianByMobileNo/${contactNo}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDiagnosticList(id: string, body: any): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getDiagnosisPatientDetailsByPatientId/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getVitalHistory(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getAllVitalHistory/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getNextDialysisByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/NextDialyDate/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteNote(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/deleteNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deletetemplateNote(id) {
    return this.http
      .delete<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/DefaultDeleteNotes/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  createDefaultNotes(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/addDefaultNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  createNotes(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/addNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getSharedNotesNames(flag) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getRecevierNameByFlagId?flag=${flag}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  // Care plans API's
  createCarePlan(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/createCarePlan`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateCarePlan(val, Id) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/updateCarePlan/${Id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAllCarePlan(id, pageNumber, pageSize) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getAllCarePlanByPatientId?patientId=${id}&page=${pageNumber}&size=${pageSize}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAllCarePlanByProviderId(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getAllCarePlanByProviderId/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteCarePlan(id) {
    return this.http
      .delete<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/deleteCarePlan/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // ${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}
  spentTime(val, id) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/doctorActivities/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getListOfNotesById(id): Observable<NotesList> {
    return this.http
      .get<NotesList>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotesCG/${id}`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  getListOfDefaultNotes(val): Observable<TemplateList> {
    return this.http
      .post<TemplateList>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getDefaultNotes`,
        val
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  filterNotes(id, pageNumber, pageSize) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotesByPatientIdAndDate/${id}?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  // getDoctorDetails(id) {
  //   return this.http
  //     .get<any>(`${environment.apiBaseUrl}/getDoctorDetails/${id}`, {})
  //     .pipe(
  //       map((data) => {
  //         return data;
  //       })
  //     );
  // }
  getDoctorDetails() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllCareProviderDetails`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getcaregiverList() {
    return this.http.get<any>(`${environment.apiBaseUrl}/getListcare`, {}).pipe(
      map((data) => {
        return data;
      })
    );
  }
  editNotes(val) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/editNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  editDefaultNotes(val) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/defaultEditNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  editScheduleAppointment(val) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/updateAppointmentReq`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  lastAppointment(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getLastAppoitment/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  createNote(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/addNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  bloodPressureNotification(val) {
    return this.http
      .post<any>(`${this.uniqueUrl}/patient-resource/createPatientbpmngt`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  weightNotification(val) {
    return this.http
      .post<any>(`${this.uniqueUrl}/patient-resource/createPatientwtmngt`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getNoteById(pId) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getremarksbypatient/${pId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  searchPatient(val) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/searchPatientByName/${val}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  postMessage(val) {
    return this.http.post<any>(`${environment.apiBaseUrl}/sendSMS`, val).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getScheduledAppoinment(
    date,
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'dateOfAppointments',
    sortDirection = 'desc'
  ): Observable<AppointmentScheduledList> {
    const sortStr = `${sortColumn},${sortDirection}`;
    const zoneDate = new Date();
    const p = new String(zoneDate);
    const arr = p.split('GMT');
    const timeArr = arr[1].split(' ');
    const zoneTime = timeArr[0];
    const zoneTimeArr = zoneTime.split('');
    zoneTimeArr.splice(3, 0, ':');
    const utcTime = zoneTimeArr.join('');

    // let obj = {
    //   "appointmentDate": date,
    //   "userZone": utcTime
    // }

    return this.http
      .post<AppointmentScheduledList>(
        `${environment.apiBaseUrl}/getAppointments`,
        {
          appointmentDate: date,
          userZone: utcTime,
        }
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  getScheduledCalls() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getScheduleCall`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getScheduleCallByValue(val) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/searchScheduleCall?searchString=${val}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getScheduledAppoinmentByDate(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getAppointentsdate`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  filterScheduleCallByDate(
    val,
    status,
    page,
    size
  ): Observable<CallScheduleList> {
    const zoneDate = new Date();
    const p = new String(zoneDate);
    const arr = p.split('GMT');
    const timeArr = arr[1].split(' ');
    const zoneTime = timeArr[0];
    const zoneTimeArr = zoneTime.split('');
    zoneTimeArr.splice(3, 0, ':');
    const utcTime = zoneTimeArr.join('');
    // let o = zoneTime.insert(3, " are");

    const obj = {
      dateFrom: null,
      dateTo: val,
      // userZone: utcTime,
    };

    return this.http
      .post<CallScheduleList>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getListbyStatus?toDate=${val}&status=${status}&page=${page}&size=${size}`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  searchScheduleCallList(
    val,
    date,
    status,
    page,
    size
  ): Observable<CallScheduleList> {
    const zoneDate = new Date();
    const p = new String(zoneDate);
    const arr = p.split('GMT');
    const timeArr = arr[1].split(' ');
    const zoneTime = timeArr[0];
    const zoneTimeArr = zoneTime.split('');
    zoneTimeArr.splice(3, 0, ':');
    const utcTime = zoneTimeArr.join('');
    // let o = zoneTime.insert(3, " are");
    return this.http
      .post<CallScheduleList>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getListbyStatus?toDate=${date}&searchQuery=${val}&status=${status}&page=${page}&size=${size}`,
        {}
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          catchError((err) => {
            return of(err);
          })
        )
      );
  }
  scheduleCall(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/createScheduleCall`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  startCall(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/createCall`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  rescheduleCall(id, val) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/updateCall/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  cancelCall(id) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/cancelScheduleCall/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  seenNotification(id, val) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/updateNotificaitionStatus/${id}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  resetPassword(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/resetPassword`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  uploadProfile(val) {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .put<any>(`${environment.apiBaseUrl}/profile/image`, val)
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  getClaimsData(patientId, date) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/claims/bypatient/${patientId}?claimDate=${date}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getClaimsReview(patientId) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/claimReviewStatus/${patientId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getFilteredClaimsReview(patientId, date) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/claimReviewStatus/${patientId}?claimDate=${date}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteClaimById(id) {
    return this.http.delete<any>(`${environment.apiBaseUrl}/claims/${id}`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  submitClaimById(id) {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .post<any>(`${environment.apiBaseUrl}/claims/${id}/submit`, null)
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  changeClaimStatus(cId, val) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/claims/${cId}/status/${val}`, null)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getFilteredClaims(patientId: string, date: string): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/claims/bypatient/${patientId}?claimDate=${date}`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  getBpAnalytics(body) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/getAverageBPByFilters`,
        body
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  getBpAnalyticsByLocId(body) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getBpVitalAnalytics`, body)
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  public fileExists(url: string): Observable<boolean> {
    //
    return this.http.get(url).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
