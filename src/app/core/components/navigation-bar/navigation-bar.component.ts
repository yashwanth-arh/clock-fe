import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { ROUTEINFO } from 'src/app/shared/entities/route.info';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { User } from 'src/app/shared/models/user.model';
import {
  UserProfile,
  UserProfileResponse,
} from 'src/app/shared/entities/user-profile';
import { AuthService } from '../../services/auth.service';
import { SidenavService } from '../../services/sidenav.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ToolbarService } from '../../services/toolbar.service';
import { defaultProfileImage } from 'src/app/shared/base64/profile-image';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MonthRangeSelectionStrategy } from '../../strategy/month-range-selection.strategy';
import moment from 'moment';
import { AppNotificationService } from '../../services/app-notification.service';
import { NotificationCountStateService } from '../../services/notification-count-state.service';
import { RedirectServiceService } from 'src/app/services/redirect-service.service';
import { AuthStateService } from '../../services/auth-state.service';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { ImgUploadService } from '../image-upload/img-upload.service';
import { FilterSharedService } from '../../services/filter-shared.service';
import { AllFiltersComponent } from '../all-filters/all-filters.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MonthRangeSelectionStrategy,
    },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  public routeDetails: ROUTEINFO;
  @Input() Headername: any;
  @Input() logCount: number;
  @Output() clickEvent = new EventEmitter<string>();
  @Output() downloadclickEvent = new EventEmitter<string>();
  @Output() backEvent = new EventEmitter<string>();
  @Output() dateRangeSelectEvent = new EventEmitter<string>();
  @Output() bulkEvent = new EventEmitter<string>();
  enable!: boolean;
  public fullscreen = true;
  public selectedRole: UserRoles;
  searchGroup: FormGroup;
  public userName: string;
  public label: string;
  showReturnClinic: any;
  public shapeofProfileImage: string;
  private defaultProfileImg = defaultProfileImage;
  public userRoles = UserRoles;
  public profileImagePath: SafeResourceUrl = '';
  public profileData: UserProfile;
  public profileName: string;
  public dateRangeForm: FormGroup;
  public notificationCount: number;
  public notificationPermission: UserPermission =
    UserPermission.HAS_NOTIFICATION_COUNT;
  public hasNotification: boolean;
  name: any;
  names: any;
  statusTitle: any = 'open';
  statusTitleName: string;
  tabInfo: any;
  role: string;
  settingsTabs: any;
  settingsTab: any;
  leaderBoardPatientName: string;
  @ViewChild('filters') filters: AllFiltersComponent;
  adminAccess: string;
  userRole: UserRoles;
  s3BaseUrl: any;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public navService: SidenavService,
    public toolbarService: ToolbarService,
    private sideNavService: SidenavService,
    private domSanitizerService: DomSanitizer,
    private appNotificationService: AppNotificationService,
    private notificationCountService: NotificationCountStateService,
    public redirectService: RedirectServiceService,
    private imageService: ImgUploadService,
    private filterService: FilterSharedService
  ) {
    this.leaderBoardPatientName = activeRoute.queryParams['_value'].name;
    this.hasNotification = false;
    const user = this.authService.authData;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.s3BaseUrl = authDetails?.s3BaseUrl;
    this.userRole = user?.userDetails?.userRole;
    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
      this.name = user?.userDetails?.['name'];

      if (
        user?.userDetails?.permissions?.some(
          (permission) => permission === this.notificationPermission
        )
      ) {
        this.hasNotification = true;
        interval(120000).subscribe(() => {
          //

          this.appNotificationService
            .getNotificationCount()
            .subscribe((data) => {
              this.notificationCountService.setCount(data.notificationCount);
            });
        });
        this.notificationCountService.notificationCountObs.subscribe((data) => {
          this.notificationCount = data;
        });
      } else {
        this.notificationCount = 0;
      }
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.adminAccess = localStorage.getItem('adminAccess');

    this.searchGroup = this.fb?.group({
      searchSupport: [''],
    });

    this.showReturnClinic = this.activeRoute.snapshot?.queryParams?.org_id
      ? this.activeRoute.snapshot?.queryParams?.org_id
      : this.activeRoute.snapshot?.queryParams?.orgId
      ? this.activeRoute.snapshot?.queryParams?.orgId
      : '';
    this.authService.user.subscribe((user: User) => {
      if (user) {
        this.selectedRole = user?.userDetails?.userRole;
        this.userName = user?.userDetails?.username;
      }
    });
    this.profileImagePath =
      this.domSanitizerService.bypassSecurityTrustResourceUrl(
        this.defaultProfileImg
      );
    // this.getProfile();
    // this.label = this.toolbarService.getToolbarLabelObs();
    this.toolbarService.getToolbarLabelObs().subscribe((res) => {
      if (res && res['providerName']) {
        this.label = res['providerName'];
      }
    });

    this.shapeofProfileImage = 'Rounded';

    /**
     * date range form
     */

    const startOfMonth = moment().clone().startOf('month').format('MM/DD/YYYY');
    const endOfMonth = moment().clone().endOf('month').format('MM/DD/YYYY');

    this.dateRangeForm = this.fb.group({
      start: [new Date(startOfMonth)],
      end: [new Date(endOfMonth)],
    });
    // this.filterService.settingTypeTabsCall({});
    this.filterService.settingTypeTabs.subscribe((res) => {
      this.settingsTabs = res;
    });
    this.filterService.subModule.subscribe((res) => {
      this.settingsTab = res;
    });
    this.filterService.subModule.subscribe((res) => {
      if (res) {
        if (res === 'Program Coordinators') {
          this.tabInfo = 'Add Program Coordinator';
        } else if (res === 'Care Providers') {
          this.tabInfo = 'Add Care Provider';
        } else {
          this.tabInfo = 'Add' + ' ' + res;
        }

        if (this.selectedRole === 'RPM_ADMIN' && res === 'Support Tickets') {
          this.routeDetails.showActionBtn = false;

          // this.statusTitleName = 'Open';
        } else if (res === 'Devices' && this.selectedRole !== 'RPM_ADMIN') {
          this.routeDetails.showActionBtn = false;
        } else {
          this.routeDetails.showActionBtn = true;
        }
      }
    });
  }
  ngAfterViewInit(): void {
    this.routeDetails = this.activeRoute.snapshot.data;

    // let users = ['FACILITY_USER', 'HOSPITAL_USER']
    if (this.adminAccess) {
      if (this.adminAccess == 'false') {
        this.routeDetails.showActionBtn = false;
      }
    }
  }
  resetStatusFilter() {
    this.filters.unselectGlobalSearchFacilities();
    this.filters.unselectHospitalStatus();
    this.filters.unselectDeviceStatus();
    this.filters.unselectDeviceType();
    this.filters.unselectGlobalSearchUser();
    this.filters.unselectGlobalSearchFacilityAdmin();
    this.filters.unselectGlobalSearchDeviceInfo();
    this.filters.unSelecthospitalAdminsstatus();
  }
  open(e) {
    this.statusTitle = e.value;
    this.filterService.supportTicketStatus({
      searchQuery: e.value,
    });
  }
  showIcon() {
    if (this.statusTitleName && this.statusTitleName === 'Open') {
      return false;
    } else if (
      this.routeDetails?.title === 'Device Info' &&
      this.tabInfo === 'Devices'
    ) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.toolbarService.setToolbarLabel(null);
  }

  emitClickEventToParent(value: string): void {
    this.clickEvent.emit(value);
  }
  emitDownloadClickEventToParent(): void {
    this.downloadclickEvent.emit();
  }
  emitBulkEventToParent(value: string): void {
    this.bulkEvent.emit(value);
  }

  onClickProfile(): void {
    setTimeout(() => {
      this.getProfile();
    }, 1000);
    this.sideNavService.setProfileOpened(true);
    // this.sideNavService.setProfileImage(this.profileImagePath);
    this.sideNavService.setUserDetails(this.profileData);
  }

  onLogout(): void {
    this.authService.logout();
  }
  public getProfile(): void {
    this.imageService.getProfileData().subscribe(
      (res: UserProfileResponse) => {
        this.profileData = res.userProfile;
        let urlencodeStr = '';
        if (res.userProfile !== undefined) {
          if (
            res.userProfile?.profileImage &&
            res.userProfile?.profileImage?.image
          ) {
            urlencodeStr = `data: ${res.userProfile?.profileImage.memeType};base64,${res.userProfile?.profileImage.image}`;
          } else {
            urlencodeStr = this.defaultProfileImg;
          }
        } else {
          urlencodeStr = this.defaultProfileImg;
        }
        this.profileImagePath = `${this.s3BaseUrl}${res.userProfile?.profileImage?.image}`;
        // this.profileImagePath =
        //   this.domSanitizerService.bypassSecurityTrustResourceUrl(urlencodeStr);
        // this.sideNavService.setProfileImage(this.profileImagePath);
      },
      (error) => {
        this.profileImagePath =
          this.domSanitizerService.bypassSecurityTrustResourceUrl(
            this.defaultProfileImg
          );
        // this.snackBarService.error(error.message);
      }
    );
  }

  emitGoBackEventToParent(value: string): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.toolbarService.setToolbarLabel(params.name);
      this.backEvent.emit(value);
    });
  }
  emitDatePickerEventToParent(value): void {
    const dates = JSON.stringify(value);
    this.dateRangeSelectEvent.emit(dates);
  }

  onExpand(): void {
    this.navService.navExpanded.subscribe((data) => {
      this.navService.setNavExpanded(!data);
      this.fullscreen = !data;
    });
  }

  // public getProfile(): void {
  //   this.imageService.getProfileData().subscribe((res: UserProfileResponse) => {
  //     this.profileData = res.userProfile;
  //     let urlencodeStr = '';
  //     if (res.userProfile !== undefined) {
  //       if (res.userProfile.profileImage && res.userProfile.profileImage.image) {
  //         urlencodeStr = `data: ${res.userProfile.profileImage.memeType};base64,${res.userProfile.profileImage.image}`;
  //       } else {
  //         urlencodeStr = this.defaultProfileImg;
  //       }
  //     }
  //     else {
  //       urlencodeStr = this.defaultProfileImg;
  //     }

  //     this.profileImagePath = this.domSanitizerService.bypassSecurityTrustResourceUrl(urlencodeStr);
  //   }, (error) => {
  //     this.profileImagePath = this.domSanitizerService.bypassSecurityTrustResourceUrl(this.defaultProfileImg);
  //   }
  //   );
  // }

  goToNotification(): void {
    this.router.navigate(['/notification']);
  }
}
