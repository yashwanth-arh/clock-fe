import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { UserProfile } from 'src/app/shared/entities/user-profile';
import { NotificationDialogComponent } from 'src/app/CommonComponents/notification-dialog/notification-dialog.component';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { NotifierService } from 'angular-notifier';
import { ResetPasswordComponent } from 'src/app/userprofile/reset-password/reset-password.component';
import {
  SettingsStateService,
  UnitSettings,
} from 'src/app/core/services/settings-state.service';
import { DashbaordStateService } from 'src/app/CommonComponents/doctor-patients-details/dashbaord-state.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialogService } from 'src/app/services/mat-dialog.service';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { User } from 'src/app/shared/models/user.model';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { ImgUploadService } from 'src/app/core/components/image-upload/img-upload.service';
import { SupportTicketComponent } from 'src/app/support-ticket/support-ticket.component';
import { TitleCasePipe } from '@angular/common';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { CareproviderMyTeamsComponent } from 'src/app/care-provider-management/careprovider-my-teams/careprovider-my-teams.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  branchName: string;
  routeHistory: any = [];
  @Input() role: string;
  @Output() searchValue = new EventEmitter<void>();
  @Output() emittedappointmentScheduledList = new EventEmitter<boolean>();
  @Input() notificationCountData: string;
  @ViewChild(SupportTicketComponent)
  defaultUrl = 'assets/svg/DashboardIcons/Patient.svg';
  scheduleDate: Date = new Date();
  showCallSchedule = false;
  showAppt = false;
  scheduledCallCount: string;
  appointmentHeaders: string[] = [
    'date',
    'preDialysisWeight',
    'preDialysisBP',
    'postDialysisWeight',
    'postDialysisBP',
    'nextDialysisDate',
    'notes',
  ];
  public weight = 'lbs';
  public height = 'inches';
  public notification: string;
  position: TooltipPosition = 'right';
  disabled = false;
  leavingComponent: boolean = false;
  showDelay = 0;
  hideDelay = 0;
  showExtraClass = true;
  selectedId: any;
  view = true;
  private pid: string;
  nav_position: any = 'end';
  notificationToggle: boolean;
  count: any;
  id: any;
  showProfileCard = false;
  currentData: Date = new Date();
  public profileImagePath: SafeResourceUrl = '';
  public profileData: UserProfile;
  roleId: string;
  userRole: string;
  notification_count: any;
  details: any = [];
  userId: string;
  userName: string;
  caregiverName: string;
  message: string;
  scheduledCallList: any = [];
  profileImg: any;
  public overlayOn = false;
  showSettings = false;
  panelOpenState = false;
  now: Date = new Date();
  unitSettingsRes: UnitSettings;
  osType: string;
  currentUrl: string;
  imageUrl: string;
  private mediaSub: Subscription;
  private notificationDialogConfig: MatDialogConfig;
  public isNotificationDialogActive: boolean;
  public isNotificationBtnClicked: boolean;
  public weightToggle: boolean;
  public feetToggle: boolean;
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  public shapeofProfileImage: string;
  public selectedRole: UserRoles;
  name: any;
  showTickets: boolean = false;
  provideAdminAccess: any;
  userRoleDisplay: string;
  splitRole: string[];
  tabDetails: any;
  s3BaseUrl: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private authService: AuthService,
    private caregiverSharedService: CaregiverSharedService,
    public dialog: MatDialog,
    private service: CaregiverDashboardService,
    private docService: DoctorDashboardService,
    private imageService: ImgUploadService,
    private sideNavService: SidenavService,
    private pushNotificationService: PushNotificationService,
    private notifier: NotifierService,
    private settingsStateService: SettingsStateService,
    private dashbordStateService: DashbaordStateService,
    private mediaObserver: MediaObserver,
    private _sanitizer: DomSanitizer,
    private matDialogService: MatDialogService,
    private titlecasePipe: TitleCasePipe,
    private filterService: FilterSharedService,
    private authStateService: AuthStateService
  ) {
    this.isNotificationDialogActive = false;
    this.leavingComponent = false;
    this.isNotificationBtnClicked = false;
    this.dataSource = new MatTableDataSource<any>();
    this.id = route.snapshot.params['value'];
    this.roleId = this.authService?.authData?.userDetails['scopeId'];
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    this.imageUrl = environment.imagePathUrl;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.s3BaseUrl = authDetails?.s3BaseUrl;
    // setInterval(() => {
    this.pushNotificationService.receiveMessage();
    this.message = '';
    this.message =
      this.pushNotificationService.currentMessage['_value']?.notification?.body;
    if (this.message) {
      this.notifier.notify('info', this.message);
    }
    setInterval(() => {
      this.now = new Date();
    }, 60000);
    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
      this.name =
        user?.userDetails?.['firstName'] +
        ' ' +
        user?.userDetails?.['lastName'];
    });
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.osType = window.navigator.platform;
    if (this.userRole === 'CAREPROVIDER') {
      this.caregiverSharedService.triggerdScheduleCallCount.subscribe((res) => {
        if (res) {
          this.getScheduledCallList('');
        } else {
          this.getScheduledCallList('INITIATED');
        }
      });
    }
    this.caregiverSharedService.currentId.subscribe((res) => {
      this.selectedId = res;
    });
    setTimeout(() => {
      this.getProfileDetails();
    }, 1000);
    this.shapeofProfileImage = 'Rounded';
    this.authService.user.subscribe((user: User) => {
      if (user) {
        this.selectedRole = user?.userDetails?.userRole;
        this.splitRole = user?.userDetails?.userRole.split('_');
        this.userRoleDisplay =
          this.splitRole[0] +
          (this.splitRole[1] ? ' ' + this.splitRole[1] : '');
        this.userName =
          user?.userDetails?.firstName + ' ' + user?.userDetails?.lastName;
        // this.branchName=user?.userDetails?.userRole
      }
    });
  }
  ngAfterViewInit() {
    this.leavingComponent = false;
    this.caregiverSharedService.triggeredHeaderTitle.subscribe((res) => {
      if (res && typeof res === 'boolean') {
        this.getCount();
      } else if (res && typeof res !== 'boolean') {
        this.getCount();
        this.currentUrl = res;
      } else {
        this.currentUrl = this.route.snapshot['_routerState'].url;

        this.getCount();
      }
    });
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.location.reload();
  }
  showProfile() {
    let users = [
      'RPM_ADMIN',
      'HOSPITAL_USER',
      'FACILITY_USER',
      // 'CARECOORDINATOR',
    ];
    if (!users.includes(this.userRole)) {
      return true;
    } else {
      return false;
    }
  }
  openAppointmentScheduleList() {
    this.emittedappointmentScheduledList.emit(true);
  }

  openTotalPatients() {
    if (this.route.snapshot.routeConfig.path == 'caregiverDashboard') {
      this.router.navigate(['/caregiverDashboard/totalPatients']);
    } else {
      this.router.navigate(['/careproviderDashboard/totalPatients']);
    }
    this.caregiverSharedService.changeHeaderTitle('Total Patients');
  }

  home() {
    if (
      this.userRole === 'RPM_ADMIN' ||
      this.userRole === 'FACILITY_USER' ||
      this.userRole === 'HOSPITAL_USER'
    ) {
      // this.router.navigate(['/login']);
    } else {
      if (this.route.routeConfig.path == 'caregiverDashboard') {
        this.router.navigate(['/caregiverDashboard/patientReadings']);
      } else {
        this.router.navigate([
          '/careproviderDashboard/careprovider-patient-list',
        ]);
      }

      this.caregiverSharedService.changeMessage([]);
      localStorage.removeItem('BPLineData');
      localStorage.removeItem('BGLineData');
      localStorage.removeItem('BGTrendData');
      localStorage.removeItem('BPTrendData');
      localStorage.removeItem('selectedMedication');
      // localStorage.removeItem('BGAdherenceData');
      // localStorage.removeItem('BPAdherenceData');
      // this.caregiverSharedService.triggerdBGTrend.unsubscribe();
      this.dashbordStateService.setCurrentPageNo(1);
      localStorage.removeItem('page-index');
      this.caregiverSharedService.changeHeaderTitle('Dashboard');
    }
  }
  getPatientId(event) {
    this.pid = event;
  }
  onLogout(): void {
    this.dialog.closeAll();
    this.authService.logout();
    // this.snackBarService.openSnackBar('Logged out successfully!', 'close', 3000);
  }
  openCard() {
    this.showProfileCard = !this.showProfileCard;
  }
  openTickets() {
    this.router.navigate(['careproviderDashboard/support-ticket']);
    this.caregiverSharedService.changeHeaderTitle('Support Tickets');

    // this.showTickets=true;
  }
  openMyStaff() {
    const doctorClinicModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    doctorClinicModalConfig.disableClose = true;
    (doctorClinicModalConfig.width = '1000px'),
      (doctorClinicModalConfig.height = '600px'),
      (doctorClinicModalConfig.data = {
        careProviderId: localStorage.getItem('currentUserId'),
      }),
      this.dialog
        .open(CareproviderMyTeamsComponent, doctorClinicModalConfig)
        .afterClosed()
        .subscribe((e) => {
          // this.doctorsList.reset();
        });
  }
  getProfileDetails() {
    if (this.leavingComponent) {
      return;
    }
    const defaultImg = 'assets/svg/DashboardIcons/Patient.svg';
    this.imageService.getProfileData().subscribe(
      (data) => {
        this.details = data.userProfile;
        localStorage.setItem(
          'currentUserName',
          this.details?.firstName + ' ' + this.details?.lastName
        );
        this.userName = this.details?.firstName + ' ' + this.details?.lastName;
        this.name = this.details?.firstName + ' ' + this.details?.lastName;
        this.profileImg = this.details?.profileImage?.image
          ? this.s3BaseUrl + this.details?.profileImage?.image
          : defaultImg;

        this.sideNavService.setProfileImage(this.profileImg);

        if (this.details?.hospitalprovideAccessDetails) {
          this.provideAdminAccess =
            this.details?.hospitalprovideAccessDetails?.provideAccess;

          localStorage.setItem('adminAccess', this.provideAdminAccess);
        }
        // this.downloadProfileIcon();
        localStorage.setItem(
          'hospitalName',
          this.details?.hospitalprovideAccessDetails &&
            this.details?.hospitalprovideAccessDetails['hospitalName']
        );
        let roles = ['RPM_ADMIN', 'HOSPITAL_USER', 'FACILITY_USER'];
        if (!roles.includes(this.userRole)) {
          this.getUnitSettings();
        }
      },
      (err) => {
        if (err.status == 401) {
          this.router.navigate(['/login']);
        }
        // else this.snackBarService.error(err.error?.message);
      }
    );
  }
  getFullName() {
    return this.userName;
    // return (
    //   this.titlecasePipe.transform(value.firstName) +
    //   ' ' +
    //   this.titlecasePipe.transform(value.middleName ? value.middleName : '') +
    //   ' ' +
    //   this.titlecasePipe.transform(value.lastName)
    // );
  }
  getUnitSettings() {
    this.settingsStateService
      .getStoredSettings(this.roleId)
      .subscribe((res: UnitSettings) => {
        this.unitSettingsRes = res;
        this.notificationToggle = this.unitSettingsRes.notification;
        this.notification = this.notificationToggle ? 'On' : 'Off';
        this.weightToggle = res.lbs ? false : true;
        this.feetToggle = res.feet ? false : true;
        this.weight = res.lbs ? 'lbs' : 'kg';
        this.height = res.feet ? 'inches' : 'cms';
      });
  }

  openNotification(drawer) {
    this.isNotificationBtnClicked = true;
    this.caregiverSharedService.changePatientDrawer(true);
    this.caregiverSharedService.changeMatDrawer(drawer);
    const notificationModalConfig: MatDialogConfig = {
      width: '485px',
      height: '300px',
      position: { right: `15vw`, top: '8vh' },
      disableClose: false,
      data: drawer,
      panelClass: 'notification-dialog-large',
    };
    this.mediaSub = this.mediaObserver
      .asObservable()
      .pipe(
        filter(
          (change: MediaChange[]) =>
            change[0].mqAlias === 'md' || change[0].mqAlias === 'lg'
        )
      )
      .subscribe((res) => {
        if (res[0].mqAlias === 'md') {
          notificationModalConfig.height = '45em';
          notificationModalConfig.position = { right: `10vw`, top: '8vh' };
          notificationModalConfig.panelClass = 'notification-dialog-medium';
          if (
            !this.isNotificationDialogActive &&
            this.isNotificationBtnClicked
          ) {
            this.openDialog(notificationModalConfig);
          }
        }
        if (res[0].mqAlias === 'lg') {
          notificationModalConfig.height = '45em';
          notificationModalConfig.position = { right: `15vw`, top: '9vh' };
          notificationModalConfig.panelClass = 'notification-dialog-large';
          if (
            !this.isNotificationDialogActive &&
            this.isNotificationBtnClicked
          ) {
            this.openDialog(notificationModalConfig);
          }
        }
      });
  }
  openDialog(config): void {
    const notificationConfig: MatDialogConfig = {
      disableClose: false,
      width: '385px',
      height: '185px',
    };
    this.isNotificationDialogActive = true;
    this.matDialogService
      .openDialog(NotificationDialogComponent, config)
      .afterClosed()
      .subscribe((e) => {
        this.isNotificationDialogActive = false;
        this.isNotificationBtnClicked = false;
        // this.notificationCount(this.caregiverId);
      });
  }

  openResetPassword() {
    const passwordResetModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '625px',
      height: '650px',
      panelClass: 'reset-dialog-container',
    };
    this.dialog
      .open(ResetPasswordComponent, passwordResetModalConfig)
      .afterClosed()
      .subscribe((e) => {});
  }

  openPatients() {
    if (this.route.routeConfig.path == 'caregiverDashboard') {
      this.router.navigate(['/caregiverDashboard/totalPatients', 'caregiver']);
    } else {
      this.router.navigate(['/careproviderDashboard/totalPatients', 'doctor']);
    }
    this.caregiverSharedService.changeMessage([]);
  }

  getCount() {
    if (this.leavingComponent) {
      return;
    }
    if (
      this.userRole === 'CAREPROVIDER' ||
      this.userRole === 'CARECOORDINATOR'
    ) {
      if (this.route.routeConfig?.path === 'careproviderDashboard') {
        this.filterService.tabCountData.subscribe((res) => {
          this.count = res?.data?.noOfPatient;
        });
        // this.service.getTabCounts().subscribe((data) => {
        //   console.log(data);

        //   this.tabDetails=data
        //   console.log('one');
        //   // this.filterService.tabCountData.next({
        //   //   data:this.tabDetails
        //   // });

        //   this.count = data.noOfPatient;
        // });
      } else {
        this.filterService.tabCountData.subscribe((res) => {
          this.count = res.noOfPatient;
        });
        // this.service.getTabCounts().subscribe((data) => {
        //   console.log('two');
        //   this.count = data.noOfPatient;
        // });
      }
    }
  }
  onClickProfile(): void {
    this.sideNavService.setProfileOpened(true);
    this.sideNavService.setProfileImage(this.profileImg);
    this.sideNavService.setUserDetails(this.profileData);
  }

  uploadImage(event) {
    if (event.target.files?.length > 0) {
      if (
        event.target.files[0].type.includes('png') ||
        event.target.files[0].type.includes('jpg') ||
        event.target.files[0].type.includes('jpeg')
      ) {
        const file = event.target.files[0];
        const type = event.target.files[0].type;
        const document = file;
        const body = new FormData();
        body.append('file', document);

        this.docService.uploadProfile(body).subscribe(
          (res) => {
            this.snackBarService.success(
              'Profile picture uploaded successfully'
            );

            this.authStateService.setUserLoggedIn(true);
            setTimeout(() => {
              this.getProfileDetails();
            }, 1000);
            event.target.value = '';
            // this.prescriptions(this.patientId);
          },
          (err) => {
            if (err.status == 401) {
              this.router.navigate(['/login']);
            } else {
              // this.snackBarService.error(err.error.message);
            }
          }
        );
      } else {
        this.snackBarService.error('Upload only png, jpg and jpeg file');
      }
    } else {
      // this.snackBarService.error('File not supported', 2000);
    }
  }

  getOverlay(event) {
    if (event) {
      this.overlayOn = false;
    }
  }

  openNav(drawer, data) {
    if (data === 'call') {
      this.showCallSchedule = true;
      drawer.toggle();
      this.overlayOn = true;
      this.showAppt = false;
      this.caregiverSharedService.changeScheduleCallDrawer(true);
      this.caregiverSharedService.changeDrawerToggled(true);
    } else {
      this.showCallSchedule = false;
      this.showAppt = true;
      drawer.toggle();
      this.overlayOn = true;
    }
    this.caregiverSharedService.changePatientDrawer(true);
  }
  getCancelCallInfo(evt) {
    if (evt) {
      this.getScheduledCallList('INITIATED');
    }
  }
  getScheduledCallList(status) {
    this.service
      .filterScheduleCallByDate(
        this.caregiverSharedService.formatDate(this.scheduleDate),
        status ? status : 'INITIATED',
        0,
        10
      )
      .subscribe(
        (res) => {
          this.scheduledCallList = res['content'];
          this.scheduledCallCount = res['content'].length;
          localStorage.setItem('scheduleCount', this.scheduledCallCount);
          // this.showCallSchedule = true;
          // this.caregiverSharedService.changeSchedule({
          //   call: this.scheduledCallList,
          // });
        },
        (err) => {
          if (err.status == 401) {
            this.router.navigate(['/login']);
          } else {
            // this.snackBarService.error(err.message);
          }
        }
      );
  }
  getCallCount(evt) {
    if (evt) {
      this.scheduledCallCount = evt.length;
    }
  }
  getSearchValues(evt) {
    if (evt) {
      //
      this.getScheduledCallList('INITIATED');
    }
  }
  displaySettings() {
    this.showSettings = !this.showSettings;
  }

  unitConversion(data: string): void {
    this.notification = this.notificationToggle ? 'On' : 'Off';
    if (data === 'wt') {
      if (this.weight === 'lbs') {
        this.weight = 'kg';
      } else if (this.weight === 'kg') {
        this.weight = 'lbs';
      }
      const body = {
        userId: this.roleId,
        notification: this.notification,
        lbs: this.weight === 'lbs' ? true : false,
        feet: this.height === 'inches' ? true : false,
      };
      this.settingsStateService
        .updateSettings(this.roleId, body)
        .subscribe((res) => {
          this.getUnitSettings();
        });
      this.settingsStateService.setWeightUnit(this.weight);
    } else if (data === 'ht') {
      if (this.height === 'inches') {
        this.height = 'cms';
      } else if (this.height === 'cms') {
        this.height = 'inches';
      }

      const body = {
        userId: this.roleId,
        notification: this.notificationToggle === true ? false : true,
        lbs: this.weight === 'lbs' ? true : false,
        feet: this.height === 'inches' ? true : false,
      };
      this.settingsStateService.setHeightUnit(this.height);
      this.settingsStateService
        .updateSettings(this.roleId, body)
        .subscribe((res) => {});
    } else if (data === 'nt') {
      if (this.notification === 'On') {
        this.notification = 'Off';

        const body = {
          userId: this.roleId,
          lbs: this.weight === 'lbs' ? true : false,
          feet: this.height === 'inches' ? true : false,
          notification: this.notificationToggle === true ? false : true,
        };
        this.settingsStateService
          .updateSettings(this.roleId, body)
          .subscribe((res) => {});
      } else if (this.notification === 'Off') {
        this.notification = 'On';
        const body = {
          userId: this.roleId,
          lbs: this.weight === 'lbs' ? true : false,
          feet: this.height === 'inches' ? true : false,
          notification: this.notificationToggle === true ? false : true,
        };
        this.settingsStateService
          .updateSettings(this.roleId, body)
          .subscribe((res) => {});
      }
    }
  }
}
