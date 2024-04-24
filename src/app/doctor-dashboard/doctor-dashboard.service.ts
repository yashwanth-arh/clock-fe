import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { AuthStateService } from '../core/services/auth-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorDashboardService {
  public apiBaseUrl: string;
  public iheathApi: string;
  baseResource: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private stateService: AuthStateService
  ) {
    this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);

    this.stateService.baseResource.subscribe((res) => {
      this.baseResource = res;
    });
  }
  getEscalationBPCount() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getEscalationsCountBpDoc`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getEscalationWeightCount() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getEscalationsCountWtDoc`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getEscalation() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getEsclationResponse`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getRemarks() {
    return this.http.get<any>(`${environment.apiBaseUrl}/getremarks`, {}).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getActionsList() {
    return this.http.get<any>(`${environment.apiBaseUrl}/getAction`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  searchPatients(val, pageNumber = 0, pageSize = 10) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getAllpatients?searchQuery=${val}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString()),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  createNote(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/createremarks`,
        val
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

  getListOfNotesById() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotes`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getListOfNotesByIdDoc(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getNotes/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getListOfDefaultNotes(val) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getDefaultNotes`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatientObservation(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/patientsObsDtls/${id}`,
        {}
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
  getWeightPattern(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/weightGainPattern/${id}`, {})
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
  getBPTrend(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getBPGainTrendGraph/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getNotifications(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getNotificationBySenderId/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getDoctorDetails(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getDoctorDetails/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getcaregiverList(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getListcaregiver/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPrescriptions(id) {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .get<any>(`${environment.apiBaseUrl}/getPrescriptions/${id}`)
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  uploadPrescrition(val, id) {
    return (
      this.http
        // post<any>(`https://dev-api.clockhealth.ai/clock-data-collection/patient/uploadPrescription`,val)
        .post<any>(
          `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/uploadPrescription/${id}`,
          val
        )
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
  uploadMultiPrescrition(id, val) {
    return (
      this.http
        //get<any>(`${environment.apiBaseUrl}/patientAppointment/getHistory`,id)
        .post<any>(`${environment.apiBaseUrl}/uploadMultipleFiles/${id}`, val)
        .pipe(
          map((data) => {
            return data;
          })
        )
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
  adherenceBPBydate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/getCountadhereNonadhereBp/${id}`,
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
        `${environment.apiBaseUrl}/getCountadhereNonadhereWt/${id}`,
        val
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
  gethealthDeviceByPId(id) {
    // return this.http
    //   .get<any>(`${environment.apiBaseUrl}/device/byPatientId/${id}`, {})
    //   .pipe(
    //     map((data) => {
    //       return data;
    //     })
    //   );
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
  getBPTrendDate(val, id) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/getBPGainTrendGraphToFromDt/${id}`,
        val
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
  getWeightPatternDate(val, id) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/weightGainPatterndate/${id}`, val)
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
  getPatientsByZone(statusId) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/caregiver/getPatientsReadBySts/${statusId}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getObservationByPId(id) {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getPatientById/${id}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAnalyticsPie(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getAnalyticsCountByZone`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getPatientReadsList() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/gettotalpatients`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPatientsbySts() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientsReadByStsBS`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getTotalPatients() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/gettotalpatients`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getDoctorTotalPatients() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/gettotalpatients`, {})
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

  getEscalationsCount() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getpatientunseen`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getpatientHealthTrendDate(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getAnalyticsBPCountByZone`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getEscalationHistCountDate(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/getAnalyticsWtCountByZone`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getpatientHealthTrendDef() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/getAnalyticsBPCountByZoneByDefault`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getEscalationHistCount() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/getAnalyticsWtCountByZoneByDefault`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAppointmentHistoryList(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getAppointments/byPatient/${id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getObservationHistoryByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientObserHisList/${id}`, {})
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

  getVitalHistoryBPByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientVitalhistbp/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getVitalHistoryBSByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getPatientVitalhistBS/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getBpHistorByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getbphistory/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getWeightHistorByPId(id) {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getWeighthistory/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getNonadherence() {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/getNonadrencePatients`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  addMedication(val, PId) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/createPatientMedication?userId=${PId}`,
        val
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  editMedication(val, id) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/patientMedication/${id}`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
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
  audioCall(val) {
    return this.http.post<any>(`${environment.apiBaseUrl}/makeCall`, val).pipe(
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
  deletePrescription(id) {
    return this.http
      .delete<any>(`${environment.apiBaseUrl}/deletePrescription/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  changeMedicine(data: any, id) {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/changeMedicationStatus/${id}/${data}`,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteMedication(id) {
    return this.http
      .delete<any>(`${environment.apiBaseUrl}/patientMedication/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateBaselineBPWt(val) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/updatePatient`, val)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  setCallStarted(id) {
    return this.http
      .put<any>(`${environment.apiBaseUrl}/callStarted/${id}`, {})
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
        .put<any>(
          `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/uploadProfileImage`,
          val
        )
        .pipe(
          map((data) => {
            return data;
          })
        )
    );
  }
}
