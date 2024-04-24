import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CaregiverDashboardService } from '../caregiver-dashboard.service';
import { CaregiverSharedService } from '../caregiver-shared.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CareproviderMessageDialogComponent } from '../careprovider-message-dialog/careprovider-message-dialog.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CallSchedulerComponent } from 'src/app/CommonComponents/call-scheduler/call-scheduler.component';
import { VideoCallComponent } from 'src/app/twilio/video-call/video-call.component';
import { AudioCallComponent } from 'src/app/twilio/audio-call/audio-call.component';
import { VideoStateService } from 'src/app/twilio/services/video-state.service';
// import { E, T } from '@angular/cdk/keycodes';
import { FileService } from 'src/app/core/services/file.service';
import { CaregiverPatientDataSource } from './patient-list-dataSource';
import { MatSort } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav';
import { ParticipantsComponent } from 'src/app/twilio/participants/participants.component';
import { Room } from 'twilio-video';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/CommonComponents/confirm-dialog/confirm-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';

@Component({
  selector: 'app-careprovider-patient-list',
  templateUrl: './careprovider-patient-list.component.html',
  styleUrls: ['./careprovider-patient-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CareproviderPatientListComponent implements OnInit, AfterViewInit {
  public dataSource: CaregiverPatientDataSource;
  loadNotes = false;
  userRole: string;
  roleid: string;
  actualNotelist: any = [];
  defaultNoteList: any = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  notesFromDate: Date;
  notesToDate: Date;
  noteList: any = [];
  position: TooltipPosition = 'above';
  highAlertMatTab = false;
  alertMatTab = false;
  goodMatTab = false;
  nonAdherenceMatTab = false;
  disabled = false;
  showDelay = 0;
  hideDelay = 0;
  showExtraClass = true;
  highAlertZone: any = [];
  alertZone: any = [];
  goodZone: any = [];
  nonAdherenceZone: any = [];
  authToken = '';
  count: any;
  loadRes = false;
  displayedColumns: string[] = [
    'patient',
    'recentWeight',
    'recentBp',
    'symptoms',
    'status',
    'actions',
  ];
  displayedGoodColumns: string[] = [
    'patient',
    'recentWeight',
    'recentBp',
    'status',
    'actions',
  ];
  highAlertDataSource: any;
  alertDataSource: any;
  goodDataSource: any;
  nonAdherenceDataSource: any;
  hsize = 3;
  hpageIndex = 0;
  hp = 1;
  asize = 3;
  apageIndex = 0;
  ap = 1;
  gsize = 3;
  gpageIndex = 0;
  gp = 1;
  nonsize = 3;
  nonP = 1;

  roleId: any;
  showNotes = true;
  showDialysis = false;
  addButton = true;
  useTemplateButton = false;
  addTemplateButton = false;
  triggedAddNote = false;
  triggeredTemplate = false;
  triggeredaddTemplate = false;
  @ViewChild('participants') participants: ParticipantsComponent;
  public activeRoom: Room;
  @ViewChild('timer') timer: TimerComponent;
  cpid: any;
  cpName: any;
  details: any = [];
  userName: string;
  branch: string;
  userId: string;
  scheduleCallId: string;
  patientTabCounts: any;
  imgSrc1 = 'assets/svg/DashboardIcons/Total Patients.svg';
  imgSrc2 = 'assets/svg/DashboardIcons/Scheduler White.svg';

  tabImg1 = 'assets/svg/DashboardIcons/High Alert White.svg';
  tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
  tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
  tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';

  imgSrcNote = 'assets/svg/DashboardIcons/Action Notes Blue.svg';
  imgSrcReport = 'assets/svg/DashboardIcons/Reports.svg';
  imgSrcMsg = 'assets/svg/DashboardIcons/Action Messages Blue.svg';
  imgSrcAudioCall = 'assets/svg/DashboardIcons/Action Phone Blue.svg';
  imgSrcVideo = 'assets/svg/DashboardIcons/Action Video Call Blue.svg';
  imgSrcDialysis = 'assets/svg/DashboardIcons/Action Scheduler Blue.svg';
  imgSrcDialysisRed = 'assets/svg/DashboardIcons/Action Scheduler Red.svg';
  imgSrcSyncBtn = 'assets/svg/DashboardIcons/RefreshBlue.svg';
  public overlayOn = false;
  messageSuccess: boolean;
  highAlertTab = false;
  alertTab = false;
  goodTab = false;
  nonAdherenceTab = false;
  showHighAlertFloating = false;
  public zoneWithPatients: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  @ViewChild(MatSort) sort!: MatSort;
  @Output()
  osType: string;
  scheduledId: string;
  callEndType: string;
  user: any;
  public currentTabIndex: number;
  scopeId: any;
  loadCard: boolean = false;
  constructor(
    public service: CaregiverDashboardService,
    private snackBarService: SnackbarService,
    private router: Router,
    public caregiverSharedService: CaregiverSharedService,
    public dialog: MatDialog,
    private auth: AuthService,
    public datepipe: DatePipe,
    public videoState: VideoStateService,
    public fileService: FileService,
    private docService: DoctorDashboardService,
    private cdr: ChangeDetectorRef,
    private filterService: FilterSharedService
  ) {
    this.user = this.auth.authData;
    if (this.user?.userDetails) {
      this.roleid = this.user?.userDetails?.id;

      this.scopeId = this.user?.userDetails.scopeId;

      this.userRole = this.user?.userDetails?.userRole;
    }
    this.roleId = this.user?.jwtToken;
    this.userId = this.user?.userDetails?.id;
    this.userName =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
    this.dataSource = new CaregiverPatientDataSource(
      this.service,
      this.snackBarService
    );
  }
  ngAfterViewInit(): void {
    this.caregiverSharedService.triggeredPatientTabCount.subscribe((res) => {
      if (res) {
        this.tabCounts();
      }
    });
  }

  ngOnInit(): void {
    this.caregiverSharedService.triggeredHeaderTitle.next('Dashboard');

    if (this.userRole !== 'CARECOORDINATOR') {
      setTimeout(() => {
        this.loadCard = true;
        this.getDoctorDetails();
      }, 1000);
    }
    this.videoState.setActiveTabIndex(0);
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.tabCounts();
    this.osType = window.navigator.platform;
    this.caregiverSharedService.caregiverHighAlert.subscribe((data) => {
      if (data) {
        this.showHighAlertFloating = true;
      }
    });

    this.caregiverSharedService.triggeredhighAlertPatientNotification.subscribe(
      (data) => {
        if (data) {
          localStorage.setItem('redZone', 'true');
          // this.videoState.setActiveTabIndex(0);
          this.tabCounts();
          this.highAlertMatTab = false;
        } else {
          localStorage.removeItem('redZone');
        }
      }
    );
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
    const callDuration = JSON.parse(localStorage.getItem('durationCall'));
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
    //         .updateImmediateCompleteStatus(this.scheduledId, callDuration)
    //         .subscribe(() => {
    //           this.leaveRoom();
    //         });
    //     } else if (this.callEndType === 'SCHEDULE_CALL') {
    //       this.service
    //         .updateScheduleCompleteStatus(this.scheduledId, callDuration)
    //         .subscribe(() => {
    //           this.leaveRoom();
    //         });
    //     }
    //   }
    //   this.startAudioCall(existingAudioCall);
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
    //         .updateImmediateCompleteStatus(this.scheduledId, callDuration)
    //         .subscribe(() => {
    //           this.leaveRoom();
    //         });
    //     } else if (this.callEndType === 'SCHEDULE_CALL') {
    //       this.service
    //         .updateScheduleCompleteStatus(this.scheduledId, callDuration)
    //         .subscribe(() => {
    //           this.leaveRoom();
    //         });
    //     }
    //   }
    //   this.startVideoCall(existingVideoCall);
    // }
    // this.caregiverSharedService.notesdrawerToggled.subscribe((data) => {
    //   if (data) {
    //     this.overlayOn = false;
    //     this.drawer.toggle();
    //   }
    // });
    // alert(this.currentTabIndex);
  }
  getDoctorDetails(): void {
    this.service.getUserDetails().subscribe(
      (data) => {
        // this.details = data;
        // this.doctorId = this.details.id;
        // this.doctorName = this.details.name;
        localStorage.setItem('careproviderDetails', JSON.stringify(data));
        localStorage.setItem('medicationPermission', data?.medication);
        localStorage.setItem('notesPermission', data?.notes);
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
  syncOver(): void {
    this.imgSrcSyncBtn = 'assets/svg/DashboardIcons/RefreshWhite.svg';
  }
  syncOut(): void {
    this.imgSrcSyncBtn = 'assets/svg/DashboardIcons/RefreshBlue.svg';
  }
  getHighAlertInfo() {
    localStorage.setItem('redZone', 'true');
    this.showHighAlertFloating = false;
    this.videoState.setActiveTabIndex(0);
    this.tabCounts();
    window.location.reload();
  }
  syncData(): void {
    localStorage.removeItem('highAlertZonePatients');
    localStorage.removeItem('alertZonePatients');
    localStorage.removeItem('goodZonePatients');
    localStorage.removeItem('nonAdherencePatients');
    sessionStorage.removeItem('1-patient-list');
    sessionStorage.removeItem('2-patient-list');
    sessionStorage.removeItem('3-patient-list');
    sessionStorage.removeItem('non-adherence-patient-list');
    window.location.reload();
    this.dataSource.loadPatients(1, 0);
    this.dataSource.loadPatients(2, 0);
    this.dataSource.loadPatients(3, 0);

    this.dataSource.loadNonAdherencePatients(1, 10);
  }
  home() {
    this.router.navigate(['/caregiverDashboard/patientReadings']);
  }
  nextDialysis(ele) {
    return 'Next appointment scheduled for' + ' ' + ele;
  }
  showDialysisText(ele) {
    if (
      new Date(ele.appmtResponse?.appointmentRequestDate) <
      new Date(ele.patientResponse?.nextDialysisDate)
    ) {
      if (
        ele.appmtResponse?.status == '0' &&
        new Date(ele.appmtResponse?.appointmentRequestDate) < new Date()
      ) {
        return true;
      } else if (
        new Date(ele.appmtResponse?.appointmentRequestDate) > new Date()
      ) {
        return true;
      }
      // if (ele.appmtResponse?.status && (new Date(ele.patientResponse?.lastDialysisDate) > new Date()))
      //   return true;
      else {
        return false;
      }
    } else {
      return false;
    }
  }
  tabCounts() {
    const tabs = ['highAlert', 'alert', 'good', 'noOfNonAderancePatient'];

    this.service.getTabCounts().subscribe((data) => {
      localStorage.setItem('tabCount', JSON.stringify(data));
      this.filterService.tabCountData.next({
        data: JSON.parse(localStorage.getItem('tabCount')),
      });
      this.loadCard = true;

      // let data = {
      //   highAlert: 0,
      //   alert: 3,
      //   good: 2,
      //   noOfNonAderancePatient: 0,
      // };

      if (data.highAlert === 0) {
        this.highAlertMatTab = true;
      }
      if (data.alert === 0) {
        this.alertMatTab = true;
      }
      if (data.good === 0) {
        this.goodMatTab = true;
      }
      if (data.noOfNonAderancePatient === 0) {
        this.nonAdherenceMatTab = true;
      }
      if (
        data.highAlert === 0 &&
        data.alert === 0 &&
        data.good === 0 &&
        data.noOfNonAderancePatient === 0
      ) {
        // localStorage.setItem('highAlertCount', data.highAlert);
        this.highAlertTab = true;
      }
      this.patientTabCounts = data;

      let defaultIdx = tabs[this.currentTabIndex - 1];

      const defaultVal = data[defaultIdx];
      if (defaultVal && defaultVal > 0 && this.zoneWithPatients === undefined) {
        this.zoneWithPatients = defaultIdx;
      } else {
        tabs.forEach((tabIdx) => {
          const val = data[tabIdx];

          if (val && val > 0 && this.zoneWithPatients === undefined) {
            this.zoneWithPatients = tabIdx;
          }
          if (val === 0 && tabIdx === 'highAlert') {
            this.highAlertMatTab = true;
          } else if (val > 0 && tabIdx === 'highAlert') {
            this.highAlertTab = true;
            this.caregiverSharedService.changehighAlertTabCounts(true);
          }
          if (val === 0 && tabIdx === 'alert') {
            this.alertMatTab = true;
          } else if (val > 0 && tabIdx === 'alert' && this.highAlertMatTab) {
            this.alertTab = true;
            // this.caregiverSharedService.changealertTabCounts(true);
          }

          if (val === 0 && tabIdx === 'good') {
            this.goodMatTab = true;
          } else if (
            val > 0 &&
            tabIdx === 'good' &&
            this.highAlertMatTab &&
            this.alertMatTab
          ) {
            this.goodTab = true;
            // this.caregiverSharedService.changegoodTabCounts(true);
          }
          if (val === 0 && tabIdx === 'noOfNonAderancePatient') {
            this.nonAdherenceMatTab = true;
          } else if (
            val > 0 &&
            tabIdx === 'noOfNonAderancePatient' &&
            this.highAlertMatTab &&
            this.alertMatTab &&
            this.goodMatTab
          ) {
            this.nonAdherenceTab = true;

            // this.caregiverSharedService.changeNonAdherenceTabCounts(true);
          }
        });
      }
      const redZoneAlert = localStorage.getItem('redZone');
      if (!redZoneAlert) {
        const currentIdx = tabs.indexOf(this.zoneWithPatients);
        this.videoState.setActiveTabIndex(currentIdx);
      }

      localStorage.setItem('highAlertCount', this.patientTabCounts.highAlert);
      localStorage.setItem('alertCount', this.patientTabCounts.alert);
      localStorage.setItem('goodCount', this.patientTabCounts.good);
      localStorage.setItem(
        'nonAdherenceCount',
        this.patientTabCounts.noOfNonAderancePatient
      );

      if (this.highAlertTab) {
        this.tabImg1 = 'assets/svg/DashboardIcons/High Alert White.svg';
        this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
        this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
        this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
      } else if (this.alertTab) {
        this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';
        this.tabImg2 = 'assets/svg/DashboardIcons/Alert White.svg';
        this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
        this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
      } else if (this.goodTab) {
        this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';
        this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
        this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up White.svg';
        this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
      } else if (this.nonAdherenceTab) {
        this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';
        this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
        this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
        this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence White.svg';
      }
      // },
      //   (err) => {
      //     // this.snackBarService.error(err.error?.message);
    });
  }

  clearData(): void {
    this.videoState.setDatarefresh(true);
    sessionStorage.removeItem('2-patient-list');
    sessionStorage.removeItem('1-patient-list');
    sessionStorage.removeItem('3-patient-list');
    sessionStorage.removeItem('non-adherence-patient-list');
    localStorage.removeItem('nonAdherencePatients');
    localStorage.removeItem('goodZonePatients');
    localStorage.removeItem('alertZonePatients');
    localStorage.removeItem('highAlertZonePatients');
  }
  getDate(date) {
    const newDate = date * 1000;
    return new Date(newDate);
  }
  drawerToggle(drawer) {
    drawer.toggle();
    this.overlayOn = false;
    this.showDialysis = false;
  }

  buttonChange(buttonType) {
    if (buttonType == 'addNote') {
      // this.addButton = false;
      this.useTemplateButton = true;
      this.triggedAddNote = true;
    } else if (buttonType == 'useTemplate') {
      this.addButton = false;
      this.useTemplateButton = false;
      this.addTemplateButton = true;
      this.triggedAddNote = false;
      this.triggeredTemplate = true;
      this.triggeredaddTemplate = false;
    } else if (buttonType == 'addTemplate') {
      this.addButton = false;
      this.useTemplateButton = false;
      this.addTemplateButton = false;
      this.triggeredaddTemplate = true;
    }
  }
  getOverlay(event) {
    this.overlayOn = event;
    this.cdr.detectChanges();
  }

  openNotesDrawer(drawer, data: any): void {
    this.overlayOn = true;
    this.showNotes = true;
    this.showDialysis = false;
    this.cpid = data.scopeId;
    this.cpName = data.firstName + ' ' + data.lastName;

    this.getNotesList(data.scopeId);
    // this.getDefaultNotes();
    drawer.toggle();
    this.caregiverSharedService.callNotesCarePlans(true);
  }
  openNav(drawer, data, element) {
    drawer.toggle();
    this.overlayOn = true;

    if (data == 'dialysis') {
      this.showDialysis = true;
      this.showNotes = false;
    } else if (data == 'notes') {
      this.showNotes = true;
      this.showDialysis = false;
      this.cpid = element.patientResponse?.id;
      this.cpName =
        element.patientResponse?.firstName +
        ' ' +
        element.patientResponse?.lastName;
      this.getNotesList(element.patientResponse?.id);
      // this.getDefaultNotes();
      // localStorage.setItem('patientId', element.patientResponse?.id);
    }
  }

  openApptDrawer(event, drawer) {
    if (event) {
      this.openNav(drawer, 'dialysis', '');
    }
  }

  getImgUrl(url) {
    const imgUrl = url.substring(url.lastIndexOf('/') + 1);

    const imgStr = `assets/img/symptoms/${imgUrl}`;
    return imgStr;
  }
  getBPImage(image) {
    let bpImg = [];
    if (this.fileService.isValidJson(image)) {
      const str: string = '' + image;
      bpImg = typeof str === 'string' ? JSON.parse(str) : '';
      return bpImg;
    } else {
      return '';
    }
  }

  openMessage(cellNo) {
    const messageModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '449px',
      height: '295px',
      data: cellNo,
    };
    this.dialog.closeAll();
    const msg = this.dialog
      .open(CareproviderMessageDialogComponent, messageModalConfig)
      .afterClosed()
      .subscribe((e) => {});
  }

  startVideoCall(ele): void {
    this.userId = this.user?.userDetails?.id;
    this.userName =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
    // var immediatedate = this.caregiverSharedService.formatDate(new Date());
    const immediatetime = new Date().toTimeString();
    const callType = 'IMMEDIATE_VIDEOCALL';
    let d = new Date();
    d.setHours(new Date().getHours() + 5);
    d.setMinutes(new Date().getMinutes() + 30);
    const body = {
      patientName: ele.firstName + ' ' + ele.lastName,

      senderName: this.userName,
      senderId: this.scopeId,
      receiverId: ele.scopeId,
      callType: callType,
      scheduleDate: d,
      scheduledBy: this.userRole,
      scheduleCallStatus: 'INPROGRESS',
    };
    this.service.startCall(body).subscribe(
      (res) => {
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
            identity: this.userName,
            room: ele.scopeId,
            video: 'true',
            audio: 'true',
            callEndType: 'IMMEDIATE_CALL',
            scheduleId: this.scheduleCallId,
            patientName: ele.firstName + ' ' + ele.lastName,
          },
        };

        const videoCallDialog = this.dialog.open(
          VideoCallComponent,
          dialogConfig
        );
        localStorage.setItem('openedVideoCallDialog', JSON.stringify(ele));
        videoCallDialog.afterClosed().subscribe((e) => {
          if (e) {
            this.snackBarService.error(
              'Patient did not joined the call. Please try after sometime'
            );
            this.scheduledId = localStorage.getItem('scheduledid');
            this.callEndType = localStorage.getItem('callEndType');
            if (this.callEndType === 'IMMEDIATE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );
              if (callDuration?.duration === '00:00') {
                this.service.callNotAttended(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
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
              }
            } else if (this.callEndType === 'SCHEDULE_CALL') {
              if (callDuration?.duration === '00:00') {
                this.service.callNotJoined(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
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
            }
            setTimeout(() => {
              location.reload();
              localStorage.removeItem('openedAudioCallDialog');
            }, 4000);
          } else {
            location.reload();
          }
        });
      },
      (err) => {
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
        //       this.service
        //         .removeCallRecord(
        //           ele.patient ? ele.patient.id : ele.responsePt.id
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //           location.reload();
        //           localStorage.removeItem('openedAudioCallDialog');
        //         });
        //     }
        //   });
        // }

        this.snackBarService.error(err.message);
      }
    );
  }

  startAudioCall(ele): void {
    this.userId = this.user?.userDetails?.id;
    this.userName =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];

    // var immediatedate = this.caregiverSharedService.formatDate(new Date());
    const immediatetime = new Date().toTimeString();
    const callType = 'IMMEDIATE_VOICECALL';
    let d = new Date();
    d.setHours(new Date().getHours() + 5);
    d.setMinutes(new Date().getMinutes() + 30);
    const body = {
      patientName: ele?.firstName + ' ' + ele?.lastName,
      senderName: this.userName,
      senderId: this.scopeId,
      receiverId: ele.scopeId,
      callType: callType,
      scheduleDate: d,
      scheduledBy: this.userRole,
      scheduleCallStatus: 'INPROGRESS',
    };

    this.service.startCall(body).subscribe(
      (res) => {
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
            scheduleId: this.scheduleCallId,
            identity: this.userName,
            room: ele.scopeId,
            video: 'false',
            audio: 'true',
            callEndType: 'IMMEDIATE_CALL',
            patientName: ele?.firstName + ' ' + ele?.lastName,
          },
        };
        const audioCallDialog = this.dialog.open(
          AudioCallComponent,
          audioModalConfig
        );
        localStorage.setItem('openedAudioCallDialog', JSON.stringify(ele));
        audioCallDialog.afterClosed().subscribe((e) => {
          if (e) {
            this.snackBarService.error(
              'Patient did not joined the call. Please try after sometime'
            );
            this.scheduledId = localStorage.getItem('scheduledid');
            this.callEndType = localStorage.getItem('callEndType');
            if (this.callEndType === 'IMMEDIATE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );

              if (callDuration?.duration === '00:00') {
                this.service.callNotAttended(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
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
              }
            } else if (this.callEndType === 'SCHEDULE_CALL') {
              if (callDuration?.duration === '00:00') {
                this.service.callNotJoined(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
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
            }
            setTimeout(() => {
              location.reload();
              localStorage.removeItem('openedAudioCallDialog');
            }, 4000);
          } else {
            location.reload();
          }
        });
      },
      (err) => {
        // this.snackBarService.error(err.message);
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
        //       this.service
        //         .removeCallRecord(
        //           ele.patient ? ele.patient?.id : ele.responsePt?.id
        //         )
        //         .subscribe(() => {
        //           this.leaveRoom();
        //           location.reload();
        //           localStorage.removeItem('openedAudioCallDialog');
        //         });
        //     }
        //   });
        // }

        this.snackBarService.error(err.message);
      }
    );
  }

  onMouseOver(id): void {
    if (id == 1) {
      this.imgSrc1 = 'assets/svg/DashboardIcons/Total Patients White.svg';
    } else {
      this.imgSrc2 = 'assets/svg/DashboardIcons/Scheduler White.svg';
    }
  }

  onMouseOut(): void {
    this.imgSrc1 = 'assets/svg/DashboardIcons/Total Patients.svg';
    this.imgSrc2 = 'assets/svg/DashboardIcons/Scheduler White.svg';
  }

  onMouseOverAction(index): boolean {
    for (let i = 0; i < this.highAlertZone.length; i++) {
      if (i == index) {
        this.imgSrcNote = 'assets/svg/DashboardIcons/Action Notes White.svg';
      }
    }
    return false;
  }
  onMouseOutAction() {
    this.imgSrcNote = 'assets/svg/DashboardIcons/Action Notes Blue.svg';
  }

  openScheduleCallDialog(ele, uniquekey) {
    const scheduleCallModalConfig = new MatDialogConfig();
    scheduleCallModalConfig.disableClose = true;
    (scheduleCallModalConfig.maxWidth = '412px'),
      (scheduleCallModalConfig.maxHeight = '400px'),
      (scheduleCallModalConfig.height = '265px'),
      (scheduleCallModalConfig.width = '412px'),
      (scheduleCallModalConfig.data = { element: ele, uniqueKey: uniquekey });

    this.dialog
      .open(CallSchedulerComponent, scheduleCallModalConfig)
      .afterClosed()
      .subscribe(() => {});
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    const idx = tabChangeEvent.index + 1;
    localStorage.setItem('care-giver-tab-index', idx.toString());
    this.videoState.setActiveTabIndex(tabChangeEvent.index);
    if (tabChangeEvent.index === 0 && this.patientTabCounts.highAlert !== 0) {
      if (!this.highAlertTab) {
        this.highAlertTab = true;
      }
      this.caregiverSharedService.changehighAlertTabCounts(true);
      this.tabImg1 = 'assets/svg/DashboardIcons/High Alert White.svg';
      this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
      this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
      this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
    } else if (tabChangeEvent.index === 1) {
      if (!this.alertTab && this.patientTabCounts.alert !== 0) {
        this.alertTab = true;
      }
      this.caregiverSharedService.changealertTabCounts(true);
      this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';
      this.tabImg2 = 'assets/svg/DashboardIcons/Alert White.svg';
      this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
      this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
    } else if (tabChangeEvent.index === 2) {
      if (!this.goodTab && this.patientTabCounts.good !== 0) {
        this.goodTab = true;
      }
      this.caregiverSharedService.changegoodTabCounts(true);
      this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';
      this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
      this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up White.svg';
      this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence Black.svg';
    } else if (tabChangeEvent.index === 3) {
      if (
        !this.nonAdherenceTab &&
        this.patientTabCounts.noOfNonAderancePatient !== 0
      ) {
        this.nonAdherenceTab = true;
      }
      this.caregiverSharedService.changeNonAdherenceTabCounts(true);
      // this.caregiverSharedService.nonAdherencePagination(true);
      // this.dataSource.loadNonAdherencePatients(0);
      this.tabImg1 = 'assets/svg/DashboardIcons/High Alert Black.svg';

      this.tabImg2 = 'assets/svg/DashboardIcons/Alert Black.svg';
      this.tabImg3 = 'assets/svg/DashboardIcons/Thumbs up Black.svg';
      this.tabImg4 = 'assets/svg/DashboardIcons/Non Adherence White.svg';
    }
  }
  getNotesList(id) {
    this.noteList = [];
    this.loadNotes = true;
    this.caregiverSharedService.loadNotes(this.loadNotes);

    this.docService.getListOfNotesByIdDoc(id).subscribe(
      (data) => {
        this.loadNotes = false;
        this.caregiverSharedService.loadNotes(this.loadNotes);

        this.actualNotelist = data;
        const noteArr = [];
        this.noteList = [];

        const receivedNotelist = data;
        for (let i = 0; i < receivedNotelist['length']; i++) {
          if (receivedNotelist[i].eShared == 1) {
            const flag = receivedNotelist[i].flag;
            let receiverName = '';
            let ptNoteId = '';
            for (let j = i; j < receivedNotelist['length']; j++) {
              if (receivedNotelist[j].flag == flag) {
                if (j == i) {
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
              if (
                this.noteList.findIndex((index) => index.flag == item.flag) ===
                -1
              ) {
                this.noteList.push(item);
              }
            });
          } else {
            this.noteList.push(receivedNotelist[i]);
            this.loadNotes = false;
            this.caregiverSharedService.loadNotes(this.loadNotes);
          }
        }
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }
  getDefaultNotes() {
    const fromdate = new Date(this.fromDate); // Or the date you'd like converted.
    const isoFromDateTime = new Date(
      fromdate.setHours(5, 30, 0, 0)
    ).toISOString();
    const todate = new Date(this.toDate);
    if (todate) {
      todate.setDate(todate.getDate() + 1);
    }
    const isoToDateTime = new Date(todate.setHours(5, 30, 0, 0)).toISOString();
    const body = {
      dateFrom: isoFromDateTime,
      dateTo: isoToDateTime,
    };
    this.service.getListOfDefaultNotes(body).subscribe(
      (data) => {
        this.defaultNoteList = data['content'];
        this.defaultNoteList = this.defaultNoteList.sort((a, b) => {
          return (
            new Date(b.createdDate).valueOf() -
            new Date(a.createdDate).valueOf()
          );
        });
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }
  notesFilterByDate(id, evtVal) {
    // const fromdate = evtVal.from; // Or the date you'd like converted.
    // // var isoFromDateTime = new Date(fromdate.setHours(0, 0, 0, 0)).toISOString();
    // const todate = evtVal.to; // Or the date you'd like converted.
    // if (fromdate && todate) {
    //   fromdate.setDate(new Date(fromdate.toISOString()).getDate() + 1);
    //   todate.setDate(new Date(todate.toISOString()).getDate() + 1);
    // }
    // // var isoToDateTime = new Date(todate.setHours(23, 59, 59, 59)).toISOString();
    // const observationFromDateSplitted = fromdate.toISOString().split('T');
    // const isoFromDateTime = observationFromDateSplitted[0];
    // const observationToDateSplitted = todate.toISOString().split('T');
    // const isoToDateTime = observationToDateSplitted[0];
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
    //     // this.snackBarService.error(err.error.message);
    //   }
    // );
  }
  viewEditedNote(evt) {
    if (evt) {
      this.getNotesList(this.cpid);
    }
  }
  getSubmittedNotes(evt) {
    if (evt) {
      this.getNotesList(this.cpid);
    }
  }
  viewTemplate(evt) {
    if (evt) {
      this.getDefaultNotes();
    }
  }
  triggeredNoteList(evt) {
    if (evt) {
      this.notesFilterByDate(this.cpid, evt);
    }
  }

  getAsDate(day, time) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == 'pm' && hours < 12) {
      hours = hours + 12;
    }
    if (AMPM == 'am' && hours == 12) {
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
    if (d) {
      d.setDate(d.getDate());
    }
    const n = d.toISOString().substring(0, 10);
    const newDate = n + 'T' + time;
    return newDate;
  }
}
