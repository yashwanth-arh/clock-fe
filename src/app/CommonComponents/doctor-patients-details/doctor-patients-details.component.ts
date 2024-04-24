import { BpLineRangeChartComponent } from './../dashboard-graphs/bp-line-range-chart/bp-line-range-chart.component';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CareproviderMessageDialogComponent } from 'src/app/CareproviderDashboard/careprovider-message-dialog/careprovider-message-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
declare const CanvasJS: any;

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DatePipe } from '@angular/common';
import { AudioCallComponent } from 'src/app/twilio/audio-call/audio-call.component';
import { VideoCallComponent } from 'src/app/twilio/video-call/video-call.component';
import { Subscription } from 'rxjs';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import {
  SettingsStateService,
  UnitSettings,
} from 'src/app/core/services/settings-state.service';
import { FileService } from 'src/app/core/services/file.service';
import { ClaimsTimerService } from 'src/app/core/services/claims-timer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DashbaordStateService } from './dashbaord-state.service';
import { DateTransformationService } from 'src/app/core/services/date-transformation.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Room } from 'twilio-video';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
import { ParticipantsComponent } from 'src/app/twilio/participants/participants.component';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { DoctorSharedService } from 'src/app/doctor-dashboard/doctor-shared-service';
import { log } from 'console';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';

@Component({
  selector: 'app-doctor-patients-details',
  templateUrl: './doctor-patients-details.component.html',
  styleUrls: ['./doctor-patients-details.component.scss'],
})
export class DoctorPatientsDetailsComponent implements OnInit, OnDestroy {
  public activeRoom: Room;
  @ViewChild('participants') participants: ParticipantsComponent;
  @ViewChild('timer') timer: TimerComponent;
  scheduledId: string;
  callEndType: string;
  public rippleColor = 'red';
  public pageSize = 10;
  meanfromDate: Date;
  meantoDate: Date;
  dpid: any;
  showBp = false;
  showWt = true;
  showObservation = false;
  showDialysis = false;
  showAppointment = false;
  showVitals = false;
  showWtBPHist = false;
  showNotes = false;
  showMedication = false;
  observationData: any = [];
  adherenceBP: FormGroup;
  adherenceWeight: FormGroup;
  maxDate: Date = new Date();
  position: TooltipPosition = 'right';
  disabled = false;
  showDelay = 0;
  hideDelay = 0;
  showExtraClass = true;
  panelOpenState = false;
  adherenceBPCount: any = [];
  adherenceWtCount: any = [];
  healthData: any = [];
  actualNotelist: any = [];
  defaultNoteList: any = [];
  noteList: any = [];
  isWeightHighlited = true;
  pageNo: number;
  showDrawer = false;
  profileShowDrawer = false;
  meanBP: any;
  meanWt: any;
  meanBG: any;
  meanResidualWt: any;
  deviceCodeBp: string;
  wtdeviceCodeWt: string;
  deviceCodeBs: string;
  bpImeiNo: any;
  wtImeiNo: any;
  bsImeiNo: any;
  particularPatientIndex: any;
  @Input() category: string;
  @Input() appdrawer: any;
  obsPage = 1;
  size = 8;
  wtpageIndex = 0;
  roleid: any;
  userRole: string;
  defaultHeight: string;
  apptReadings: any;
  fromDate: Date = new Date();
  toDate: Date;
  isEditable = false;
  dryWeight: string;
  baseLineBp: string;
  bpDeviceCode: any;
  wtDeviceCode: any;
  bsDeviceCode: any;
  showBPGraphs = false;
  weightTimeLineComponent: any;
  bpTimeLineRangeComponent: any;
  adherenceCount: any;
  nonAdherenceCount: any;
  showDetails = false;
  imgSrcNote = 'assets/svg/DashboardIcons/Action Notes Blue.svg';
  imgSrcMsg = 'assets/svg/DashboardIcons/Action Message Blue.svg';
  imgSrcAudioCall = 'assets/svg/DashboardIcons/Action Audio Call Blue.svg';
  imgSrcVideoNote = 'assets/svg/DashboardIcons/Action Video Call Blue.svg';
  doctorName: string;
  doctorId: string;
  details: any = [];
  rightIcondisable = false;
  leftIconDisable: boolean;
  showClaims = false;
  highAlert: any = [];
  alert: any = [];
  good: any = [];
  nonAdherence: any = [];
  totalPats: any = [];
  highAlertPageCount: any = [];
  alertPageCount: any = [];
  goodPageCount: any = [];
  nonAdherencePageCount: any = [];
  totalPatsPageCount: any = [];
  zoneType: string;
  public overlayOn = false;
  observationStartTime: number;
  graphReview: boolean;
  dashboardReview: boolean;
  dashboardsubscription: Subscription;
  showBPTimeGraph = false;
  showWeightTimeGraph = false;
  showBGTrendGraph = false;
  showBPReadings = false;
  appoinmentHistoryList: any = [];
  appointmentDate: string;
  defaultWeight: string;
  messageSuccess: boolean;
  counter = 0;
  dashboardReviewArr: any = [];
  userId: string;
  username: string;
  BPAdherenceChartData: any;
  audioClicked = false;
  videoClicked = false;
  @ViewChild('profileDrawer') public pdrawer: MatDrawer;

  public patDetailsBlue = 'assets/svg/DashboardIcons/Patient Details Blue.svg';
  public patDetailsWhite =
    'assets/svg/DashboardIcons/Patient Details White.svg';
  public chartsBlue = 'assets/svg/DashboardIcons/Charts Blue.svg';
  public chartsWhite = 'assets/svg/DashboardIcons/Charts White.svg';
  public medBlue = 'assets/svg/DashboardIcons/Medication Blue.svg';
  public medWhite = 'assets/svg/DashboardIcons/Medication White.svg';
  public vitalsBlue = 'assets/svg/DashboardIcons/Vitals Blue.svg';
  public vitalssWhite = 'assets/svg/DashboardIcons/Vitals White.svg';
  public claimsBlue = 'assets/svg/DashboardIcons/Claims Black.svg';
  public claimsWhite = 'assets/svg/DashboardIcons/Claims White (1).svg';
  public obsBlue = 'assets/svg/DashboardIcons/Observation History Blue.svg';
  public obsWhite = 'assets/svg/DashboardIcons/Observation History White.svg';
  public appointmentBlue = 'assets/svg/DashboardIcons/Appintments Blue.svg';
  public appointmentWhite = 'assets/svg/DashboardIcons/Appintments White.svg';
  // private timer: Observable<number> = interval(1000);
  private timerSubscription: Subscription;
  public dashboardTimer = 0;
  public graphTimer = 0;
  public clinicalNotesTimer = 0;
  public currentPatientId: string;
  showApptModule: boolean;
  medecationSelected: any;
  private pages = [
    'wt',
    'bp',
    'medication',
    'vitals',
    'appointment',
    'claims',
    'observation',
    'bpReadings',
  ];
  public contentChangeSubscription: Subscription;
  imageUrl: string;
  imagePath: any;
  scheduleCallId: any;
  bpDeviceModel: any;
  data: any;

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
    private auth: AuthService,
    private datepipe: DatePipe,
    private docService: DoctorDashboardService,
    private docsharedService: DoctorSharedService,
    private service: CaregiverDashboardService,
    private caregiversharedService: CaregiverSharedService,
    public settingsState: SettingsStateService,
    public fileService: FileService,
    private claimTimerService: ClaimsTimerService,
    public stateService: DashbaordStateService,
    public dateService: DateTransformationService,
    private _sanitizer: DomSanitizer,
    private filterService: FilterSharedService
  ) {
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.userId = localStorage.getItem('currentUserId');
    this.username = localStorage.getItem('currentUserName');
    this.particularPatientIndex = localStorage.getItem('patientIndex');
    this.imageUrl = environment.imagePathUrl;
    this.showApptModule = environment.appointment;

    if (this.particularPatientIndex === '0') {
      this.leftIconDisable = true;
    }
    this.dpid = localStorage.getItem('patientId');
    this.observationStartTime = new Date().getTime();

    this.bpTimeLineRangeComponent = new BpLineRangeChartComponent(
      service,
      caregiversharedService,
      auth,
      snackbarService
    );

    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.toDate = new Date();
    if (this.userRole === 'CAREPROVIDER') {
      this.getDoctorDetails();
    }
    // this.getObsById(this.dpid);
    this.getLatestReadings(this.dpid);
    this.getHealthDevicesById(this.dpid);
    this.getSettingsValues();
    const body = {
      dateFrom: this.fromDate,
      dateTo: this.toDate,
    };
    this.getAverageBP(body);
    // this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet =
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent
      );
  }
  selectedTabIndex: number = 0;
  medicationSelected: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.medicationSelected = localStorage.getItem('selectedMedication');
    this.tabCounts();
    if (this.medicationSelected === 'true') {
      this.selectedTabIndex = 2;
    }
    this.caregiversharedService.triggerdVitalsHist.subscribe((value) => {
      if (value) {
        this.medicationSelected = localStorage.getItem('selectedMedication');

        if (this.medicationSelected === 'true') {
          this.selectedTabIndex = 2;
        }

        this.caregiversharedService.changeSelectedMedications(true);
      }
    });

    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.currentPatientId = localStorage.getItem('patientId');
    this.caregiversharedService.overlayTriggered.subscribe((res) => {
      if (res) {
        this.overlayOn = true;
      } else {
        this.overlayOn = false;
      }
    });
    // this.caregiversharedService.triggeredPatientSidenavData.subscribe((res) => {
    //   if (Object.keys(res).length) {
    //     this.getObsById(res['id']);
    //   }
    // });
    // this.caregiversharedService.triggeredPatientCard.subscribe((data) => {
    //   if (data) {
    //     this.getObsById(this.currentPatientId);
    //   }
    // });
    // this.contentChangeSubscription = this.stateService.currentPageNo$.subscribe(
    //   (pageNo: number) => {
    //     if (pageNo) {
    //       this.pageNo = Number(pageNo);
    //       this.contentChange(this.pages[this.pageNo - 1]);
    //     }
    //   }
    // );
    this.dashboardTimer = this.claimTimerService.getTimerObjVal(
      this.currentPatientId,
      'dasboardReview'
    );
    this.graphTimer = this.claimTimerService.getTimerObjVal(
      this.currentPatientId,
      'graphReview'
    );
    this.clinicalNotesTimer = this.claimTimerService.getTimerObjVal(
      this.currentPatientId,
      'clinincalNotes'
    );

    this.caregiversharedService.triggeredPatientDrawer.subscribe((value) => {
      if (value) {
        if (this.profileShowDrawer) {
          this.pdrawer.toggle();
        }
      }
    });

    this.caregiversharedService.triggeredAppts.subscribe((data) => {
      if (data) {
        this.getLatestReadings(this.dpid);
      }
    });

    if (!localStorage.getItem(`timerObj_${this.currentPatientId}`)) {
      this.claimTimerService.storeTimerObj(this.currentPatientId, {
        clinincalNotes: 0,
        dasboardReview: 0,
        graphReview: 0,
        patientCall: 0,
      });
    }
  }
  tabCounts() {
    this.service.getTabCounts().subscribe((data) => {
      localStorage.setItem('tabCount', JSON.stringify(data));
      this.filterService.tabCountData.next({
        data: JSON.parse(localStorage.getItem('tabCount')),
      });
    });
  }
  stopTracks(): void {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.videoTracks.forEach((publication) => {
        publication.track.stop();
      });
      this.activeRoom.localParticipant.audioTracks.forEach((publication) => {
        publication.track.stop();
      });
      this.activeRoom.localParticipant.tracks.forEach((publication) => {
        publication.unpublish();
      });
    }
  }
  leaveRoom(): void {
    this.participants?.clear();
    this.stopTracks();
    if (this.activeRoom) {
      this.activeRoom.disconnect();
      this.activeRoom = null;
    }
  }

  /**
   *  new function to click the page no changes
   *  to replace the multiple times the content change is getting called
   */
  getSettingsValues(): void {
    this.defaultWeight = 'lbs';
    this.defaultHeight = 'cms';

    // this.settingsState
    //   .getStoredSettings(this.userId)
    //   .subscribe((res: UnitSettings) => {
    //     if (res.lbs) {
    //       this.settingsState.setWeightUnit('lbs');
    //     } else {
    //       this.settingsState.setWeightUnit('kg');
    //     }
    //     if (res.feet) {
    //       this.settingsState.setHeightUnit('inches');
    //     } else {
    //       this.settingsState.setHeightUnit('cms');
    //     }
    //   });
  }
  downloadProfileIcon(obsData) {
    if (obsData?.patient?.profileurl) {
      this.service
        .downloadProfileIcons(obsData?.patient?.profileurl)
        .subscribe((res) => {
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + res['file']
          );
        });
    }
  }
  onMenuClick(pageName: string): void {
    const page = this.pages.indexOf(pageName) + 1;
    this.stateService.setCurrentPageNo(page);
  }

  getDoctorDetails(): void {
    this.data = JSON.parse(localStorage.getItem('careproviderDetails'));
    this.details = this.data;
    this.doctorId = this.details.id;
    this.doctorName = this.details.name;
    // this.service.getUserDetails().subscribe(
    //   (data) => {
    //     this.details = data;
    //     this.doctorId = this.details.id;
    //     this.doctorName = this.details.name;
    //   },
    //   (err) => {
    //     if (err.status === 401) {
    //       this.router.navigate(['/login']);
    //     } else {
    //       // this.snackbarService.error(err.error.message);
    //     }
    //   }
    // );
  }
  getHeight(ht): number {
    return Number(ht);
  }
  clickMe(): void {
    this.showBPGraphs = true;
  }
  // dryweightHistory(pid): void {
  //   this.docService.getWeightHistorByPId(pid).subscribe((res) => {
  //     this.dryweightHistory = res;
  //   });
  // }
  enableFilds() {
    this.isEditable = !this.isEditable;
  }
  getDay(date) {
    const hour = new Date(date).getHours();
    if (hour < 12) {
      return true;
    } else {
      return false;
    }
  }
  getNight(date) {
    const hour = new Date(date).getHours();
    if (hour >= 12) {
      return true;
    } else {
      return false;
    }
  }

  getLatestReadings(id: string): void {
    // this.service.getlatestApptReadings(id).subscribe(
    //   (res) => {
    //     if (res && res.length) {
    //       this.apptReadings = res[0];
    //     }
    //   },
    //   (err) => {
    //     // this.snackbarService.error(err.message);
    //   }
    // );
  }
  getObsById(pId) {
    // const pageIndex = JSON.parse(localStorage.getItem('page-index'));
    this.docService.getObservationByPId(pId).subscribe(
      (data) => {
        this.observationData = data;
        localStorage.setItem(
          'patientOnborading',
          this.observationData.patient?.lastBgUpdatedDate
        );
        localStorage.setItem(
          'patientUnderMedication',
          this.observationData?.patient?.patUnderMedication
        );
        this.downloadProfileIcon(this.observationData);
        this.docsharedService.dryWeight =
          this.observationData?.patient?.dryWeight;
        this.dryWeight = this.observationData?.patient?.dryWeight;
        this.baseLineBp =
          this.observationData?.patient?.systolicBloodPressure +
          '/' +
          this.observationData.patient?.diastolicBloodPressure;
        // this.iconEnableDisable(this.observationData);
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }

  iconChange(data) {
    if (data === 'wt') {
      this.patDetailsBlue = this.patDetailsWhite;
    } else if (data === 'bp') {
      this.chartsBlue = this.chartsWhite;
    } else if (data === 'medication') {
      this.medBlue = this.medWhite;
    } else if (data === 'dialysis') {
      this.vitalsBlue = this.vitalssWhite;
    } else if (data === 'appointment') {
      this.appointmentBlue = this.appointmentWhite;
    } else if (data === 'claims') {
      this.claimsBlue = this.claimsWhite;
    } else if (data === 'observation') {
      this.obsBlue = this.obsWhite;
    }
  }
  changeIcon() {
    this.patDetailsBlue = 'assets/svg/DashboardIcons/Patient Details Blue.svg';
    this.chartsBlue = 'assets/svg/DashboardIcons/Charts Blue.svg';
    this.medBlue = 'assets/svg/DashboardIcons/Medication Blue.svg';
    this.vitalsBlue = 'assets/svg/DashboardIcons/Vitals Blue.svg';
    this.appointmentBlue = 'assets/svg/DashboardIcons/Appintments Blue.svg';
    this.claimsBlue = 'assets/svg/DashboardIcons/Claims Black.svg';
    this.obsBlue = 'assets/svg/DashboardIcons/Observation History Blue.svg';
  }

  home() {
    this.router.navigate(['/careproviderDashboard/careprovider-patient-list']);
    this.docsharedService.changeMessage([]);
  }
  openVideoCall(id) {
    this.router.navigate([]).then(() => {
      window.localStorage.setItem('Patient-id', id);
      window.open('/caregiverDashboard/videoCallHomePage', id);
    });
  }
  openMessage(cellNo) {
    const messageModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '449px',
      height: '295px',
      data: cellNo,
    };
    const msgDialog = this.dialog
      .open(CareproviderMessageDialogComponent, messageModalConfig)
      .afterClosed()
      .subscribe(() => {});
  }

  formatDate(date) {
    const splittedDate = date.split('T');
    const time = splittedDate[1].substring(0, 5);
    return splittedDate[0] + ' ' + time;
  }

  getgraphBPImage(symptoms) {
    let img = '';
    for (let i = 0; i < symptoms.length; i++) {
      img +=
        '<img src=' + symptoms[i].symptomUrl + ' height="40" width="40" />';
    }
    return img;
  }
  getgraphWeightImage(symptoms) {
    let img = '';
    for (let i = 0; i < symptoms.length; i++) {
      img +=
        '<img src=' + symptoms[i].symptomUrl + ' height="40" width="40" />';
    }
    return img;
  }
  baselineBPWt(wt, bp) {
    let sys, dias;
    if (bp) {
      const splittedBP = bp.split('/');
      sys = splittedBP[0];
      dias = splittedBP[1];
    }
    let body = {};
    if (
      this.observationData.patient.dryWeight !== wt &&
      this.observationData.patient.systolicBloodPressure !== sys &&
      this.observationData.patient.diastolicBloodPressure !== dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: wt,
      };
    } else if (
      this.observationData.patient.dryWeight !== wt &&
      this.observationData.patient.systolicBloodPressure === sys &&
      this.observationData.patient.diastolicBloodPressure === dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: null,
        diastolic: null,
        weight: wt,
      };
    } else if (
      this.observationData.patient.dryWeight === wt &&
      this.observationData.patient.systolicBloodPressure !== sys &&
      this.observationData.patient.diastolicBloodPressure === dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: null,
      };
    } else if (
      this.observationData.patient.dryWeight === wt &&
      this.observationData.patient.systolicBloodPressure === sys &&
      this.observationData.patient.diastolicBloodPressure !== dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: null,
      };
    } else if (
      this.observationData.patient.dryWeight !== wt &&
      this.observationData.patient.systolicBloodPressure === sys &&
      this.observationData.patient.diastolicBloodPressure !== dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: wt,
      };
    } else if (
      this.observationData.patient.dryWeight !== wt &&
      this.observationData.patient.systolicBloodPressure !== sys &&
      this.observationData.patient.diastolicBloodPressure === dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: wt,
      };
    } else if (
      this.observationData.patient.dryWeight === wt &&
      this.observationData.patient.systolicBloodPressure !== sys &&
      this.observationData.patient.diastolicBloodPressure !== dias
    ) {
      body = {
        patientId: this.dpid,
        systolic: sys,
        diastolic: dias,
        weight: null,
      };
    }
    this.docService.updateBaselineBPWt(body).subscribe(
      () => {
        this.snackbarService.success('Updated successfully');
        // this.getObsById(this.dpid);
        // this.getBPTime(this.dpid);
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }
  getHealthDevicesById(pId) {
    // this.docService.gethealthDeviceByPId(pId).subscribe(
    //   (data) => {
    //     this.healthData = data;
    //     if (this.healthData.length) {
    //       this.bpDeviceCode = this.healthData[0].deviceCode;
    //       this.bpImeiNo = this.healthData[0].imeinumber;
    //       this.bpDeviceModel = this.healthData[0].deviceModelName;
    //     }
    //     // this.healthData.content?.forEach((e) => {
    //     //   if (e.category == 'bs') {
    //     //     this.bsDeviceCode = e.deviceCode;
    //     //     this.bsImeiNo = e.imeinumber;
    //     //   } else if (e.category == 'bp' || e.category == 'BP') {
    //     //     this.bpDeviceCode = e.deviceCode;
    //     //     this.bpDeviceModel = e.deviceModelNo;
    //     //     this.bpImeiNo = e.imeinumber;
    //     //   } else if (e.category == 'wt') {
    //     //     this.wtDeviceCode = e.deviceCode;
    //     //     this.wtImeiNo = e.imeinumber;
    //     //   } else {
    //     //     this.bpDeviceCode = e.deviceCode;
    //     //     this.bpImeiNo = e.imeinumber;
    //     //     this.bpDeviceModel = e.deviceModelName;
    //     //   }
    //     // });
    //     // this.getAvgResidualWeight(body);
    //     // this.getAverageWt(body);
    //     // this.getAverageBG(body);
    //   },
    //   (err) => {
    //     if (err.status === 401) {
    //       this.router.navigate(['/login']);
    //     } else {
    //       // this.snackbarService.error(err.error.message);
    //     }
    //   }
    // );
  }
  getAverageBP(value) {
    // this.docService.averageBP(value, this.dpid).subscribe(
    //   (res) => {
    //     this.meanBP = res;
    //   },
    //   (err) => {
    //     if (err.status === 401) {
    //       this.router.navigate(['/login']);
    //     } else {
    //       // this.snackbarService.error(err.error.message);
    //     }
    //   }
    // );
    // }
  }
  getAverageBG(value) {
    if (!this.healthData.content.length) {
      this.deviceCodeBs = undefined;
    }
    this.healthData.content.forEach((res) => {
      if (res.category === 'bs') {
        this.deviceCodeBs = res.deviceCode;
      }
    });
    this.docService.averageBG(value, this.deviceCodeBs).subscribe(
      (res) => {
        this.meanBG = res.bs;
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }

  getAverageWt(value) {
    if (this.healthData.content.length) {
      this.healthData.content.forEach((res) => {
        if (res.category === 'wt') {
          this.wtdeviceCodeWt = res.deviceCode;
        }
      });
      this.docService.averageWt(value, this.wtdeviceCodeWt).subscribe(
        (res) => {
          this.meanWt = res;
        },
        (err) => {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            // this.snackbarService.error(err.error.message);
          }
        }
      );
    }
  }
  getOverlay(event) {
    if (event) {
      this.overlayOn = false;
    }
  }
  openNav(drawer) {
    this.overlayOn = true;
    this.showWtBPHist = false;
    this.showNotes = true;
    drawer.toggle();
    this.getNotesList(this.dpid);
    // this.getDefaultNotes();
    if (this.profileShowDrawer) {
      this.pdrawer.toggle();
      this.profileShowDrawer = false;
    }
    this.caregiversharedService.changeDrawerToggled(true);
  }
  openWtBPHist(drawer) {
    this.overlayOn = true;
    this.showNotes = false;
    this.showWtBPHist = true;
    drawer.toggle();
  }

  getAvgResidualWeight(value) {
    this.docService.averageResidualWt(value, this.dpid).subscribe(
      (res) => {
        this.meanResidualWt = res;
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }

  startChange(evt) {
    this.meanfromDate = evt.value;
  }
  endChange(evt) {
    this.meantoDate = evt.value;
    const body = {
      dateFrom: this.caregiversharedService.formatDate(this.meanfromDate),
      dateTo: this.caregiversharedService.formatDate(this.meantoDate),
    };

    // this.getAverageBG(body);
    // this.getAvgResidualWeight(body);
    // this.getAverageWt(body);
    if (this.meanfromDate && this.meantoDate) {
      this.getAverageBP(body);
      // this.getAdherenceBP(this.dpid, this.meanfromDate, this.meantoDate);
      this.caregiversharedService.changeDates({
        from: this.meanfromDate.toISOString(),
        to: this.meantoDate.toISOString(),
      });
    }
  }

  loadAdherenceBP() {
    const chart = new CanvasJS.Chart('adherenceBP', {
      animationEnabled: true,
      exportEnabled: true,
      // title: {
      //   text: "Adherence Report"
      // },
      data: [
        {
          type: 'column',
          dataPoints: this.adherenceBPCount,
        },
      ],
    });
    chart.render();
  }
  loadAdherenceWeight() {
    const chart = new CanvasJS.Chart('adherenceWeight', {
      animationEnabled: true,
      exportEnabled: true,
      // title: {
      //   text: "Adherence Report"
      // },
      data: [
        {
          type: 'column',
          dataPoints: this.adherenceWtCount,
        },
      ],
    });
    chart.render();
  }
  drawerToggle(drawer) {
    if (this.showDrawer) {
      drawer.toggle();
      this.showDrawer = !this.showDrawer;
      this.caregiversharedService.changeDrawerToggled(true);
    }
  }
  profileDrawerToggle(profileDrawer) {
    this.profileShowDrawer = true;
    profileDrawer.toggle();
  }

  showPatientDetails() {
    this.showDetails = !this.showDetails;
  }

  closeProfileDrawerToggle(profileDrawer) {
    if (this.profileShowDrawer) {
      profileDrawer.toggle();
      this.profileShowDrawer = false;
    }
  }

  closeDrawerToggle(drawer, profileDrawer) {
    if (this.showDrawer) {
      drawer.toggle();
      this.showDrawer = false;
    } else if (this.profileShowDrawer) {
      profileDrawer.toggle();
      this.profileShowDrawer = false;
    }
  }

  onMouseOver(id): void {
    if (id === 0) {
      this.imgSrcNote = 'assets/svg/DashboardIcons/Action Notes White.svg';
    } else if (id === 1) {
      this.imgSrcMsg = 'assets/svg/DashboardIcons/Action Messages White.svg';
    } else if (id === 2) {
      this.imgSrcAudioCall = 'assets/svg/DashboardIcons/Action Phone White.svg';
    } else if (id === 3) {
      this.imgSrcVideoNote =
        'assets/svg/DashboardIcons/Action  Video Call White.svg';
    }
  }

  onMouseOut(): void {
    this.imgSrcNote = 'assets/svg/DashboardIcons/Action Notes Blue.svg';
    this.imgSrcMsg = 'assets/svg/DashboardIcons/Action Message Blue.svg';
    this.imgSrcAudioCall =
      'assets/svg/DashboardIcons/Action Audio Call Blue.svg';
    this.imgSrcVideoNote =
      'assets/svg/DashboardIcons/Action Video Call Blue.svg';
  }
  getNotesList(id) {
    this.noteList = [];
    this.docService.getListOfNotesByIdDoc(id).subscribe(
      (data) => {
        this.actualNotelist = data;
        const noteArr = [];
        this.noteList = [];
        const receivedNotelist = data;
        for (let i = 0; i < receivedNotelist.length; i++) {
          if (receivedNotelist[i].eShared === 1) {
            const flag = receivedNotelist[i].flag;
            let receiverName = '';
            let ptNoteId = '';
            for (let j = i; j < receivedNotelist.length; j++) {
              if (receivedNotelist[j].flag === flag) {
                if (j === i) {
                  receiverName = receivedNotelist[j].receiverName;
                  ptNoteId = receivedNotelist[j].ptNoteId;
                } else {
                  receiverName =
                    receiverName + ',' + receivedNotelist[j].receiverName;
                  ptNoteId = ptNoteId + ',' + receivedNotelist[j].ptNoteId;
                }
              }
            }
            noteArr.push(receivedNotelist[i]);
            if (receiverName !== undefined) {
              noteArr[noteArr.length - 1].receiverName = receiverName;
            }
            noteArr[noteArr.length - 1].ptNoteId = ptNoteId;
            noteArr.forEach((item) => {
              if (this.noteList.findIndex((j) => j.flag === item.flag) === -1) {
                this.noteList.push(item);
              }
            });
            localStorage.removeItem('notes');
            localStorage.setItem('notes', JSON.stringify(this.noteList));
          } else {
            this.noteList.push(receivedNotelist[i]);
            localStorage.setItem('notes', JSON.stringify(this.noteList));
          }
        }
      },
      (err) => {
        // this.snackbarService.error(err.error.message);
      }
    );
  }
  getDefaultNotes() {
    const fromdate = new Date(this.fromDate); // Or the date you'd like converted.
    const isoFromDateTime = new Date(
      fromdate.setHours(5, 30, 0, 0)
    ).toISOString();
    const todate = new Date(this.toDate); // Or the date you'd like converted.
    todate.setDate(todate.getDate() + 1);
    const isoToDateTime = new Date(todate.setHours(5, 30, 0, 0)).toISOString();
    const body = {
      dateFrom: isoFromDateTime,
      dateTo: isoToDateTime,
    };
    this.docService.getListOfDefaultNotes(body).subscribe(
      (data) => {
        this.defaultNoteList = data.content;
        this.defaultNoteList = this.defaultNoteList.sort((a, b) => {
          return (
            new Date(b.createdDate).valueOf() -
            new Date(a.createdDate).valueOf()
          );
        });
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }
  viewEditedNote(evt) {
    if (evt) {
      this.getNotesList(this.dpid);
    }
  }
  viewTemplate(evt) {
    if (evt) {
      this.getDefaultNotes();
    }
  }
  getAsDate(day, time) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'pm' && hours < 12) {
      hours = hours + 12;
    }
    if (AMPM === 'am' && hours === 12) {
      hours = hours - 12;
    }
    let sHours = hours.toString();
    let sMinutes = minutes.toString();

    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }
    time = sHours + ':' + sMinutes + ':00';
    const d: Date = new Date(day);
    d.setDate(d.getDate() + 1);
    const n = d.toISOString().substring(0, 10);
    const newDate = n + 'T' + time;
    return newDate;
  }
  startVideoCall(): void {
    this.videoClicked = true;
    const userName = localStorage.getItem('currentUserName');

    if (
      userName == undefined ||
      userName == null ||
      userName == '' ||
      userName == 'N/A'
    ) {
    } else {
      // const immediatedate = this.caregiversharedService.formatDate(new Date());
      // const immediatetime = new Date().toTimeString();
      const callType = 'IMMEDIATE_VIDEOCALL';
      if (this.profileShowDrawer) {
        this.pdrawer.toggle();
      }
      const body = {
        patientName:
          this.observationData?.patient?.firstName +
          ' ' +
          this.observationData?.patient?.lastName,
        senderName: userName,
        sender: this.doctorId,
        receiver: this.observationData?.patient?.id,
        scheduleDate: new Date().toUTCString(),
        callType,
        call: 'null',
        scheduledBy: this.userRole,
        scheduleCallStatus: 'INPROGRESS',
      };
      this.service.startCall(body).subscribe(
        (res) => {
          if (res) {
            this.scheduleCallId = res.id;
            localStorage.setItem('scheduledid', this.scheduleCallId);
            localStorage.setItem('callEndType', 'IMMEDIATE_CALL');
            const dialogConfig: MatDialogConfig = {
              disableClose: true,
              closeOnNavigation: false,
              hasBackdrop: false,
              maxWidth: '1726px',
              maxHeight: '100vh',
              height: '92vh',
              width: '60%',
              panelClass: 'video-call-container',
              data: {
                scheduleId: res.id,
                identity:
                  this.observationData?.patient?.firstName +
                  ' ' +
                  this.observationData?.patient?.lastName,
                room: this.observationData?.patient?.id,
                video: 'true',
                audio: 'true',
                uniqueKey: callType,
                callEndType: 'IMMEDIATE_CALL',
                // element: ele,
                patientName:
                  this.observationData?.patient?.firstName +
                  ' ' +
                  this.observationData?.patient?.lastName,
              },
            };
            const videoCallDialog = this.dialog.open(
              VideoCallComponent,
              dialogConfig
            );
            localStorage.setItem(
              'openedVideoCallDialog',
              JSON.stringify(this.observationData)
            );

            videoCallDialog.afterClosed().subscribe((e) => {
              if (e) {
                this.snackbarService.error(
                  'Patient did not joined the call. Please try after sometime'
                );
                this.scheduledId = localStorage.getItem('scheduledid');
                this.callEndType = localStorage.getItem('callEndType');

                if (this.callEndType === 'IMMEDIATE_CALL') {
                  var callDuration = JSON.parse(
                    localStorage.getItem('durationCall')
                  );

                  this.service
                    .updateImmediateCompleteStatus(
                      this.scheduledId,
                      callDuration.duration
                    )
                    .subscribe(() => {
                      this.leaveRoom();
                      localStorage.removeItem('openedAudioCallDialog');
                      localStorage.removeItem('callDurationTime');
                      localStorage.removeItem('scheduledid');
                      localStorage.removeItem('callEndType');
                    });
                } else if (this.callEndType === 'SCHEDULE_CALL') {
                  this.service
                    .updateScheduleCompleteStatus(
                      this.scheduledId,
                      callDuration.duration
                    )
                    .subscribe(() => {
                      this.leaveRoom();
                      localStorage.removeItem('openedAudioCallDialog');
                      localStorage.removeItem('callDurationTime');
                      localStorage.removeItem('scheduledid');
                      localStorage.removeItem('callEndType');
                    });
                }
                setTimeout(() => {
                  location.reload();
                }, 4000);
              } else {
                location.reload();
              }
            });
          } else {
            this.snackbarService.error('Call cannot be connected!', 4000);
          }
        },
        (err) => {
          this.videoClicked = false;
          // this.snackbarService.error(err.message);
        }
      );
    }
  }
  getProfileImage(pImg) {
    if (pImg.includes('chc.xyramsoft.com')) {
      const position = 25;
      const output = [
        pImg.slice(0, position),
        ':452',
        pImg.slice(position),
      ].join('');
      return output;
    } else {
      return this.imageUrl + pImg;
    }
  }
  startAudioCall(): void {
    this.audioClicked = true;
    const userName = localStorage.getItem('currentUserName');

    if (
      userName == undefined ||
      userName == null ||
      userName == '' ||
      userName == 'N/A'
    ) {
    } else {
      // let immediatedate = this.caregiversharedService.formatDate(new Date());
      // let immediatetime = new Date().toTimeString();
      const callType = 'IMMEDIATE_VOICECALL';
      const body = {
        patientName:
          this.observationData?.patient?.firstName +
          ' ' +
          this.observationData?.patient?.lastName,
        senderName: userName,
        sender: this.doctorId,
        receiver: this.observationData?.patient?.id,
        callType,
        scheduleDate: new Date().toUTCString(),
        call: 'null',
        scheduledBy: this.userRole,
        scheduleCallStatus: 'INPROGRESS',
      };

      this.service.startCall(body).subscribe(
        (res) => {
          if (res) {
            this.scheduleCallId = res.id;
            localStorage.setItem('scheduledid', this.scheduleCallId);
            localStorage.setItem('callEndType', 'IMMEDIATE_CALL');
            const audioModalConfig: MatDialogConfig = {
              disableClose: true,
              closeOnNavigation: false,
              hasBackdrop: false,
              maxHeight: '100vh',
              maxWidth: '1762px',
              height: '82vh',
              width: '50%',
              panelClass: 'audio-call-container',
              data: {
                scheduleId: res.id,
                identity:
                  this.observationData?.patient?.firstName +
                  ' ' +
                  this.observationData?.patient?.lastName,
                room: this.observationData?.patient?.id,
                video: 'false',
                audio: 'true',
                callEndType: 'IMMEDIATE_CALL',
                patientName:
                  this.observationData?.patient?.firstName +
                  ' ' +
                  this.observationData?.patient?.lastName,
              },
            };
            const audioCallDialog = this.dialog.open(
              AudioCallComponent,
              audioModalConfig
            );
            localStorage.setItem(
              'openedAudioCallDialog',
              JSON.stringify(this.observationData)
            );

            audioCallDialog.afterOpened().subscribe((e) => {
              // send notification
            });
            audioCallDialog.afterClosed().subscribe((e) => {
              if (e) {
                this.snackbarService.error(
                  'Patient did not joined the call. Please try after sometime'
                );
                this.scheduledId = localStorage.getItem('scheduledid');
                this.callEndType = localStorage.getItem('callEndType');

                if (this.callEndType === 'IMMEDIATE_CALL') {
                  var callDuration = JSON.parse(
                    localStorage.getItem('durationCall')
                  );

                  this.service
                    .updateImmediateCompleteStatus(
                      this.scheduledId,
                      callDuration.duration
                    )
                    .subscribe(() => {
                      this.leaveRoom();
                      localStorage.removeItem('openedAudioCallDialog');
                      localStorage.removeItem('callDurationTime');
                      localStorage.removeItem('scheduledid');
                      localStorage.removeItem('callEndType');
                    });
                } else if (this.callEndType === 'SCHEDULE_CALL') {
                  this.service
                    .updateScheduleCompleteStatus(
                      this.scheduledId,
                      callDuration.duration
                    )
                    .subscribe(() => {
                      this.leaveRoom();
                      localStorage.removeItem('openedAudioCallDialog');
                      localStorage.removeItem('callDurationTime');
                      localStorage.removeItem('scheduledid');
                      localStorage.removeItem('callEndType');
                    });
                }
                setTimeout(() => {
                  location.reload();
                }, 4000);
              } else {
                location.reload();
              }
            });
          } else {
            this.snackbarService.error('Call cannot be connected!', 4000);
          }
        },
        (err) => {
          this.audioClicked = false;
          // this.snackbarService.error(err.message);
        }
      );
    }
  }
  notesFilterByDate(id, evtVal): void {
    // const fromdate = new Date(evtVal.from); // Or the date you'd like converted.
    // const isoFromDateTime = new Date(
    //   fromdate.setHours(5, 30, 0, 0)
    // ).toISOString();
    // const todate = new Date(evtVal.to); // Or the date you'd like converted.
    // if (todate) {
    //   todate.setDate(todate.getDate() + 1);
    // }
    // const isoToDateTime = new Date(todate.setHours(5, 30, 0, 0)).toISOString();
    // const body = {
    //   dateFrom: isoFromDateTime,
    //   dateTo: isoToDateTime,
    // };
    // this.service.filterNotes(id, body).subscribe(
    //   (data) => {
    //     this.noteList = data;
    //     this.defaultNoteList = this.defaultNoteList.sort((a, b) => {
    //       return (
    //         new Date(b.createdDate).valueOf() -
    //         new Date(a.createdDate).valueOf()
    //       );
    //     });
    //   },
    //   (err) => {
    //     // this.snackbarService.error(err.error.message);
    //   }
    // );
  }
  triggeredNoteList(evt): void {
    if (evt) {
      this.notesFilterByDate(this.dpid, evt);
    }
  }

  appoinmentHistory() {}
  // getByTabChange(event: MatTabChangeEvent) {
  //   if (event.tab.textLabel === '1') {
  //     // this.showBGTrendGraph = false;
  //     // this.showWeightTimeGraph = false;
  //     this.showBPTrendGraph = true;
  //     this.showBPTimeGraph = false;
  //   } else if (event.tab.textLabel === '2') {
  //     // this.showBGTrendGraph = false;
  //     // this.showWeightTimeGraph = false;
  //     this.showBPTrendGraph = false;
  //     this.showBPTimeGraph = true;
  //   }
  // }
  ngOnDestroy(): void {
    this.caregiversharedService.changePatientSideNavData({});
    this.stateService.setCurrentPageNo(1);
    // this.dashboardsubscription.unsubscribe();
    localStorage.removeItem('currentPage');
    localStorage.removeItem('BPLineData');
    localStorage.removeItem('BGLineData');
    localStorage.removeItem('BGTrendData');
    localStorage.removeItem('BPTrendData');
    localStorage.removeItem('BGAdherenceData');
    localStorage.removeItem('BPAdherenceData');
    localStorage.removeItem('currentPage');
    // this.caregiversharedService.changeDates({});
    this.caregiversharedService.changeBGLine(null);
    this.caregiversharedService.changeBPLine(null);
    this.caregiversharedService.changeBPTrend(null);
    this.caregiversharedService.changeBGTrend(null);
    this.caregiversharedService.changeDates({});
    this.caregiversharedService.changeHeaderTitle(true);
    // this.timerSubscription.unsubscribe();
    // this.contentChangeSubscription.unsubscribe();
  }
  isNumber(n: any): boolean {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  closeNotesDrawer(): void {
    this.showNotes = false;
  }
  goForwardPatient() {
    if (this.zoneType == 'HighAlert') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.highAlert.length) {
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(1, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.highAlert = this.highAlert.concat(res['patients']);
            }
          }, 3000);
        });
      } else if (this.particularPatientIndex === this.highAlert.length) {
        // this.rightIcondisable = true;
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(1, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.highAlert = this.highAlert.concat(res['patients']);
              if (this.particularPatientIndex < this.highAlert.length) {
                this.highAlert[this.particularPatientIndex];
                this.commonCode(
                  this.highAlert[this.particularPatientIndex].patient.id
                );
              }
            }
          }, 3000);
        });
      }
      if (this.particularPatientIndex < this.highAlert.length) {
        this.highAlert[this.particularPatientIndex];
        if (
          this.highAlert[this.particularPatientIndex].patient.id ===
          this.highAlert[this.highAlert.length - 1].patient.id
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.highAlert[this.particularPatientIndex].patient.id);
      }
    } else if (this.zoneType == 'Alert') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.alert.length) {
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(2, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.alert = this.alert.concat(res['patients']);
            }
          }, 3000);
        });
      } else if (this.particularPatientIndex === this.alert.length) {
        // this.rightIcondisable = true;
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(2, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.alert = this.alert.concat(res['patients']);
              if (this.particularPatientIndex < this.alert.length) {
                this.alert[this.particularPatientIndex];
                this.commonCode(
                  this.alert[this.particularPatientIndex].patient.id
                );
              }
            }
          }, 3000);
        });
      }
      if (this.particularPatientIndex < this.alert.length) {
        this.alert[this.particularPatientIndex];
        if (
          this.alert[this.particularPatientIndex].patient.id ===
          this.alert[this.alert.length - 1].patient.id
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.alert[this.particularPatientIndex].patient.id);
      }
    } else if (this.zoneType == 'Good') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.good.length) {
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(3, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.good = this.good.concat(res['patients']);
            }
          }, 3000);
        });
      } else if (this.particularPatientIndex === this.good.length) {
        // this.rightIcondisable = true;
        this.counter = this.counter + 1;
        this.service.getPatientsByZone(2, this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.good = this.good.concat(res['patients']);
              if (this.particularPatientIndex < this.good.length) {
                this.good[this.particularPatientIndex];
                this.commonCode(
                  this.good[this.particularPatientIndex].patient.id
                );
              }
            }
          }, 3000);
        });
      }
      if (this.particularPatientIndex < this.good.length) {
        this.good[this.particularPatientIndex];
        if (
          this.good[this.particularPatientIndex].patient.id ===
          this.good[this.good.length - 1].patient.id
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.good[this.particularPatientIndex].patient.id);
      }
    } else if (this.zoneType == 'NonAdherence') {
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.nonAdherence.length) {
        this.counter = this.counter + 1;

        this.service.getNonadherence(this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.nonAdherence = this.nonAdherence.concat(res['patients']);
            }
          }, 3000);
        });
        // this.rightIcondisable = true;
      } else if (this.particularPatientIndex === this.nonAdherence.length) {
        this.counter = this.counter + 1;
        this.service.getNonadherence(this.counter, 10).subscribe((res) => {
          setTimeout(() => {
            if (!res['patients'].length) {
              this.rightIcondisable = true;
            } else {
              this.nonAdherence = this.nonAdherence.concat(res['patients']);

              if (this.particularPatientIndex < this.nonAdherence.length) {
                this.nonAdherence[this.particularPatientIndex];
                this.commonCode(
                  this.nonAdherence[this.particularPatientIndex].patient.id
                );
              }
            }
          }, 3000);
        });
      }
      if (this.particularPatientIndex < this.nonAdherence.length) {
        this.nonAdherence[this.particularPatientIndex];
        this.commonCode(
          this.nonAdherence[this.particularPatientIndex].patient.id
        );
      }
    } else if (this.zoneType == 'totalPatients') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.totalPats.length) {
        this.counter = this.counter + 1;
        this.service
          .getPatientList(this.counter, 10, 'createdAt,desc')
          .subscribe((res) => {
            setTimeout(() => {
              if (!res['content'].length) {
                this.rightIcondisable = true;
              } else {
                this.totalPats = this.totalPats.concat(res['content']);
              }
            }, 3000);
          });
      } else if (this.particularPatientIndex === this.totalPats.length) {
        // this.rightIcondisable = true;
        this.counter = this.counter + 1;
        this.service
          .getPatientList(this.counter, 10, 'createdAt,desc')
          .subscribe((res) => {
            setTimeout(() => {
              if (!res['patients'].length) {
                this.rightIcondisable = true;
              } else {
                this.totalPats = this.totalPats.concat(res['content']);
                if (this.particularPatientIndex < this.totalPats.length) {
                  this.totalPats[this.particularPatientIndex];
                  this.commonCode(
                    this.totalPats[this.particularPatientIndex].id
                  );
                }
              }
            }, 3000);
          });
      }
      if (this.particularPatientIndex < this.totalPats.length) {
        this.totalPats[this.particularPatientIndex];
        this.commonCode(this.totalPats[this.particularPatientIndex].id);
      }
    }
  }
  goBackwardPatient() {
    if (this.zoneType == 'HighAlert') {
      this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

      if (this.particularPatientIndex >= 0) {
        if (this.particularPatientIndex === 0 && this.counter > 0) {
          this.leftIconDisable = true;
          this.counter = this.counter - 1;
          this.service
            .getPatientsByZone(1, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  if (this.counter !== 0) {
                    this.highAlert = this.highAlert.concat(
                      res['patients'].reverse()
                    );
                    this.highAlert.reverse();
                  } else {
                    this.leftIconDisable = true;
                  }
                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['patients'].length;
                  this.particularPatientIndex =
                    this.particularPatientIndex.toString();
                }
              }, 4000);
            });
        }
        if (this.particularPatientIndex < this.highAlert.length) {
          this.leftIconDisable = true;
          this.highAlert[this.particularPatientIndex];

          if (
            this.highAlert[this.particularPatientIndex].patient.id ===
            this.highAlert[0].patient.id
          ) {
            this.rightIcondisable = false;
          } else {
            this.rightIcondisable = true;
          }
          this.commonCode(
            this.highAlert[this.particularPatientIndex].patient.id
          );
          setTimeout(() => {
            if (this.particularPatientIndex === 0) {
              this.leftIconDisable = true;
            }
          }, 4000);
          // if (this.particularPatientIndex === 0) {
          //   this.particularPatientIndex = '0';
          // }
        }
      } else {
        this.counter = this.counter - 1;
        if (this.counter >= 0) {
          this.leftIconDisable = true;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  this.highAlert = this.highAlert.concat(
                    res['patients'].reverse()
                  );
                  this.highAlert.reverse();
                  this.particularPatientIndex =
                    this.particularPatientIndex + res['patients'].length;
                  if (this.particularPatientIndex < this.highAlert.length) {
                    this.highAlert[this.particularPatientIndex];
                    this.commonCode(
                      this.highAlert[this.particularPatientIndex].patient.id
                    );
                  }
                }
              }, 4000);
            });
        }
      }
    } else if (this.zoneType == 'Alert') {
      this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

      if (this.particularPatientIndex >= 0) {
        if (this.particularPatientIndex === 0 && this.counter > 0) {
          this.leftIconDisable = true;
          this.counter = this.counter - 1;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  if (this.counter !== 0) {
                    this.alert = this.alert.concat(res['patients'].reverse());
                    this.alert.reverse();
                  } else {
                    this.leftIconDisable = true;
                  }
                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['patients'].length;
                  this.particularPatientIndex =
                    this.particularPatientIndex.toString();
                }
              }, 4000);
            });
        }
        if (this.particularPatientIndex < this.alert.length) {
          this.leftIconDisable = true;
          this.alert[this.particularPatientIndex];

          if (
            this.alert[this.particularPatientIndex].patient.id ===
            this.alert[0].patient.id
          ) {
            this.rightIcondisable = false;
          } else {
            this.rightIcondisable = true;
          }
          this.commonCode(this.alert[this.particularPatientIndex].patient.id);
          setTimeout(() => {
            if (this.particularPatientIndex === 0) {
              this.leftIconDisable = true;
            }
          }, 4000);
          // if (this.particularPatientIndex === 0) {
          //   this.particularPatientIndex = '0';
          // }
        }
      } else {
        this.counter = this.counter - 1;
        if (this.counter >= 0) {
          this.leftIconDisable = true;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  this.alert = this.alert.concat(res['patients'].reverse());
                  this.alert.reverse();
                  this.particularPatientIndex =
                    this.particularPatientIndex + res['patients'].length;
                  if (this.particularPatientIndex < this.alert.length) {
                    this.alert[this.particularPatientIndex];
                    this.commonCode(
                      this.alert[this.particularPatientIndex].patient.id
                    );
                  }
                }
              }, 4000);
            });
        }
      }
    } else if (this.zoneType == 'Good') {
      this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

      if (this.particularPatientIndex >= 0) {
        if (this.particularPatientIndex === 0 && this.counter > 0) {
          this.leftIconDisable = true;
          this.counter = this.counter - 1;
          this.service
            .getPatientsByZone(3, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  if (this.counter !== 0) {
                    this.alert = this.alert.concat(res['patients'].reverse());
                    this.alert.reverse();
                  } else {
                    this.leftIconDisable = true;
                  }
                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['patients'].length;
                  this.particularPatientIndex =
                    this.particularPatientIndex.toString();
                }
              }, 4000);
            });
        }
        if (this.particularPatientIndex < this.alert.length) {
          this.leftIconDisable = true;
          this.alert[this.particularPatientIndex];

          if (
            this.alert[this.particularPatientIndex].patient.id ===
            this.alert[0].patient.id
          ) {
            this.rightIcondisable = false;
          } else {
            this.rightIcondisable = true;
          }
          this.commonCode(this.alert[this.particularPatientIndex].patient.id);
          setTimeout(() => {
            if (this.particularPatientIndex === 0) {
              this.leftIconDisable = true;
            }
          }, 4000);
          // if (this.particularPatientIndex === 0) {
          //   this.particularPatientIndex = '0';
          // }
        }
      } else {
        this.counter = this.counter - 1;
        if (this.counter >= 0) {
          this.leftIconDisable = true;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['patients'].length) {
                  this.leftIconDisable = true;
                } else {
                  this.alert = this.alert.concat(res['patients'].reverse());
                  this.alert.reverse();
                  this.particularPatientIndex =
                    this.particularPatientIndex + res['patients'].length;
                  if (this.particularPatientIndex < this.alert.length) {
                    this.alert[this.particularPatientIndex];
                    this.commonCode(
                      this.alert[this.particularPatientIndex].patient.id
                    );
                  }
                }
              }, 4000);
            });
        }
      }
    } else if (this.zoneType == 'NonAdherence') {
      this.particularPatientIndex = Number(this.particularPatientIndex) - 1;
      if (this.particularPatientIndex >= 0) {
        if (this.particularPatientIndex === 0 && this.counter > 0) {
          this.leftIconDisable = true;
          this.counter = this.counter - 1;

          this.service.getNonadherence(this.counter, 10).subscribe((res) => {
            setTimeout(() => {
              if (!res['patients'].length) {
                this.leftIconDisable = true;
              } else {
                if (this.counter !== 0) {
                  this.nonAdherence = this.nonAdherence.concat(
                    res['patients'].reverse()
                  );
                  this.nonAdherence.reverse();
                } else {
                  this.leftIconDisable = true;
                }

                // this.particularPatientIndex =
                //   this.particularPatientIndex + res['patients'].length;
                this.particularPatientIndex =
                  this.particularPatientIndex.toString();
              }
            }, 4000);
          });
        }
        if (this.particularPatientIndex < this.nonAdherence.length) {
          this.leftIconDisable = true;
          this.nonAdherence[this.particularPatientIndex];
          this.commonCode(
            this.nonAdherence[this.particularPatientIndex].patient.id
          );
          setTimeout(() => {
            if (this.particularPatientIndex === 0) {
              this.leftIconDisable = true;
            }
          }, 4000);
          // if (this.particularPatientIndex === 0) {
          //   this.particularPatientIndex = '0';
          // }
        }
      } else {
        this.counter = this.counter - 1;

        if (this.counter >= 0) {
          this.leftIconDisable = true;
          this.service.getNonadherence(this.counter, 10).subscribe((res) => {
            setTimeout(() => {
              if (!res['patients'].length) {
                this.leftIconDisable = true;
              } else {
                this.nonAdherence = this.nonAdherence.concat(
                  res['patients'].reverse()
                );
                this.nonAdherence.reverse();
                this.particularPatientIndex =
                  this.particularPatientIndex + res['patients'].length;
                if (this.particularPatientIndex < this.nonAdherence.length) {
                  this.nonAdherence[this.particularPatientIndex];
                  this.commonCode(
                    this.nonAdherence[this.particularPatientIndex].patient.id
                  );
                }
              }
            }, 4000);
          });
        }
      }
    } else if (this.zoneType == 'totalPatients') {
      this.particularPatientIndex = Number(this.particularPatientIndex) - 1;
      if (this.particularPatientIndex >= 0) {
        if (this.particularPatientIndex === 0 && this.counter > 0) {
          this.leftIconDisable = true;
          this.counter = this.counter - 1;
          this.service
            .getPatientList(this.counter, 10, 'createdAt,desc')
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.leftIconDisable = true;
                } else {
                  if (this.counter !== 0) {
                    this.totalPats = this.totalPats.concat(
                      res['content'].reverse()
                    );
                    this.totalPats.reverse();
                  } else {
                    this.leftIconDisable = true;
                  }

                  this.particularPatientIndex =
                    this.particularPatientIndex.toString();
                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['content'].length;
                }
              }, 4000);
            });
        }
        if (this.particularPatientIndex < this.totalPats.length) {
          this.leftIconDisable = true;

          this.totalPats[this.particularPatientIndex];
          this.commonCode(this.totalPats[this.particularPatientIndex].id);
          setTimeout(() => {
            if (this.particularPatientIndex === 0) {
              this.leftIconDisable = true;
            }
          }, 4000);
          // if (this.particularPatientIndex === 0) {
          //   this.particularPatientIndex = '0';
          // }
        }
      } else {
        this.counter = this.counter - 1;
        if (this.counter >= 0) {
          this.leftIconDisable = true;
          this.service
            .getPatientList(this.counter, 10, 'createdAt,desc')
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.leftIconDisable = true;
                } else {
                  this.totalPats = this.totalPats.concat(
                    res['content'].reverse()
                  );
                  this.totalPats.reverse();
                  this.particularPatientIndex =
                    this.particularPatientIndex + res['content'].length;
                  //
                  if (this.particularPatientIndex < this.totalPats.length) {
                    this.totalPats[this.particularPatientIndex];
                    this.commonCode(
                      this.totalPats[this.particularPatientIndex].id
                    );
                  }
                }
              }, 4000);
            });
        }
      }
    }
  }
  commonCode(newIndex) {
    localStorage.setItem('patientId', newIndex);
    this.caregiversharedService.changeGraphs({ id: newIndex });
    // this.caregiversharedService.changeBPLine({ id: newIndex });
    // this.caregiversharedService.changeBPTrend({ id: newIndex });
    // this.getObsById(newIndex);
    this.getLatestReadings(newIndex);
    this.getHealthDevicesById(newIndex);
    // this.removeItems();
    this.caregiversharedService.changeMaps({ id: newIndex });
    this.caregiversharedService.changeDates({
      id: newIndex,
      from: this.meanfromDate,
      to: this.meantoDate,
    });
    this.caregiversharedService.changeAppointment({ id: newIndex });
    this.caregiversharedService.changeObservationHist({ id: newIndex });
    this.caregiversharedService.changeVitalsHist({ id: newIndex });
    this.caregiversharedService.changeClaims({ id: newIndex });
    this.caregiversharedService.changeMedications({ id: newIndex });
    setTimeout(() => {
      // this.rightIcondisable = false;
      this.leftIconDisable = false;
    }, 3000);
  }
  iconEnableDisable(obsData) {
    if (this.zoneType === 'HighAlert') {
      this.highAlert && this.highAlert.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.highAlert.length && this.highAlert[0]?.id === obsData.patient.id
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'Alert') {
      this.alert && this.alert.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.alert.length && this.alert[0]?.id === obsData.patient.id
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'Good') {
      this.good && this.good.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.good.length && this.good[0]?.id === obsData.patient.id
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'NonAdherence') {
      this.nonAdherence && this.nonAdherence.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.nonAdherence?.length &&
      this.nonAdherence[0]?.patient.id === obsData.patient.id
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'totalPatients') {
      this.totalPats && this.totalPats.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.totalPats.length && this.totalPats[0]?.id === obsData.patient.id
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    }
  }

  // loadProgressBar(data) {
  //   this.adherenceCount = data.adharence;
  //   this.nonAdherenceCount = data.nonAdharence;
  //   var can = <HTMLCanvasElement>document.getElementById('canvas'),
  //     spanProcent = document.getElementById('procent'),
  //     c = can.getContext('2d');
  //   if (Number(data.adharence) !== 0 || Number(data.nonAdharence) !== 0) {
  //     var percentage =
  //       (Number(data.adharence) /
  //         (Number(data.adharence) + Number(data.nonAdharence))) *
  //       100;
  //   } else {
  //     percentage = 0;
  //   }
  //   var posX = can.width / 2,
  //     posY = can.height / 2,
  //     fps = 1000 / 200,
  //     procent = 0,
  //     oneProcent = 360 / 100,
  //     result = oneProcent * percentage;

  //   c.lineCap = 'round';
  //   arcMove(data);

  //   function arcMove(data) {
  //     var deegres = 0;
  //     var acrInterval = setInterval(function () {
  //       deegres += 1;
  //       c.clearRect(0, 0, can.width, can.height);

  //       if (Number(data.adharence) !== 0 || Number(data.nonAdharence) !== 0) {
  //         procent =
  //           (Number(data.adharence) /
  //             (Number(data.adharence) + Number(data.nonAdharence))) *
  //           100;
  //         spanProcent.innerHTML = procent.toFixed();
  //       } else {
  //         procent = 0;
  //         spanProcent.innerHTML = procent.toFixed();
  //       }
  //       c.beginPath();
  //       c.arc(
  //         posX,
  //         posY,
  //         70,
  //         (Math.PI / 180) * 270,
  //         (Math.PI / 180) * (270 + 360)
  //       );
  //       c.strokeStyle = '#cfcfcf';
  //       c.lineWidth = 10;
  //       c.stroke();

  //       c.beginPath();
  //       c.strokeStyle = '#1569A1';
  //       c.lineWidth = 10;
  //       c.arc(
  //         posX,
  //         posY,
  //         70,
  //         (Math.PI / 180) * 270,
  //         (Math.PI / 180) * (270 + deegres)
  //       );
  //       c.stroke();
  //       if (deegres >= result) clearInterval(acrInterval);
  //     }, fps);
  //   }
  // }
  // getAdherenceBP(pId, fDate, tDate) {
  //   var finalFromDate = fDate;
  //   var finalToDate = tDate;
  //   const dateFrom = finalFromDate.toISOString().split('T');
  //   const dateTo = finalToDate.toISOString().split('T');

  //   const body = {
  //     dateFrom: dateFrom[0],
  //     dateTo: dateTo[0],
  //   };
  //   if (
  //     this.BPAdherenceChartData &&
  //     Object.keys(this.BPAdherenceChartData).length
  //   ) {
  //     // this.loadProgressBar(this.BPAdherenceChartData);
  //   } else {
  //     this.service.adherenceBPBydate(body, pId).subscribe(
  //       (data) => {
  //         localStorage.setItem('BPAdherenceData', JSON.stringify(data));
  //         this.caregiversharedService.changeBPAdherence(
  //           localStorage.getItem('BPAdherenceData')
  //         );
  //         // this.loadProgressBar(data);
  //       },
  //       (err) => {
  //         // this.snackbarService.error(err.message);
  //       }
  //     );
  //   }
  // }
  ngDestroy() {
    localStorage.removeItem('BPLineData');
    localStorage.removeItem('BGLineData');
    localStorage.removeItem('BGTrendData');
    localStorage.removeItem('BPTrendData');
    localStorage.removeItem('BGAdherenceData');
    localStorage.removeItem('BPAdherenceData');
  }
  showNextAppt(ele): any {
    if (ele) {
      if (new Date(ele) > new Date()) {
        return this.datepipe.transform(ele, 'M/d/yy hh:mm a');
      } else {
        return '';
      }
    }
  }
  getTabDetails(event) {
    if (event.tab.textLabel === 'Vital History') {
      // this.showBPTrendGraph = true;
      this.showBPTimeGraph = false;
    } else if (event.tab.textLabel === 'Trends') {
      // this.showBPTrendGraph = false;
      this.showBPTimeGraph = true;
    } else if (event.tab.textLabel === 'Records') {
      this.showBPTimeGraph = false;
    }
  }
}
