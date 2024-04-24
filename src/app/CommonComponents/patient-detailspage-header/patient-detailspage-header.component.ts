import { BpLineRangeChartComponent } from './../dashboard-graphs/bp-line-range-chart/bp-line-range-chart.component';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AudioCallComponent } from 'src/app/twilio/audio-call/audio-call.component';
import { VideoCallComponent } from 'src/app/twilio/video-call/video-call.component';
import { interval, Observable, Subscription } from 'rxjs';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import {
  SettingsStateService,
  UnitSettings,
} from 'src/app/core/services/settings-state.service';
import { FileService } from 'src/app/core/services/file.service';
import { ClaimsTimerService } from 'src/app/core/services/claims-timer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DateTransformationService } from 'src/app/core/services/date-transformation.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Room } from 'twilio-video';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
import { ParticipantsComponent } from 'src/app/twilio/participants/participants.component';
import { DashbaordStateService } from '../doctor-patients-details/dashbaord-state.service';
import { EditBaselineBpComponent } from '../edit-baseline-bp/edit-baseline-bp.component';
import { EventEmitter } from 'stream';
import { EditClinicBpComponent } from 'src/app/edit-clinic-bp/edit-clinic-bp.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { DoctorSharedService } from 'src/app/doctor-dashboard/doctor-shared-service';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';

@Component({
  selector: 'app-patient-detailspage-header',
  templateUrl: './patient-detailspage-header.component.html',
  styleUrls: ['./patient-detailspage-header.component.scss'],
})
export class PatientDetailspageHeaderComponent implements OnInit, OnDestroy {
  public activeRoom: Room;
  @ViewChild('participants') participants: ParticipantsComponent;
  @ViewChild('timer') timer: TimerComponent;
  scheduledId: string;
  leavingComponent: boolean = false;
  callEndType: string;
  loadPatientData = false;
  loadNotes = false;
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
  observationData: any;
  maxDate: Date = new Date();
  position: TooltipPosition = 'right';
  disabled = false;
  showDelay = 0;
  hideDelay = 0;
  showExtraClass = true;
  panelOpenState = false;
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
  showBPTrendGraph = false;
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
  public imgSrcMedication = 'assets/svg/DashboardIcons/MedicationIcon.svg';
  // private timer: Observable<number> = interval(1000);
  private timerSubscription: Subscription;
  public dashboardTimer = 0;
  public graphTimer = 0;
  public clinicalNotesTimer = 0;
  public currentPatientId: string;
  showApptModule: boolean;

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
  // @Output() emitOverlay = new EventEmitter();
  userAgent: any;
  browserName: any;
  private _id: string;
  fullName: any;
  firstName: any;
  secondName: any;
  lastNamee: any;
  profileDrawer: any;
  diagnosisDetails: any;
  xpPoints: any;
  deviceClinicDetails: any;
  user: any;
  data: any;
  scopeId: any;
  isFirstIncrement: boolean = true;
  filterfromDate: string;
  filterToDate: string;
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
    public caregiversharedService: CaregiverSharedService,
    public settingsState: SettingsStateService,
    public fileService: FileService,
    public claimTimerService: ClaimsTimerService,
    public stateService: DashbaordStateService,
    public dateService: DateTransformationService,
    public editBaseline: MatDialog,
    private titlecasePipe: TitleCasePipe,
    private _sanitizer: DomSanitizer,
    private patientMgmtService: PatientManagementService
  ) {
    this.leavingComponent = false;
    this.userAgent = navigator.userAgent;

    if (this.userAgent.includes('Firefox')) {
      this.browserName = 'Firefox';
    } else {
      this.browserName = 'Chrome';
    }
    this.user = this.auth.authData;
    this.roleid = this.user?.userDetails?.id;
    this.userRole = this.user?.userDetails?.userRole;
    this.userId = this.user?.userDetails?.id;
    this.scopeId = this.user?.userDetails.scopeId;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
    this.particularPatientIndex = parseInt(
      localStorage.getItem('patientIndex')
    );
    // this.imageUrl = environment.imagePathUrl;
    this.showApptModule = environment.appointment;

    if (this.particularPatientIndex === 1) {
      this.leftIconDisable = true;
    }
    this.counter = localStorage.getItem('page-index')
      ? JSON.parse(localStorage.getItem('page-index'))
      : 0;
    // if (this.userRole === 'CAREGIVER' && route['_routerState'].snapshot.url.includes('/careproviderDashboard/patientProfile'))
    //   this.router.navigate(['/login']);
    this.dpid = localStorage.getItem('patientId');
    this.observationStartTime = new Date().getTime();
    this.highAlert = JSON.parse(localStorage.getItem('highAlertZonePatients'));
    this.alert = JSON.parse(localStorage.getItem('alertZonePatients'));
    this.good = JSON.parse(localStorage.getItem('goodZonePatients'));
    this.nonAdherence = JSON.parse(
      localStorage.getItem('nonAdherencePatients')
    );

    this.totalPats = JSON.parse(localStorage.getItem('allPatients'));

    this.zoneType = localStorage.getItem('zoneType');

    if (this.zoneType === 'HighAlert' && this.highAlert?.length < 2) {
      this.leftIconDisable = true;
      this.rightIcondisable = true;
    } else if (this.zoneType === 'Alert' && this.alert?.length < 2) {
      this.leftIconDisable = true;
      this.rightIcondisable = true;
    } else if (this.zoneType === 'Good' && this.good?.length < 2) {
      this.leftIconDisable = true;
      this.rightIcondisable = true;
    } else if (
      this.zoneType === 'NonAdherence' &&
      this.nonAdherence?.length < 2
    ) {
      this.leftIconDisable = true;
      this.rightIcondisable = true;
    } else if (
      this.zoneType === 'totalPatients' &&
      this.totalPats?.length < 2
    ) {
      this.leftIconDisable = true;
      this.rightIcondisable = true;
    }
    this.highAlertPageCount = JSON.parse(
      localStorage.getItem('1-patient-list-page-count')
    );
    this.alertPageCount = JSON.parse(
      localStorage.getItem('2-patient-list-page-count')
    );
    this.goodPageCount = JSON.parse(
      localStorage.getItem('3-patient-list-page-count')
    );
    this.nonAdherencePageCount = JSON.parse(
      localStorage.getItem('non-adherence-patient-list-page-count')
    );
    this.totalPatsPageCount = JSON.parse(
      localStorage.getItem('total-patient-list-page-count')
    );
    // this.weightTimeLineComponent = new WeightLineChartComponent(
    //   service,
    //   auth,
    //   caregiversharedService
    // );
    this.bpTimeLineRangeComponent = new BpLineRangeChartComponent(
      service,
      caregiversharedService,
      auth,
      snackbarService
    );

    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.toDate = new Date();
    setTimeout(() => {
      this.getDoctorDetails();
    }, 1000);
    // this.getObsById(localStorage.getItem('patientId'));
    // this.getLatestReadings(this.dpid);
    // this.getHealthDevicesById(this.dpid);
    this.getSettingsValues();
    const body = {
      dateFrom: this.fromDate,
      dateTo: this.toDate,
    };
    // this.getAverageBP(body, this.dpid);
    // this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet =
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent
      );
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.leavingComponent = false;
    this.caregiversharedService.triggeredNoteCarePlan.next(true);
    this.currentPatientId = localStorage.getItem('patientId');
    this.caregiversharedService.triggeredPatientCard.subscribe((data) => {
      if (data) {
        if (this.leavingComponent) {
          return;
        }
        setTimeout(() => {
          this.getObsById(localStorage.getItem('patientId'));
          this.getDiagnosticDetails(localStorage.getItem('patientId'));
          this.getDeviceInfo(localStorage.getItem('patientId'));
        }, 1000);
      } else {
        if (this.leavingComponent) {
          return;
        }
        setTimeout(() => {
          this.getObsById(localStorage.getItem('patientId'));
          this.getDiagnosticDetails(localStorage.getItem('patientId'));
          this.getDeviceInfo(localStorage.getItem('patientId'));
        }, 1000);
      }
    });
    this.caregiversharedService.triggeredPatientDrawer.subscribe((value) => {
      if (value) {
        if (this.profileShowDrawer) {
          this.pdrawer.toggle();
        }
      }
    });

    this.caregiversharedService.triggerdDates.subscribe((value) => {
      if (
        Object.keys(value)?.length &&
        (value.hasOwnProperty('from') ||
          (value.hasOwnProperty('to') &&
            (value['from'] !== undefined || value['to'] !== undefined)))
      ) {
        const dynamicFromDate = this.caregiversharedService.formatDate(
          value['from'] ? value['from'] : this.fromDate
        );
        const dynamicToDate = this.caregiversharedService.formatDate(
          value['to'] ? value['to'] : this.toDate
        );
        const dynamicFromTime = new Date(
          value['from'] ? value['from'] : this.fromDate
        ).toTimeString();

        const dynamicToTime = new Date(
          value['to'] ? value['to'] : this.toDate
        ).toTimeString();
        this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8);
        this.filterToDate = dynamicToDate + 'T' + dynamicToTime.substring(0, 8);

        const body = {
          dateFrom: this.filterfromDate,
          dateTo: this.filterToDate.replace('00:00:00', '23:59:59'),
        };

        this.getAverageBP(body, value['id'] ? value['id'] : this.dpid);
        this.getExperiencePoints(value['id'] ? value['id'] : this.dpid, body);
      } else if (Object.keys(value)?.length && value.hasOwnProperty('id')) {
        const body = {
          dateFrom: this.filterfromDate,
          dateTo: this.filterToDate.replace('00:00:00', '23:59:59'),
        };
        this.getAverageBP(body, value['id'] ? value['id'] : this.dpid);
        this.getExperiencePoints(value['id'] ? value['id'] : this.dpid, body);
      } else {
        const body = {
          dateFrom: this.fromDate,
          dateTo: this.toDate,
        };
        this.getExperiencePoints(value['id'] ? value['id'] : this.dpid, body);
      }
    });
    this.contentChangeSubscription = this.stateService.currentPageNo$.subscribe(
      (pageNo: number) => {
        if (pageNo) {
          this.pageNo = Number(pageNo);
          this.contentChange(this.pages[this.pageNo - 1]);
        }
      }
    );
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
    this.defaultHeight = 'inches';

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
  // downloadProfileIcon(obsData) {
  //   if (obsData?.patientProfile) {
  //     this.service
  //       .downloadProfileIcons(obsData?.patientProfile)
  //       .subscribe((res) => {
  //         this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(
  //           'data:image/jpg;base64,' + res['file']
  //         );
  //       });
  //   }
  // }
  onMenuClick(pageName: string): void {
    const page = this.pages.indexOf(pageName) + 1;

    this.stateService.setCurrentPageNo(page);
  }

  getDoctorDetails(): void {
    this.data = JSON.parse(localStorage.getItem('careproviderDetails'));
    this.details = this.data;
    this.doctorId = this.details.id;
    this.doctorName = this.details.name;
    localStorage.setItem('medicationPermission', this.data?.medication);
    localStorage.setItem('notesPermission', this.data?.notes);
    // this.service.getUserDetails().subscribe(
    //   (data) => {
    //     this.details = data;
    //     this.doctorId = this.details.id;
    //     this.doctorName = this.details.name;
    //     localStorage.setItem('medicationPermission', data?.medication);
    //     localStorage.setItem('notesPermission', data?.notes);
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
  getDeviceInfo(id) {
    if (this.leavingComponent) {
      return;
    }
    this.service.deviceInfoDetails(id).subscribe((res) => {
      this.deviceClinicDetails = res;
    });
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
  // editBaselinebp(sys, dia, id) {
  //   const createhospitalModalConfig = new MatDialogConfig();

  //   createhospitalModalConfig.disableClose = true;
  //   (createhospitalModalConfig.maxWidth = '100vw'),
  //     (createhospitalModalConfig.maxHeight = '100vh'),
  //     (createhospitalModalConfig.width = '35%'),
  //     (createhospitalModalConfig.data = { data: sys, dia, id });
  //   // (edithospitalModalConfig.data = {
  //   //   edit: editData,
  //   //   mode: 'EDIT',
  //   // }

  //   this.editBaseline
  //     .open(EditBaselineBpComponent, createhospitalModalConfig)
  //     .afterClosed()
  //     .subscribe(() => {
  //       this.getObsById(this.dpid);
  //       // this.gethospitalList();
  //     });
  // }

  // editClinicbp(sys, id) {
  //   const createhospitalModalConfig = new MatDialogConfig();

  //   createhospitalModalConfig.disableClose = true;
  //   (createhospitalModalConfig.maxWidth = '100vw'),
  //     (createhospitalModalConfig.maxHeight = '100vh'),
  //     (createhospitalModalConfig.width = '35%'),
  //     (createhospitalModalConfig.data = { data: sys, id });
  //   // (edithospitalModalConfig.data = {
  //   //   edit: editData,
  //   //   mode: 'EDIT',
  //   // }

  //   this.editBaseline
  //     .open(EditClinicBpComponent, createhospitalModalConfig)
  //     .afterClosed()
  //     .subscribe(() => {
  //       this.getObsById(this.dpid);
  //       // this.gethospitalList();
  //     });
  // }
  getObsById(pId) {
    if (this.leavingComponent) {
      return;
    }
    this.loadPatientData = true;
    const pageIndex = JSON.parse(localStorage.getItem('page-index'));
    this.docService.getObservationByPId(pId).subscribe(
      (data) => {
        this.loadPatientData = false;
        this.observationData = data;
        this.imagePath =
          localStorage.getItem('s3BaseUrl') + data?.patientProfile;

        // this.downloadProfileIcon(this.observationData);
        localStorage.setItem(
          'patientCreatedOn',
          this.observationData?.createdAt
        );
        this.fullName =
          this.titlecasePipe.transform(
            this.observationData?.patientDetails?.firstName
          ) +
          ' ' +
          this.titlecasePipe.transform(
            this.observationData?.patientDetails?.middleName
              ? this.observationData?.patientDetails?.middleName
              : ''
          ) +
          ' ' +
          this.titlecasePipe.transform(
            this.observationData?.patientDetails?.lastName
          );

        // this.downloadProfileIcon(this.observationData);
        this.docsharedService.dryWeight =
          this.observationData.patientDetails?.dryWeight;
        this.dryWeight = this.observationData.patientDetails?.dryWeight;
        this.baseLineBp =
          this.observationData.patientDetails?.systolicBloodPressure +
          '/' +
          this.observationData.patientDetails?.diastolicBloodPressure;
        // this.iconEnableDisable(this.observationData);
        const callDuration = JSON.parse(localStorage.getItem('durationCall'));
        if (localStorage.getItem('openedAudioCallDialog')) {
          const existingAudioCall = JSON.parse(
            localStorage.getItem('openedAudioCallDialog')
          );
        }
        if (localStorage.getItem('openedVideoCallDialog')) {
          const existingVideoCall = JSON.parse(
            localStorage.getItem('openedVideoCallDialog')
          );
        }
        this.scheduledId = localStorage.getItem('scheduledid');
        this.callEndType = localStorage.getItem('callEndType');
        // if (existingAudioCall) {
        //   if (
        //     this.timer !== null &&
        //     this.timer?.minutes === 0 &&
        //     this.timer?.seconds === 0
        //   ) {
        //     this.service.updateCallStatus(this.scheduledId).subscribe(() => {
        //       this.leaveRoom();
        //     });
        //   } else {
        //     // if duration recorded
        //     if (this.callEndType === 'IMMEDIATE_CALL') {
        //       this.service
        //         .updateImmediateCompleteStatus(
        //           this.scheduledId,
        //           callDuration.duration
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //         });
        //     } else if (this.callEndType === 'SCHEDULE_CALL') {
        //       this.service
        //         .updateScheduleCompleteStatus(
        //           this.scheduledId,
        //           callDuration.duration
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //         });
        //     }
        //   }
        //   this.startAudioCall();
        // }
        // if (existingVideoCall) {
        //   if (
        //     this.timer !== null &&
        //     this.timer?.minutes === 0 &&
        //     this.timer?.seconds === 0
        //   ) {
        //     this.service.updateCallStatus(this.scheduledId).subscribe(() => {
        //       this.leaveRoom();
        //     });
        //   } else {
        //     // if duration recorded
        //     if (this.callEndType === 'IMMEDIATE_CALL') {
        //       this.service
        //         .updateImmediateCompleteStatus(
        //           this.scheduledId,
        //           callDuration.duration
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //         });
        //     } else if (this.callEndType === 'SCHEDULE_CALL') {
        //       this.service
        //         .updateScheduleCompleteStatus(
        //           this.scheduledId,
        //           callDuration.duration
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //         });
        //     }
        //   }
        //   this.startVideoCall();
        // }
      },
      (err) => {
        this.loadPatientData = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }

  contentChange(data: string): void {
    if (data === 'wt') {
      this.pageNo = 1;
      this.showWt = true;
      this.showBp = false;
      this.showMedication = false;
      this.showDialysis = false;
      this.showAppointment = false;
      this.showClaims = false;
      this.showObservation = false;
      this.showWeightTimeGraph = false;
      this.showBPTrendGraph = false;
      this.showBPTimeGraph = false;
      this.showBPReadings = false;
    } else if (data === 'bp') {
      this.pageNo = 2;
      this.showWt = false;
      this.showBp = true;
      this.showMedication = false;
      this.showDialysis = false;
      this.showAppointment = false;
      this.showClaims = false;
      this.showObservation = false;
      this.graphReview = true;
      this.showBPTrendGraph = true;
      this.showBPTimeGraph = false;
      this.showBPReadings = false;
    } else if (data === 'medication') {
      this.pageNo = 3;
      this.showBp = false;
      this.showWt = false;
      this.showMedication = true;
      this.showDialysis = false;
      this.showAppointment = false;
      this.showObservation = false;
      this.showClaims = false;
      this.showWeightTimeGraph = false;
      // this.showBGTrendGraph = false;
      this.showBPTrendGraph = false;
      this.showBPTimeGraph = false;
      this.showBPReadings = false;
    } else if (data === 'vitals') {
      this.pageNo = 4;
      this.showBp = false;
      this.showWt = false;
      this.showMedication = false;
      this.showDialysis = true;
      this.showAppointment = false;
      this.showObservation = false;
      this.showClaims = false;
      this.showWeightTimeGraph = false;
      // this.showBGTrendGraph = false;
      this.showBPTrendGraph = false;
      this.showBPTimeGraph = false;
      this.showBPReadings = false;
      // if (this.graphReview) {
      //   this.dashboardsubscription.unsubscribe();
      // }
    } else if (data === 'appointment') {
      this.pageNo = 5;
      this.showBp = false;
      this.showWt = false;
      this.showMedication = false;
      this.showDialysis = false;
      this.showAppointment = true;
      this.showObservation = false;
      this.showClaims = false;
      this.showWeightTimeGraph = false;
      // this.showBGTrendGraph = false;
      this.showBPTrendGraph = false;
      this.showBPTimeGraph = false;
      this.showBPReadings = false;
      // if (this.graphReview) {
      //   this.dashboardsubscription.unsubscribe();
      // }
    } else if (data === 'observation') {
      this.pageNo = 7;
      this.showBp = false;
      this.showWt = false;
      this.showMedication = false;
      this.showDialysis = false;
      this.showAppointment = false;
      this.showClaims = false;
      this.showObservation = true;
      this.showWeightTimeGraph = false;
      this.showBGTrendGraph = false;
      this.showBPReadings = false;
    } else if (data === 'bpReadings') {
      this.pageNo = 8;
      this.showBp = false;
      this.showWt = false;
      this.showMedication = false;
      this.showDialysis = false;
      this.showAppointment = false;
      this.showClaims = false;
      this.showObservation = false;
      this.showWeightTimeGraph = false;
      this.showBGTrendGraph = false;
      this.showBPReadings = true;
    }
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
    for (let i = 0; i < symptoms?.length; i++) {
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
  // baselineBPWt(wt, bp) {
  //   let sys, dias;
  //   if (bp) {
  //     const splittedBP = bp.split('/');
  //     sys = splittedBP[0];
  //     dias = splittedBP[1];
  //   }
  //   let body = {};
  //   if (
  //     this.observationData.patient.dryWeight !== wt &&
  //     this.observationData.patient.systolicBloodPressure !== sys &&
  //     this.observationData.patient.diastolicBloodPressure !== dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: wt,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight !== wt &&
  //     this.observationData.patient.systolicBloodPressure === sys &&
  //     this.observationData.patient.diastolicBloodPressure === dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: null,
  //       diastolic: null,
  //       weight: wt,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight === wt &&
  //     this.observationData.patient.systolicBloodPressure !== sys &&
  //     this.observationData.patient.diastolicBloodPressure === dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: null,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight === wt &&
  //     this.observationData.patient.systolicBloodPressure === sys &&
  //     this.observationData.patient.diastolicBloodPressure !== dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: null,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight !== wt &&
  //     this.observationData.patient.systolicBloodPressure === sys &&
  //     this.observationData.patient.diastolicBloodPressure !== dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: wt,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight !== wt &&
  //     this.observationData.patient.systolicBloodPressure !== sys &&
  //     this.observationData.patient.diastolicBloodPressure === dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: wt,
  //     };
  //   } else if (
  //     this.observationData.patient.dryWeight === wt &&
  //     this.observationData.patient.systolicBloodPressure !== sys &&
  //     this.observationData.patient.diastolicBloodPressure !== dias
  //   ) {
  //     body = {
  //       patientId: this.dpid,
  //       systolic: sys,
  //       diastolic: dias,
  //       weight: null,
  //     };
  //   }
  //   this.docService.updateBaselineBPWt(body).subscribe(
  //     () => {
  //       this.snackbarService.success('Updated successfully');
  //       this.getObsById(this.dpid);
  //       // this.getBPTime(this.dpid);
  //     },
  //     (err) => {
  //       if (err.status === 401) {
  //         this.router.navigate(['/login']);
  //       } else {
  //         // this.snackbarService.error(err.error.message);
  //       }
  //     }
  //   );
  // }
  // getHealthDevicesById(pId) {
  //   this.docService.gethealthDeviceByPId(pId).subscribe(
  //     (data) => {
  //       this.healthData = data;
  //       this.healthData.content.forEach((e) => {
  //         if (e.category == 'bs') {
  //           this.bsDeviceCode = e.deviceCode;
  //           this.bsImeiNo = e.imeinumber;
  //         } else if (e.category == 'bp' || e.category == 'BP') {
  //           this.bpDeviceCode = e.deviceCode;
  //           this.bpImeiNo = e.imeinumber;
  //         } else if (e.category == 'wt') {
  //           this.wtDeviceCode = e.deviceCode;
  //           this.wtImeiNo = e.imeinumber;
  //         }
  //       });

  //       // this.getAvgResidualWeight(body);
  //       // this.getAverageWt(body);
  //       // this.getAverageBG(body);
  //     },
  //     (err) => {
  //       if (err.status === 401) {
  //         this.router.navigate(['/login']);
  //       } else {
  //         // this.snackbarService.error(err.error.message);
  //       }
  //     }
  //   );
  // }
  getAverageBP(value, id) {
    // this.docService.averageBP(value, id).subscribe(
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
    if (!this.healthData.content?.length) {
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
    if (this.healthData.content?.length) {
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

  openNav(drawer) {
    this.caregiversharedService.triggeredNoteCarePlan.next(true);
    this.overlayOn = true;
    this.showWtBPHist = false;
    this.showNotes = true;
    drawer.toggle();
    this.dpid = localStorage.getItem('patientId');
    this.getNotesList(localStorage.getItem('patientId'));
    // this.getDefaultNotes();
    if (this.profileShowDrawer) {
      this.pdrawer.toggle();
      this.profileShowDrawer = false;
    }
    this.caregiversharedService.changeDrawerToggled(true);
    this.caregiversharedService.changeOverlay(this.overlayOn);
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
      this.getAverageBP(body, this.dpid);
      // this.getAdherenceBP(this.dpid, this.meanfromDate, this.meantoDate);
      this.caregiversharedService.changeDates({
        from: this.meanfromDate.toISOString(),
        to: this.meantoDate.toISOString(),
      });
    }
  }

  drawerToggle(drawer) {
    if (this.showDrawer) {
      drawer.toggle();
      this.showDrawer = !this.showDrawer;
      this.caregiversharedService.changeDrawerToggled(true);
    }
  }
  profileDrawerToggle(profileDrawer) {
    if (!this.profileShowDrawer) {
      this.profileShowDrawer = true;
      profileDrawer.toggle();
    }
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
    this.loadNotes = true;
    this.caregiversharedService.loadNotes(this.loadNotes);
    this.noteList = [];
    this.docService.getListOfNotesByIdDoc(id).subscribe(
      (data) => {
        this.loadNotes = false;
        this.caregiversharedService.loadNotes(this.loadNotes);
        this.actualNotelist = data;
        const noteArr = [];
        this.noteList = [];
        const receivedNotelist = data;
        for (let i = 0; i < receivedNotelist?.length; i++) {
          if (receivedNotelist[i].eShared === 1) {
            const flag = receivedNotelist[i].flag;
            let receiverName = '';
            let ptNoteId = '';
            for (let j = i; j < receivedNotelist?.length; j++) {
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
              noteArr[noteArr?.length - 1].receiverName = receiverName;
            }
            noteArr[noteArr?.length - 1].ptNoteId = ptNoteId;
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
            this.loadNotes = false;
            this.caregiversharedService.loadNotes(this.loadNotes);
          }
        }
      },
      (err) => {
        // this.snackbarService.error(err.error.message);
      }
    );
    this.noteList = JSON.parse(localStorage.getItem('notes'));
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
    this.userId = this.user?.userDetails?.id;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];

    if (
      this.username == undefined ||
      this.username == null ||
      this.username == '' ||
      this.username == 'N/A'
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
          this.observationData?.patientDetails?.firstName +
          ' ' +
          this.observationData?.patientDetails?.lastName,
        senderName: this.username,
        senderId: this.scopeId,
        receiverId: this.observationData?.patientDetails?.id,
        callType: callType,
        scheduleDate: new Date().toUTCString(),
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
                identity: this.username,
                room: this.observationData?.patientDetails?.id,
                video: 'true',
                audio: 'true',
                uniqueKey: callType,
                callEndType: 'IMMEDIATE_CALL',
                // element: ele,
                patientName:
                  this.observationData?.patientDetails?.firstName +
                  ' ' +
                  this.observationData?.patientDetails?.lastName,
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
                      callDuration?.duration ? callDuration?.duration : '00:00'
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
                      callDuration?.duration ? callDuration?.duration : '00:00'
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
          // if (err.err === 400) {
          //   const message = `${err.message} Are you sure you want to end the call?`;
          //   const dialogData = new ConfirmDialogModel('Confirm', message);
          //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          //     maxWidth: '400px',
          //     data: dialogData,
          //     disableClose: true,
          //   });
          //   dialogRef.afterClosed().subscribe((dialogResult) => {
          //     if (dialogResult) {
          //       this.service.removeCallRecord(this.dpid).subscribe(() => {
          //         this.leaveRoom();
          //         location.reload();
          //         localStorage.removeItem('openedAudioCallDialog');
          //       });
          //     }
          //   });
          // }

          this.snackbarService.error(err.message);
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
    this.userId = this.user?.userDetails?.id;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
    if (
      this.username == undefined ||
      this.username == null ||
      this.username == '' ||
      this.username == 'N/A'
    ) {
    } else {
      // let immediatedate = this.caregiversharedService.formatDate(new Date());
      // let immediatetime = new Date().toTimeString();
      const callType = 'IMMEDIATE_VOICECALL';
      const body = {
        patientName:
          this.observationData?.patientDetails?.firstName +
          ' ' +
          this.observationData?.patientDetails?.lastName,
        senderName: this.username,
        senderId: this.scopeId,
        receiverId: this.observationData?.patientDetails?.id,
        callType: callType,
        scheduleDate: new Date().toUTCString(),
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
                identity: this.username,
                room: this.observationData?.patientDetails?.id,
                video: 'false',
                audio: 'true',
                callEndType: 'IMMEDIATE_CALL',
                patientName:
                  this.observationData?.patientDetails?.firstName +
                  ' ' +
                  this.observationData?.patientDetails?.lastName,
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
                      callDuration?.duration ? callDuration?.duration : '00:00'
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
                      callDuration?.duration ? callDuration?.duration : '00:00'
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
          // if (err.err === 400) {
          //   const message = `${err.message} Are you sure you want to end the call?`;
          //   const dialogData = new ConfirmDialogModel('Confirm', message);
          //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          //     maxWidth: '400px',
          //     data: dialogData,
          //     disableClose: true,
          //   });
          //   dialogRef.afterClosed().subscribe((dialogResult) => {
          //     if (dialogResult) {
          //       this.service.removeCallRecord(this.dpid).subscribe(() => {
          //         this.leaveRoom();
          //         location.reload();
          //         localStorage.removeItem('openedAudioCallDialog');
          //       });
          //     }
          //   });
          // }

          this.snackbarService.error(err.message);
        }
      );
    }
  }
  notesFilterByDate(id, evtVal): void {
    const fromdate = evtVal.from; // Or the date you'd like converted.
    // var isoFromDateTime = new Date(fromdate.setHours(0, 0, 0, 0)).toISOString();
    const todate = evtVal.to; // Or the date you'd like converted.
    if (fromdate && todate) {
      fromdate.setDate(new Date(fromdate.toISOString()).getDate() + 1);
      todate.setDate(new Date(todate.toISOString()).getDate() + 1);
    }
    // var isoToDateTime = new Date(todate.setHours(23, 59, 59, 59)).toISOString();

    const observationFromDateSplitted = fromdate.toISOString().split('T');
    const isoFromDateTime = observationFromDateSplitted[0];

    const observationToDateSplitted = todate.toISOString().split('T');
    const isoToDateTime = observationToDateSplitted[0];

    const body = {
      dateFrom: isoFromDateTime,
      dateTo: isoToDateTime,
    };
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
  getBaselineBP(data) {
    localStorage.setItem(
      'baselinesystolic',
      data.baselinesystolic ? data.baselinesystolic : '120'
    );
    localStorage.setItem(
      'baselinediastolic',
      data.baselinediastolic ? data.baselinediastolic : '80'
    );
    if (data) {
      return (
        (data.baselinesystolic ? data.baselinesystolic : '120') +
        '/' +
        (data.baselinediastolic ? data.baselinediastolic : '80')
      );
    } else {
      return '';
    }
  }
  getHeights(data) {
    if (data) {
      return data.height;
    } else {
      return '';
    }
  }
  getWhight(data) {
    if (data) {
      return data.weight;
    } else {
      return '';
    }
  }
  getByTabChange(event: MatTabChangeEvent) {
    if (event.tab.textLabel === '1') {
      // this.showBGTrendGraph = false;
      // this.showWeightTimeGraph = false;
      this.showBPTrendGraph = true;
      this.showBPTimeGraph = false;
    } else if (event.tab.textLabel === '2') {
      // this.showBGTrendGraph = false;
      // this.showWeightTimeGraph = false;
      this.showBPTrendGraph = false;
      this.showBPTimeGraph = true;
    }
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
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
    // this.timerSubscription.unsubscribe();
    this.contentChangeSubscription.unsubscribe();
  }
  isNumber(n: any): boolean {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  closeNotesDrawer(): void {
    this.showNotes = false;
    this.caregiversharedService.changeOverlay(false);
  }
  goForwardPatient() {
    localStorage.setItem('selectedMedication', 'false');

    this.dpid = localStorage.getItem('patientId');
    if (this.zoneType == 'HighAlert') {
      // this.rightIcondisable = true;

      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.highAlert?.length) {
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service
            .getPatientList(this.counter, 10, 'createdAt,desc')
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content']?.length) {
                  this.rightIcondisable = true;
                } else {
                  this.highAlert = this.highAlert.concat(res['content']);
                }
              }, 1000);
            });
        }, 1000);
      } else if (this.particularPatientIndex === this.highAlert?.length) {
        // this.rightIcondisable = true;
        this.counter = this.counter + 1;
        setTimeout(() => {
          this.service
            .getPatientsByZone(1, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content']?.length) {
                  this.rightIcondisable = true;
                } else {
                  this.highAlert = this.highAlert.concat(res['content']);
                  if (this.particularPatientIndex < this.highAlert?.length) {
                    this.highAlert[this.particularPatientIndex];
                    this.commonCode(
                      this.highAlert[this.particularPatientIndex].scopeId
                    );
                  }
                }
              }, 1000);
            });
        }, 1000);
      }
      if (this.particularPatientIndex < this.highAlert?.length) {
        this.highAlert[this.particularPatientIndex];
        if (
          this.highAlert[this.particularPatientIndex].scopeId ===
          this.highAlert[this.highAlert?.length - 1].scopeId
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.highAlert[this.particularPatientIndex].scopeId);
      }
    } else if (this.zoneType == 'Alert') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.alert.length) {
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.rightIcondisable = true;
                } else {
                  this.alert = this.alert.concat(res['content']);
                }
              }, 1000);
            });
        }, 1000);
      } else if (this.particularPatientIndex === this.alert.length) {
        // this.rightIcondisable = true;
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.rightIcondisable = true;
                } else {
                  this.alert = this.alert.concat(res['content']);
                  if (this.particularPatientIndex < this.alert.length) {
                    this.alert[this.particularPatientIndex];
                    this.commonCode(
                      this.alert[this.particularPatientIndex].scopeId
                    );
                  }
                }
              }, 1000);
            });
        }, 1000);
      }
      if (this.particularPatientIndex < this.alert.length) {
        this.alert[this.particularPatientIndex];
        if (
          this.alert[this.particularPatientIndex].scopeId ===
          this.alert[this.alert.length - 1].scopeId
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.alert[this.particularPatientIndex].scopeId);
      }
    } else if (this.zoneType == 'Good') {
      // this.rightIcondisable = true;

      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.good.length) {
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service
            .getPatientsByZone(3, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.rightIcondisable = true;
                } else {
                  this.good = this.good.concat(res['content']);
                }
              }, 1000);
            });
        }, 1000);
      } else if (this.particularPatientIndex === this.good.length) {
        // this.rightIcondisable = true;
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service
            .getPatientsByZone(2, this.counter, 10)
            .subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.rightIcondisable = true;
                } else {
                  this.good = this.good.concat(res['content']);
                  if (this.particularPatientIndex < this.good.length) {
                    this.good[this.particularPatientIndex];
                    this.commonCode(
                      this.good[this.particularPatientIndex].scopeId
                    );
                  }
                }
              }, 1000);
            });
        }, 1000);
      }
      if (this.particularPatientIndex < this.good.length) {
        this.good[this.particularPatientIndex];
        if (
          this.good[this.particularPatientIndex].scopeId ===
          this.good[this.good.length - 1].scopeId
        ) {
          this.rightIcondisable = true;
        }
        this.commonCode(this.good[this.particularPatientIndex].scopeId);
      }
    } else if (this.zoneType == 'NonAdherence') {
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      if (this.particularPatientIndex + 1 === this.nonAdherence.length) {
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service.getNonadherence(this.counter, 10).subscribe((res) => {
            setTimeout(() => {
              if (!res['content'].length) {
                this.rightIcondisable = true;
              } else {
                this.nonAdherence = this.nonAdherence.concat(res['content']);
              }
            }, 1000);
          });
        }, 1000);
        // this.rightIcondisable = true;
      } else if (this.particularPatientIndex === this.nonAdherence.length) {
        setTimeout(() => {
          this.counter = this.counter + 1;
          this.service.getNonadherence(this.counter, 10).subscribe((res) => {
            setTimeout(() => {
              if (!res['content'].length) {
                this.rightIcondisable = true;
              } else {
                this.nonAdherence = this.nonAdherence.concat(res['content']);

                if (this.particularPatientIndex < this.nonAdherence.length) {
                  this.nonAdherence[this.particularPatientIndex];
                  this.commonCode(
                    this.nonAdherence[this.particularPatientIndex].scopeId
                  );
                }
              }
            }, 1000);
          });
        }, 1000);
      }
      if (this.particularPatientIndex < this.nonAdherence.length) {
        this.nonAdherence[this.particularPatientIndex];

        this.commonCode(this.nonAdherence[this.particularPatientIndex].scopeId);
      }
    } else if (this.zoneType == 'totalPatients') {
      // this.rightIcondisable = true;
      this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
      // if (this.counter > 0 && this.isFirstIncrement) {
      //   const pageSize = 10;
      //   this.particularPatientIndex = this.particularPatientIndex + pageSize;

      //   this.isFirstIncrement = false;
      // }

      if (this.particularPatientIndex + 1 === this.totalPats.length) {
        setTimeout(() => {
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
              }, 1000);
            });
        }, 1000);
        // this.rightIcondisable = true;
      } else if (this.particularPatientIndex === this.totalPats.length) {
        setTimeout(() => {
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
              }, 1000);
            });
        }, 1000);
      }
      if (this.particularPatientIndex < this.totalPats.length) {
        this.totalPats[this.particularPatientIndex];
        this.commonCode(this.totalPats[this.particularPatientIndex].id);
      }
    }
  }
  // async goForwardPatient() {
  //   localStorage.setItem('selectedMedication', 'false');

  //   this.dpid = localStorage.getItem('patientId');
  //   this.rightIcondisable = true; // Disable the button while loading
  //   console.log(this.zoneType);

  //   try {
  //     if (this.zoneType === 'HighAlert') {
  //       console.log(this.zoneType);
  //       this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
  //       if (this.particularPatientIndex + 1 === this.highAlert.length) {
  //         this.counter = this.counter + 1;
  //         this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .subscribe((res) => {
  //             setTimeout(() => {
  //               if (!res['content'].length) {
  //                 this.rightIcondisable = true;
  //               } else {
  //                 this.highAlert = this.highAlert.concat(res['content']);
  //               }
  //             }, 1000);
  //           });
  //         // this.rightIcondisable = true;
  //       } else if (this.particularPatientIndex === this.highAlert?.length) {
  //         this.counter++;
  //         const res = await this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .toPromise();
  //         if (res['content']?.length) {
  //           this.highAlert = this.highAlert.concat(res['content']);
  //         } else {
  //           this.rightIcondisable = true;
  //         }
  //       }
  //     } else if (this.zoneType === 'Alert') {
  //       // Similar logic for other zones
  //       this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
  //       if (this.particularPatientIndex + 1 === this.alert.length) {
  //         this.counter = this.counter + 1;
  //         this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .subscribe((res) => {
  //             setTimeout(() => {
  //               if (!res['content'].length) {
  //                 this.rightIcondisable = true;
  //               } else {
  //                 this.alert = this.alert.concat(res['content']);
  //               }
  //             }, 1000);
  //           });
  //         // this.rightIcondisable = true;
  //       } else if (this.particularPatientIndex === this.alert?.length) {
  //         this.counter++;
  //         const res = await this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .toPromise();
  //         if (res['content']?.length) {
  //           this.alert = this.alert.concat(res['content']);
  //         } else {
  //           this.rightIcondisable = true;
  //         }
  //       }
  //     } else if (this.zoneType === 'Good') {
  //       // Similar logic for other zones
  //       this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
  //       if (this.particularPatientIndex + 1 === this.good.length) {
  //         this.counter = this.counter + 1;
  //         this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .subscribe((res) => {
  //             setTimeout(() => {
  //               if (!res['content'].length) {
  //                 this.rightIcondisable = true;
  //               } else {
  //                 this.good = this.good.concat(res['content']);
  //               }
  //             }, 1000);
  //           });
  //         // this.rightIcondisable = true;
  //       } else if (this.particularPatientIndex === this.good?.length) {
  //         this.counter++;
  //         const res = await this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .toPromise();
  //         if (res['content']?.length) {
  //           this.good = this.good.concat(res['content']);
  //         } else {
  //           this.rightIcondisable = true;
  //         }
  //       }
  //     } else if (this.zoneType === 'NonAdherence') {
  //       // Similar logic for other zones
  //       this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
  //       if (this.particularPatientIndex + 1 === this.nonAdherence.length) {
  //         this.counter = this.counter + 1;
  //         this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .subscribe((res) => {
  //             setTimeout(() => {
  //               if (!res['content'].length) {
  //                 this.rightIcondisable = true;
  //               } else {
  //                 this.nonAdherence = this.nonAdherence.concat(res['content']);
  //               }
  //             }, 1000);
  //           });
  //         // this.rightIcondisable = true;
  //       } else if (this.particularPatientIndex === this.nonAdherence?.length) {
  //         this.counter++;
  //         const res = await this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .toPromise();
  //         if (res['content']?.length) {
  //           this.nonAdherence = this.nonAdherence.concat(res['content']);
  //         } else {
  //           this.rightIcondisable = true;
  //         }
  //       }
  //     } else if (this.zoneType === 'totalPatients') {
  //       // Similar logic for other zones
  //       // this.particularPatientIndex++;
  //       this.particularPatientIndex = Number(this.particularPatientIndex) + 1;
  //       if (this.particularPatientIndex + 1 === this.totalPats.length) {
  //         this.counter = this.counter + 1;
  //         this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .subscribe((res) => {
  //             console.log(res);
  //             setTimeout(() => {
  //               if (!res['content'].length) {
  //                 this.rightIcondisable = true;
  //               } else {
  //                 this.totalPats = this.totalPats.concat(res['content']);
  //               }
  //             }, 1000);
  //           });
  //         // this.rightIcondisable = true;
  //       } else if (this.particularPatientIndex === this.totalPats?.length) {
  //         this.counter++;
  //         const res = await this.service
  //           .getPatientList(this.counter, 10, 'createdAt,desc')
  //           .toPromise();
  //         if (res['content']?.length) {
  //           this.totalPats = this.totalPats.concat(res['content']);
  //         } else {
  //           this.rightIcondisable = true;
  //         }
  //       }
  //     }

  //     if (this.particularPatientIndex < this.totalPats?.length) {
  //       this.totalPats[this.particularPatientIndex];
  //       this.commonCode(this.totalPats[this.particularPatientIndex].id);
  //     }
  //     if (this.particularPatientIndex < this.nonAdherence?.length) {
  //       this.nonAdherence[this.particularPatientIndex];
  //       this.commonCode(this.nonAdherence[this.particularPatientIndex].scopeId);
  //     }
  //     if (this.particularPatientIndex < this.highAlert?.length) {
  //       this.highAlert[this.particularPatientIndex];
  //       this.commonCode(this.highAlert[this.particularPatientIndex].scopeId);
  //     }
  //     if (this.particularPatientIndex < this.good?.length) {
  //       this.good[this.particularPatientIndex];
  //       this.commonCode(this.good[this.particularPatientIndex].scopeId);
  //     }
  //     if (this.particularPatientIndex < this.alert?.length) {
  //       this.alert[this.particularPatientIndex];
  //       this.commonCode(this.alert[this.particularPatientIndex].scopeId);
  //     }

  //     // Re-enable the button
  //     this.rightIcondisable = false;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Handle any errors here
  //     this.rightIcondisable = false; // Make sure to re-enable the button even in case of an error
  //   }
  // }

  goBackwardPatient() {
    localStorage.setItem('selectedMedication', 'false');

    this.dpid = localStorage.getItem('patientId');
    if (this.zoneType == 'HighAlert') {
      setTimeout(() => {
        this.rightIcondisable = false;
        this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

        if (this.particularPatientIndex >= 0) {
          if (this.particularPatientIndex === 0 && this.counter > 0) {
            this.leftIconDisable = true;
            this.counter = this.counter - 1;
            this.service
              .getPatientsByZone(1, this.counter, 10)
              .subscribe((res) => {
                setTimeout(() => {
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    if (this.counter !== 0) {
                      this.highAlert = this.highAlert.concat(
                        res['content'].reverse()
                      );
                      this.highAlert.reverse();
                    }
                    // else {
                    //   this.leftIconDisable = true;
                    // }
                    // this.particularPatientIndex =
                    //   this.particularPatientIndex + res['content'].length;
                    this.particularPatientIndex =
                      this.particularPatientIndex.toString();
                  }
                }, 1000);
              });
          }
          if (this.particularPatientIndex < this.highAlert.length) {
            this.leftIconDisable = true;
            this.highAlert[this.particularPatientIndex];

            if (
              this.highAlert[this.particularPatientIndex].scopeId ===
              this.highAlert[0].scopeId
            ) {
              this.rightIcondisable = false;
            } else {
              this.rightIcondisable = true;
            }
            this.commonCode(
              this.highAlert[this.particularPatientIndex].scopeId
            );
            setTimeout(() => {
              if (this.particularPatientIndex === 0) {
                this.leftIconDisable = true;
              }
            }, 1000);
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
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    this.highAlert = this.highAlert.concat(
                      res['content'].reverse()
                    );
                    this.highAlert.reverse();
                    this.particularPatientIndex =
                      this.particularPatientIndex + res['content'].length;
                    if (this.particularPatientIndex < this.highAlert.length) {
                      this.highAlert[this.particularPatientIndex];
                      this.commonCode(
                        this.highAlert[this.particularPatientIndex].scopeId
                      );
                    }
                  }
                }, 1000);
              });
          }
        }
      }, 1000);
    } else if (this.zoneType == 'Alert') {
      setTimeout(() => {
        this.rightIcondisable = false;
        this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

        if (this.particularPatientIndex >= 0) {
          if (this.particularPatientIndex === 0 && this.counter > 0) {
            this.leftIconDisable = true;
            this.counter = this.counter - 1;
            this.service
              .getPatientsByZone(2, this.counter, 10)
              .subscribe((res) => {
                setTimeout(() => {
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    if (this.counter !== 0) {
                      this.alert = this.alert.concat(res['content'].reverse());
                      this.alert.reverse();
                    }
                    //  else {
                    //   this.leftIconDisable = true;
                    // }
                    // this.particularPatientIndex =
                    //   this.particularPatientIndex + res['content'].length;
                    this.particularPatientIndex =
                      this.particularPatientIndex.toString();
                  }
                }, 1000);
              });
          }
          if (this.particularPatientIndex < this.alert.length) {
            this.leftIconDisable = true;
            this.alert[this.particularPatientIndex];

            if (
              this.alert[this.particularPatientIndex].scopeId ===
              this.alert[0].scopeId
            ) {
              this.rightIcondisable = false;
            } else {
              this.rightIcondisable = true;
            }
            this.commonCode(this.alert[this.particularPatientIndex].scopeId);
            setTimeout(() => {
              if (this.particularPatientIndex === 0) {
                this.leftIconDisable = true;
              }
            }, 1000);
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
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    this.alert = this.alert.concat(res['content'].reverse());
                    this.alert.reverse();
                    this.particularPatientIndex =
                      this.particularPatientIndex + res['content'].length;
                    if (this.particularPatientIndex < this.alert.length) {
                      this.alert[this.particularPatientIndex];
                      this.commonCode(
                        this.alert[this.particularPatientIndex].scopeId
                      );
                    }
                  }
                }, 1000);
              });
          }
        }
      }, 1000);
    } else if (this.zoneType == 'Good') {
      setTimeout(() => {
        this.rightIcondisable = false;
        this.particularPatientIndex = Number(this.particularPatientIndex) - 1;

        if (this.particularPatientIndex >= 0) {
          if (this.particularPatientIndex === 0 && this.counter > 0) {
            this.leftIconDisable = true;
            this.counter = this.counter - 1;
            this.service
              .getPatientsByZone(3, this.counter, 10)
              .subscribe((res) => {
                setTimeout(() => {
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    if (this.counter !== 0) {
                      this.good = this.good.concat(res['content'].reverse());
                      this.good.reverse();
                    }
                    // else {
                    //   this.leftIconDisable = true;
                    // }
                    // this.particularPatientIndex =
                    //   this.particularPatientIndex + res['content'].length;
                    this.particularPatientIndex =
                      this.particularPatientIndex.toString();
                  }
                }, 1000);
              });
          }
          if (this.particularPatientIndex < this.good.length) {
            this.leftIconDisable = true;
            this.good[this.particularPatientIndex];

            if (
              this.good[this.particularPatientIndex].scopeId ===
              this.good[0].scopeId
            ) {
              this.rightIcondisable = false;
            } else {
              this.rightIcondisable = true;
            }
            this.commonCode(this.good[this.particularPatientIndex].scopeId);
            setTimeout(() => {
              if (this.particularPatientIndex === 0) {
                this.leftIconDisable = true;
              }
            }, 1000);
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
                  if (!res['content'].length) {
                    this.leftIconDisable = true;
                  } else {
                    this.good = this.good.concat(res['content'].reverse());
                    this.good.reverse();
                    this.particularPatientIndex =
                      this.particularPatientIndex + res['content'].length;
                    if (this.particularPatientIndex < this.good.length) {
                      this.good[this.particularPatientIndex];
                      this.commonCode(
                        this.good[this.particularPatientIndex].scopeId
                      );
                    }
                  }
                }, 1000);
              });
          }
        }
      }, 1000);
    } else if (this.zoneType == 'NonAdherence') {
      setTimeout(() => {
        this.rightIcondisable = false;
        this.particularPatientIndex = Number(this.particularPatientIndex) - 1;
        if (this.particularPatientIndex >= 0) {
          if (this.particularPatientIndex === 0 && this.counter > 0) {
            this.leftIconDisable = true;
            this.counter = this.counter - 1;

            this.service.getNonadherence(this.counter, 10).subscribe((res) => {
              setTimeout(() => {
                if (!res['content'].length) {
                  this.leftIconDisable = true;
                } else {
                  if (this.counter !== 0) {
                    this.nonAdherence = this.nonAdherence.concat(
                      res['content'].reverse()
                    );
                    this.nonAdherence.reverse();
                  } else {
                    this.leftIconDisable = true;
                  }

                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['content'].length;
                  this.particularPatientIndex =
                    this.particularPatientIndex.toString();
                }
              }, 1000);
            });
          }
          if (this.particularPatientIndex < this.nonAdherence.length) {
            this.leftIconDisable = true;
            this.nonAdherence[this.particularPatientIndex];
            if (
              this.nonAdherence[this.particularPatientIndex].scopeId ===
              this.nonAdherence[0].scopeId
            ) {
              this.rightIcondisable = false;
            }
            // else {
            //   this.rightIcondisable = true;
            // }
            this.commonCode(
              this.nonAdherence[this.particularPatientIndex].scopeId
            );
            setTimeout(() => {
              if (this.particularPatientIndex === 0) {
                this.leftIconDisable = true;
              }
            }, 1000);
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
                if (!res['content'].length) {
                  this.leftIconDisable = true;
                } else {
                  this.nonAdherence = this.nonAdherence.concat(
                    res['content'].reverse()
                  );
                  this.nonAdherence.reverse();
                  this.particularPatientIndex =
                    this.particularPatientIndex + res['content'].length;
                  if (this.particularPatientIndex < this.nonAdherence.length) {
                    this.nonAdherence[this.particularPatientIndex];
                    this.commonCode(
                      this.nonAdherence[this.particularPatientIndex].scopeId
                    );
                  }
                }
              }, 1000);
            });
          }
        }
      }, 1000);
    } else if (this.zoneType == 'totalPatients') {
      setTimeout(() => {
        this.rightIcondisable = false;
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
                  } else if (res['content'].length) {
                    this.totalPats = this.totalPats.concat(
                      res['content'].reverse()
                    );
                    this.totalPats.reverse();
                    this.particularPatientIndex = res['numberOfElements'];
                  } else {
                    this.leftIconDisable = true;
                  }
                  // this.particularPatientIndex =
                  //   this.particularPatientIndex + res['content'].length;
                }, 1000);
              });
          }
          if (this.particularPatientIndex < this.totalPats.length) {
            this.leftIconDisable = true;
            this.totalPats[this.particularPatientIndex];

            if (
              this.totalPats[this.particularPatientIndex].id ===
              this.totalPats[0].id
            ) {
              this.rightIcondisable = false;
            }
            this.commonCode(this.totalPats[this.particularPatientIndex].id);
            setTimeout(() => {
              if (this.particularPatientIndex === 0) {
                this.leftIconDisable = true;
              }
            }, 1000);
            // if (this.particularPatientIndex === 0) {
            //   this.particularPatientIndex = '0';
            // }
          } else if (this.particularPatientIndex === 0) {
            this.leftIconDisable = true;
          }
        }
      }, 1000);
    }
  }
  commonCode(newIndex) {
    localStorage.setItem('patientId', newIndex);
    this.caregiversharedService.changeGraphs({ id: newIndex });
    this.caregiversharedService.changePatientCardData({ id: newIndex });
    // console.log(
    //   this.caregiversharedService.changePatientCardData({ id: newIndex })
    // );

    // this.getObsById(newIndex);
    // console.log(this.getObsById(newIndex));
    this.getLatestReadings(newIndex);
    // console.log(this.getLatestReadings(newIndex));

    // this.caregiversharedService.changePatientSideNavData({ id: newIndex });
    this.caregiversharedService.changeMaps({ id: newIndex });
    this.caregiversharedService.changeDates({
      id: newIndex,
      from: this.meanfromDate,
      to: this.meantoDate,
    });
    // this.caregiversharedService.changeAppointment({ id: newIndex });
    // this.caregiversharedService.changeObservationHist({ id: newIndex });
    this.caregiversharedService.changeVitalsHist({ id: newIndex });
    // this.caregiversharedService.changeClaims({ id: newIndex });
    this.caregiversharedService.changeMedications({ id: newIndex });
    setTimeout(() => {
      // this.rightIcondisable = false;
      this.leftIconDisable = false;
    }, 1000);
  }

  openMedication() {
    localStorage.setItem('selectedMedication', 'true');
    this.caregiversharedService.changeVitalsHist(true);
  }
  getDiagnosticDetails(pId) {
    if (this.leavingComponent) {
      return;
    }
    this.patientMgmtService.getDiagnosis(pId).subscribe((res) => {
      this.diagnosisDetails = res[0];
      localStorage.setItem(
        'patientUnderMedication',
        this.diagnosisDetails?.patientundermedication
      );
    });
  }
  getExperiencePoints(id, body) {
    if (this.leavingComponent) {
      return;
    }
    this.patientMgmtService.getXpPoints(id, body).subscribe((res) => {
      this.xpPoints = res;
    });
  }
  getDiagnosis(name) {
    return name?.diagnosisName ? name?.diagnosisName : '-';
  }
  iconEnableDisable(obsData) {
    if (this.zoneType === 'HighAlert') {
      this.highAlert && this.highAlert.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.highAlert.length && this.highAlert[0]?.id === obsData.scopeId
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'Alert') {
      this.alert && this.alert.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.alert.length && this.alert[0]?.id === obsData.scopeId
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'Good') {
      this.good && this.good.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.good.length && this.good[0]?.id === obsData.scopeId
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'NonAdherence') {
      this.nonAdherence && this.nonAdherence.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.nonAdherence?.length &&
      this.nonAdherence[0]?.scopeId === obsData.scopeId
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    } else if (this.zoneType === 'totalPatients') {
      this.totalPats && this.totalPats.length > 1
        ? (this.rightIcondisable = false)
        : (this.rightIcondisable = true);
      this.totalPats.length && this.totalPats[0]?.id === obsData.scopeId
        ? (this.leftIconDisable = true)
        : (this.leftIconDisable = false);
    }
  }

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
}
