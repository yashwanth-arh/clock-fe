import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-non-adherence',
  templateUrl: './non-adherence.component.html',
  styleUrls: ['./non-adherence.component.scss'],
})
export class NonAdherenceComponent implements OnInit, AfterViewInit {
  @Output() notesClick = new EventEmitter();
  @Output() messageClick = new EventEmitter();
  @Output() videoCallClick = new EventEmitter();
  @Output() audioCallClick = new EventEmitter();
  @Output() scheduleCallClick = new EventEmitter();
  @Output() imageUrl = new EventEmitter();
  counter = 0;
  public dataSource: CaregiverPatientDataSource;
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
  displayedColumns: string[] = [];
  displayedGoodColumns: string[] = [
    'patient',
    // 'recentWeight',
    'recentBp',
    'status',
    'actions',
  ];
  highAlertDataSource: any;
  leavingComponent: boolean = false;
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
  imgSrcAudioCall = 'assets/svg/DashboardIcons/Action Audio Call Blue.svg';
  imgSrcVideo = 'assets/svg/DashboardIcons/Action Video Call Blue.svg';
  imgSrcDialysis = 'assets/svg/DashboardIcons/Action Scheduler Blue.svg';
  imgSrcMedication = 'assets/svg/DashboardIcons/MedicationIcon.svg';
  imgSrcDialysisRed = 'assets/svg/DashboardIcons/Action Scheduler Red.svg';
  public overlayOn = false;
  messageSuccess: boolean;
  nonAdherenceZonePatCount: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  profileimageUrl: any;
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
    public dateService: DateTransformationService,
    private titleCasePipe: TitleCasePipe
  ) {
    const user = this.auth.authData;
    this.leavingComponent = false;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.profileimageUrl = environment.imagePathUrl;

    this.dataSource = new CaregiverPatientDataSource(
      this.service,
      this.snackBarService
    );
  }
  ngOnInit(): void {
    this.leavingComponent = false;
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
    this.videoState.dataRefresh$.subscribe((res: boolean) => {
      if (res) {
        this.dataSource.loadNonAdherencePatients(0);
      }
    });

    // const currentTabIndex = localStorage.getItem('care-giver-tab-index')
    //   ? parseInt(localStorage.getItem('care-giver-tab-index'))
    //   : 1;
    // if (currentTabIndex) {
    //   currentTabIndex === 4 ? this.dataSource.loadNonAdherencePatients(0) : '';
    //   this.caregiverSharedService.changeNonAdherenceTabCounts(true);
    // }

    this.dataSource.totalElemObservable.subscribe((data) => {
      localStorage.setItem('zoneType', 'NonAdherence');
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
  }

  ngAfterViewInit() {
    this.leavingComponent = false;
    this.caregiverSharedService.triggeredNonAdherenceTabsCount.subscribe(
      (value) => {
        if (value) {
          this.nonAdherenceZonePatCount =
            localStorage.getItem('nonAdherenceCount');
          this.loadPatientsData();
        }
      }
    );
    if (this.sort !== undefined) {
      this.sort?.sortChange?.subscribe(() => {
        this.paginator.pageIndex = 0;
      });
      merge(this.sort?.sortChange, this.paginator.page)
        .pipe(
          tap(() => {
            this.loadPatientsData();
          })
        )
        .subscribe();
    }
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
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
      return this.profileimageUrl + pImg;
    }
  }
  loadPatientsData(): void {
    if (this.leavingComponent) {
      return;
    }
    this.counter = this.paginator.pageIndex;
    localStorage.setItem(
      'page-index',
      JSON.stringify(this.paginator.pageIndex)
    );
    this.dataSource.loadNonAdherencePatients(
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

  openNav(drawer, data, element) {}

  emitNotes(data: any): void {
    this.caregiverSharedService.triggeredNoteCarePlan.next(true);
    this.notesClick.emit(data);

    localStorage.setItem('patientId', data.patientId);
    this.caregiverSharedService.changeDrawerToggled(true);
  }

  getNotesList(id) {}
  // getDefaultNotes() {}

  startAudioCall(element: any): void {
    this.audioCallClick.emit(element);
  }

  startVideoCall(element: any): void {
    this.videoCallClick.emit(element);
  }
  getIndicators(ele) {
    let indicators = JSON.parse(ele);
    return indicators;
  }
  openScheduleCallDialog(element: any, key: string): void {
    element['callType'] = key;
    this.scheduleCallClick.emit(element);
  }

  openMessage(element: string): void {
    this.messageClick.emit(element);
  }

  getDate(date) {
    const newDate = date * 1000;
    return new Date(newDate);
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
  openMedication(ele, name) {
    this.router.navigate(['/careproviderDashboard/patientProfile']);
    localStorage.setItem('selectedMedication', 'true');
    localStorage.setItem('patientId', ele.scopeId);
    localStorage.setItem('patientName', name);
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
}
