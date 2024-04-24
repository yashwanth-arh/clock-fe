import { element } from 'protractor';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverPatientDataSource } from 'src/app/CareproviderDashboard/careprovider-patient-list/patient-list-dataSource';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FileService } from 'src/app/core/services/file.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { VideoStateService } from 'src/app/twilio/services/video-state.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DateTransformationService } from 'src/app/core/services/date-transformation.service';
import { environment } from 'src/environments/environment';
import { MatDialogService } from 'src/app/services/mat-dialog.service';
import { PastActivitiesDialogComponent } from '../past-activities-dialog/past-activities-dialog.component';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-high-alert',
  templateUrl: './high-alert.component.html',
  styleUrls: ['./high-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HighAlertComponent implements OnInit, AfterViewInit {
  @Output() notesClick = new EventEmitter();
  @Output() messageClick = new EventEmitter();
  @Output() videoCallClick = new EventEmitter();
  @Output() audioCallClick = new EventEmitter();
  @Output() scheduleCallClick = new EventEmitter();
  @Output() imageUrl = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public dataSource: CaregiverPatientDataSource;
  profileimageUrl: string;

  counter = 0;
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
  activitiesList: any = [];
  displayedColumns: string[] = [];
  displayedGoodColumns: string[] = [
    'patient',
    // 'recentWeight',
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
  cpid: any;
  cpName: any;
  now: Date;
  details: any = [];
  _name: string;
  branch: string;
  _id: string;
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
  imgSrcMsg = 'assets/svg/DashboardIcons/Action Message Blue.svg';
  imgSrcMedication = 'assets/svg/DashboardIcons/MedicationIcon.svg';
  imgSrcAudioCall = 'assets/svg/DashboardIcons/Action Audio Call Blue.svg';
  imgSrcVideo = 'assets/svg/DashboardIcons/Action Video Call Blue.svg';
  imgSrcDialysis = 'assets/svg/DashboardIcons/Action Scheduler Blue.svg';
  imgSrcDialysisRed = 'assets/svg/DashboardIcons/Action Scheduler Red.svg';
  public overlayOn = false;
  messageSuccess: boolean;
  highalertZonePatCount: string;
  osType: string;
  ongoingCall = false;
  loadCard: boolean = false;
  constructor(
    public service: CaregiverDashboardService,
    private snackBarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    public caregiverSharedService: CaregiverSharedService,
    public dialog: MatDialog,
    private auth: AuthService,
    public datepipe: DatePipe,
    public videoState: VideoStateService,
    public fileService: FileService,
    public dateService: DateTransformationService,
    private titleCasePipe: TitleCasePipe,
    private matDialogService: MatDialogService
  ) {
    const user = this.auth.authData;
    this.roleid = user.userDetails.id;
    this.userRole = user.userDetails.userRole;
    this.profileimageUrl = environment.imagePathUrl;
    this.dataSource = new CaregiverPatientDataSource(
      this.service,
      this.snackBarService
    );
  }

  ngOnInit(): void {
    if (this.userRole === 'CARECOORDINATOR') {
      // this.displayedColumns.splice(-1);
      this.displayedColumns = [
        'patient',
        // 'recentWeight',
        'recentBp',
        'lifestyle',
        'status',
        'contactNo',
        // 'actions',
      ];
    } else {
      this.displayedColumns = [
        'patient',
        // 'recentWeight',
        'recentBp',
        'lifestyle',
        'symptoms',
        'status',
        'actions',
      ];
    }
    this.osType = window.navigator.platform;
    // this.ongoingCall = JSON.parse(localStorage.getItem('compressCall'));
    this.videoState.dataRefresh$.subscribe((res: boolean) => {
      if (res) {
        this.dataSource.loadPatients(1, 0);
      }
    });

    // const currentTabIndex = localStorage.getItem('care-giver-tab-index')
    //   ? parseInt(localStorage.getItem('care-giver-tab-index'))
    //   : 1;
    // if (currentTabIndex) {
    //   currentTabIndex === 1 ? this.dataSource.loadPatients(1, 0) : '';
    //   this.caregiverSharedService.changehighAlertTabCounts(true);
    // }

    this.dataSource.totalElemObservable.subscribe((data) => {
      localStorage.setItem('zoneType', 'HighAlert');
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
    this.highalertZonePatCount = localStorage.getItem('highAlertCount');
    this.caregiverSharedService.triggeredhighAlertPatientNotification.subscribe(
      (data) => {
        if (data) {
          localStorage.setItem('redZone', 'true');
          this.videoState.setActiveTabIndex(0);
          // setTimeout(() => {
          //   this.dataSource.loadPatients(1, 0);
          // }, 1000);
        } else {
          localStorage.removeItem('redZone');
        }
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.caregiverSharedService.triggeredhighAlertTabsCount.subscribe(
        (value) => {
          if (value) {
            this.highalertZonePatCount = localStorage.getItem('highAlertCount');
            this.loadPatientsData();
          }
        }
      );
    });
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadPatientsData();
        })
      )
      .subscribe();
  }

  loadPatientsData(): void {
    this.counter = this.paginator.pageIndex;
    localStorage.setItem(
      'page-index',
      JSON.stringify(this.paginator.pageIndex)
    );
    this.dataSource.loadPatients(
      1,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    setTimeout(() => {
      this.loadCard = true;
    }, 1000);
  }
  getWeightImage(image) {
    let wtImg = [];
    if (this.fileService.isValidJson(image)) {
      const str: string = '' + image;
      wtImg = typeof str === 'string' ? JSON.parse(str) : '';
      return wtImg;
    } else {
      return '';
    }
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

  openNav(drawer, data, element5) {}
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
      return this.profileimageUrl + pImg;
    }
  }
  emitNotes(data: any): void {
    this.caregiverSharedService.triggeredNoteCarePlan.next(true);
    this.notesClick.emit(data);
    this.caregiverSharedService.changeDrawerToggled(true);
    localStorage.setItem('patientId', data.patientId);
  }

  getFullName(ele) {
    return (
      this.titleCasePipe.transform(ele?.firstName) +
      ' ' +
      (ele?.middleName ? this.titleCasePipe.transform(ele?.middleName) : '') +
      ' ' +
      this.titleCasePipe.transform(ele?.lastName)
    );
  }
  // getDefaultNotes() {}

  startAudioCall(elements: any): void {
    this.audioCallClick.emit(elements);
  }

  startVideoCall(elements1: any): void {
    this.videoCallClick.emit(elements1);
  }

  openScheduleCallDialog(element2: any, key: string): void {
    element2['callType'] = key;
    this.scheduleCallClick.emit(element2);
  }

  openMessage(element3: string): void {
    this.messageClick.emit(element3);
  }
  openMedication(ele, name) {
    this.router.navigate(['/careproviderDashboard/patientProfile']);

    // if (this.counter === 0) {
    //   localStorage.setItem('patientIndex', idx);
    // } else {
    //   localStorage.removeItem('patientIndex');
    // }
    localStorage.setItem('patientId', ele.scopeId);
    localStorage.setItem('selectedMedication', 'true');
    localStorage.setItem('patientName', name);
    // localStorage.setItem('zoneType', type);
    // this.caregiverSharedService.changeHeaderTitle('patientProfile');
    // }
  }

  // getDate(date) {
  //   var newDate = date * 1000;
  //   return new Date(newDate);
  // }
  showNextAppt(ele): any {
    if (ele.appointmentDate && ele.scheduleAudioCall && ele.scheduleVideoCall) {
      if (
        new Date(ele.appointmentDate) > new Date() &&
        new Date(ele.appointmentDate) <= new Date(ele.scheduleAudioCall) &&
        new Date(ele.appointmentDate) <= new Date(ele.scheduleVideoCall)
      ) {
        return `Next appointment scheduled for ${this.dateService.transformDate(
          ele?.appointmentDate
        )}`;
      } else if (
        new Date(ele.appointmentDate) < new Date() &&
        new Date(ele.scheduleAudioCall) < new Date() &&
        new Date(ele.scheduleVideoCall) < new Date()
      ) {
        return '';
      } else if (
        new Date(ele.appointmentDate) > new Date() &&
        new Date(ele.scheduleAudioCall) > new Date() &&
        new Date(ele.scheduleVideoCall) > new Date()
      ) {
        if (
          new Date(ele.appointmentDate) <
          (new Date(ele.scheduleAudioCall) && new Date(ele.scheduleVideoCall))
        ) {
          return `Next appointment scheduled for ${this.dateService.transformDate(
            ele?.appointmentDate
          )}`;
        } else if (
          new Date(ele.scheduleAudioCall) < new Date(ele.appointmentDate) ||
          new Date(ele.scheduleAudioCall) < new Date(ele.scheduleVideoCall)
        ) {
          return `Next audio call scheduled for ${this.dateService.transformDate(
            ele?.scheduleAudioCall
          )}`;
        } else if (
          new Date(ele.scheduleVideoCall) < new Date(ele.appointmentDate) ||
          new Date(ele.scheduleVideoCall) < new Date(ele.scheduleAudioCall)
        ) {
          return `Next video call scheduled for ${this.dateService.transformDate(
            ele?.scheduleVideoCall
          )}`;
        } else {
        }
      } else if (
        new Date(ele.appointmentDate) < new Date() &&
        new Date(ele.scheduleAudioCall) >= new Date() &&
        new Date(ele.scheduleVideoCall) >= new Date()
      ) {
        if (new Date(ele.scheduleVideoCall) < new Date(ele.scheduleAudioCall)) {
          return `Next video call scheduled for ${this.dateService.transformDate(
            ele?.scheduleVideoCall
          )}`;
        } else {
          return `Next audio call scheduled for ${this.dateService.transformDate(
            ele?.scheduleAudioCall
          )}`;
        }
      } else if (
        new Date(ele.appointmentDate) < new Date() &&
        new Date(ele.scheduleAudioCall) >= new Date() &&
        new Date(ele.scheduleVideoCall) <= new Date()
      ) {
        return `Next audio call scheduled for ${this.dateService.transformDate(
          ele?.scheduleAudioCall
        )}`;
      } else if (
        new Date(ele.appointmentDate) < new Date() &&
        new Date(ele.scheduleAudioCall) <= new Date() &&
        new Date(ele.scheduleVideoCall) >= new Date()
      ) {
        return `Next video call scheduled for ${this.dateService.transformDate(
          ele?.scheduleVideoCall
        )}`;
      } else {
      }
    } else if (
      ele.appointmentDate &&
      !ele.scheduleAudioCall &&
      !ele.scheduleVideoCall
    ) {
      if (new Date(ele.appointmentDate) > new Date()) {
        return ele.appointmentType === 'PHYSICAL'
          ? `Next appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`
          : `Next video appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`;
      } else {
        return '';
      }
    } else if (
      ele.appointmentDate &&
      ele.scheduleAudioCall &&
      !ele.scheduleVideoCall
    ) {
      if (new Date(ele.appointmentDate) > new Date()) {
        return ele.appointmentType === 'PHYSICAL'
          ? `Next appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`
          : `Next video appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`;
      } else if (new Date(ele.scheduleAudioCall) > new Date()) {
        return `Next audio call scheduled for ${this.dateService.transformDate(
          ele?.scheduleAudioCall
        )}`;
      } else if (
        new Date(ele.scheduleAudioCall) > new Date() &&
        new Date(ele.appointmentDate) > new Date()
      ) {
        if (new Date(ele.scheduleAudioCall) > new Date(ele.appointmentDate)) {
          return ele.appointmentType === 'PHYSICAL'
            ? `Next appointment scheduled for ${this.dateService.transformDate(
                ele?.appointmentDate
              )}`
            : `Next video appointment scheduled for ${this.dateService.transformDate(
                ele?.appointmentDate
              )}`;
        } else {
          return `Next audio call scheduled for ${this.dateService.transformDate(
            ele?.scheduleAudioCall
          )}`;
        }
      } else {
        return '';
      }
    } else if (
      ele.appointmentDate &&
      !ele.scheduleAudioCall &&
      ele.scheduleVideoCall
    ) {
      if (new Date(ele.appointmentDate) > new Date()) {
        return ele.appointmentType === 'PHYSICAL'
          ? `Next appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`
          : `Next video appointment scheduled for ${this.dateService.transformDate(
              ele?.appointmentDate
            )}`;
      } else if (new Date(ele.scheduleVideoCall) > new Date()) {
        return `Next video call scheduled for ${this.dateService.transformDate(
          ele?.scheduleVideoCall
        )}`;
      } else if (
        new Date(ele.scheduleVideoCall) > new Date() &&
        new Date(ele.appointmentDate) > new Date()
      ) {
        if (new Date(ele.scheduleAudioCall) > new Date(ele.appointmentDate)) {
          return ele.appointmentType === 'PHYSICAL'
            ? `Next appointment scheduled for ${this.dateService.transformDate(
                ele?.appointmentDate
              )}`
            : `Next video appointment scheduled for ${this.dateService.transformDate(
                ele?.appointmentDate
              )}`;
        } else {
          return `Next video call scheduled for ${this.dateService.transformDate(
            ele?.scheduleVideoCall
          )}`;
        }
      } else {
        return '';
      }
    } else if (
      !ele.appointmentDate &&
      ele.scheduleAudioCall &&
      ele.scheduleVideoCall
    ) {
      if (
        new Date(ele.scheduleVideoCall) > new Date() ||
        new Date(ele.scheduleAudioCall) > new Date()
      ) {
        if (new Date(ele.scheduleVideoCall) < new Date(ele.scheduleAudioCall)) {
          return `Next video call scheduled for ${this.dateService.transformDate(
            ele?.scheduleVideoCall
          )}`;
        } else {
          return `Next audio call scheduled for ${this.dateService.transformDate(
            ele?.scheduleAudioCall
          )}`;
        }
      } else {
        return '';
      }
    } else if (
      !ele.appointmentDate &&
      !ele.scheduleAudioCall &&
      ele.scheduleVideoCall
    ) {
      if (new Date(ele.scheduleVideoCall) > new Date()) {
        return `Next video call scheduled for ${this.dateService.transformDate(
          ele?.scheduleVideoCall
        )}`;
      } else {
        return '';
      }
    } else if (
      !ele.appointmentDate &&
      ele.scheduleAudioCall &&
      !ele.scheduleVideoCall
    ) {
      if (new Date(ele.scheduleAudioCall) > new Date()) {
        return `Next audio call scheduled for ${this.dateService.transformDate(
          ele?.scheduleAudioCall
        )}`;
      } else {
        return '';
      }
    } else {
    }
  }

  getIndicators(ele) {
    let indicators = JSON.parse(ele);
    return indicators;
  }
  showDialysisText(ele) {
    if (
      new Date(ele.appmtResponse?.appointmentRequestDate) &&
      new Date(ele.patientResponse?.nextDialysisDate) &&
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
  nextDialysis(ele) {
    return 'Next appointment scheduled for' + ' ' + ele;
  }

  openPatientProfile(id, name, type, idx) {
    if (this.userRole === 'CAREPROVIDER') {
      this.router.navigate(['/careproviderDashboard/patientProfile']);
      if (this.counter === 0) {
        localStorage.setItem('patientIndex', idx);
      } else {
        localStorage.removeItem('patientIndex');
      }
      localStorage.setItem('patientId', id);
      localStorage.setItem('patientName', name);
      localStorage.setItem('zoneType', type);
      this.caregiverSharedService.changeHeaderTitle('patientProfile');
      localStorage.setItem('moduleName', 'careprovider-patient-list');
    }
  }
  pastActivities(ele) {
    const pastActivityDialog: MatDialogConfig = {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '110vh',
      width: '450px',
      panelClass: 'activityClass',
      data: { patientId: ele.patientId },
    };
    // The user can't close the dialog by clicking outside its body

    this.dialog
      .open(PastActivitiesDialogComponent, pastActivityDialog)
      .afterClosed()
      .subscribe((e) => {});
  }
}
