import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatAccordion } from '@angular/material/expansion';
import { ROUTE } from '../../../shared/entities/routes';
import { navigationRoutes } from '../../../shared/entities/sidenav.routes';
import { MatSidenav } from '@angular/material/sidenav';
import { LoaderService } from '../../services/loader.service';
import { SidenavService } from '../../services/sidenav.service';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { User } from 'src/app/shared/models/user.model';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { TooltipPosition } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserProfileService } from 'src/app/userprofile/service/user-profile.service';
import { LocationService } from '../../services/location.service';
import { SnackbarService } from '../../services/snackbar.service';
import { confirmControlValidatorAsync } from '../../validators/custom-validators';
import { SafeResourceUrl } from '@angular/platform-browser';
import { UserProfile } from 'src/app/shared/entities/user-profile';
import { AuthStateService } from '../../services/auth-state.service';
import { maskRx } from 'src/app/shared/entities/routes';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionService } from '../../services/connection.service';
import { OfflineComponent } from '../offline/offline.component';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ImgUploadService } from '../image-upload/img-upload.service';
import { ActivatedRoute } from '@angular/router';
import { FilterSharedService } from '../../services/filter-shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  navigationRoutes: ROUTE[] = navigationRoutes;
  public userRole: UserRoles;
  opened = true;
  expanded = true;
  isSideNavHeldOpened = false;
  isShowToolBar = true;
  toggleProfile = false;
  editProfile: FormGroup;
  resetForm: FormGroup;
  pswdRegex: string | RegExp =
    '(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&#])[A-Za-zd@$!%*?&#]{8,15}';
  // specialCharRegex = /(?=.*\d.*)(?=.*\W.*)/;
  // numbersRegex = /[0-9]/g;
  private changeTitle: UserPermission =
    UserPermission.CAN_CHANGE_ENROLLMENT_TITLE;
  public info =
    '1. The password length should be minimum of 8 characters. \n2. Password should be a mix of alphabets with a minimum of 1 \nupper case letter [A-Z], numericals and special characters ($#^&_~!@%*) \nwithout any space in between.';

  /**
   * Tooltip style
   */
  position: TooltipPosition = 'right';
  disabled = false;
  showDelay = 0;
  hideDelay = 0;
  showExtraClass = true;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  showSubMenu = false;

  public editMode = false;

  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  state: string[] = [];

  public selectedRole: UserRoles;
  public userRoles = UserRoles;
  public userDetails: any;
  public username: string;
  private destroyed = new Subject();
  public profileImagePath: SafeResourceUrl;
  private profileData: any;
  public isProfileLoaded: boolean;
  public isOnline: boolean;
  mask = maskRx;
  public offlineDialogBox: any;

  private mediaSub: Subscription;
  public activeImg: string = '';
  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    public authStateService: AuthStateService,
    public loaderService: LoaderService,
    public navService: SidenavService,
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private snackBarService: SnackbarService,
    private connectionService: ConnectionService,
    private dialog: MatDialog,
    private mediaObserver: MediaObserver,
    private route: ActivatedRoute,
    private filterService: FilterSharedService
  ) {
    //
    // localStorage.setItem('current-url', this.activeImg);
    this.isProfileLoaded = false;
    this.authStateService.userLoggedIn.subscribe((data) => {});
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        if (change.mqAlias == 'md') {
          this.navService.expanded.subscribe((value: boolean) => {
            this.expanded = false;
          });
        } else {
          this.navService.expanded.subscribe((value: boolean) => {
            this.expanded = value;
          });
        }
      }
    );

    this.authService.user.subscribe((user: User) => {
      if (user && user?.userDetails?.permissions) {
        this.userRole = user?.userDetails?.userRole;
        this.expanded = true; //user.userDetails.userRole === UserRoles.DOCTOR ? true : false;
        // if (user.userDetails.permissions.some(permission => permission === this.changeTitle)) {
        //   this.navigationRoutes[4].title = 'Patient Health Records';
        // } else {
        //   this.navigationRoutes[4].title = 'Enrollments';
        // }
      }
    });

    this.navService.profileImage.subscribe((val: SafeResourceUrl) => {
      this.profileImagePath = val;
    });

    this.resetForm = this.fb.group({
      existingPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/
          ),
        ],
      ],
      reNewPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/
          ),
        ],
      ],
    });
    this.navService.drawerOpened.subscribe((val: boolean) => {
      this.toggleProfile = val;
      this.profileImagePath = '';
      if (this.toggleProfile) {
        // this.resetForm.reset();
        this.resetForm.get('existingPassword').setValue('');
        this.resetForm.get('newPassword').setValue('');
        this.resetForm?.get('reNewPassword')?.setValue('');
        this.resetForm.markAsUntouched();
      }
    });
    navigationRoutes.map((e) => {
      if (e.title === 'Device Info' && this.userRole !== 'RPM_ADMIN') {
        e.title = 'Devices';
      } else if (e.title === 'Device Info' && this.userRole === 'RPM_ADMIN') {
        e.title = 'Device Info';
      }
    });
  }

  ngOnInit(): void {
    // if (
    //   !localStorage.getItem('current-url') &&
    //   this.route.snapshot.routeConfig.path == 'home'
    // ) {
    //   localStorage.setItem('current-url', 'dashboard');
    // }
    this.activeImg = localStorage.getItem('current-url');

    this.connectionService
      ?.connectionMonitor()
      .subscribe((checkInternet: boolean) => {
        this.isOnline = checkInternet;

        if (!this.isOnline) {
          this.showOfflineDialog();
        }
      });

    this.authService.user.subscribe(
      (user: User) => {
        if (user) {
          this.selectedRole = user?.userDetails?.userRole;
          this.username = user?.userDetails?.username;
          // this.navService.userDetails.subscribe(
          //   (data: UserProfile) => {
          //     this.userProfileService.getUserDetails().subscribe((res) => {
          //       this.profileData = res.userProfile;
          //       this.isProfileLoaded = true;
          //       this.editProfile =
          //         this.navService.generateProfileFormBasedOnRole(
          //           this.selectedRole,
          //           this.editProfile,
          //           this.profileData
          //         );
          //     });
          //   },
          //   () => {
          //     this.isProfileLoaded = false;
          //   }
          // );
        }
      },
      () => {
        this.isProfileLoaded = false;
      }
    );

    // this.locationService.getJSONData().subscribe((res: any) => {
    //   this.state = Object.keys(res);
    // });
    this.resetForm
      .get('newPassword')
      .valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.resetForm?.updateValueAndValidity({
          onlySelf: false,
          emitEvent: true,
        });
      });

    this.getRoute(this.activeImg);
  }
  toggleSubMenu(): void {
    this.showSubMenu = !this.showSubMenu;
  }

  togglMenu(): void {
    this.expanded = !this.expanded;
    // this.resetForm.get('existingPassword').clearValidators();
    // this.resetForm.get('newPassword').clearValidators();
    // this.resetForm.get('reNewPassword ').clearValidators();
    // this.resetForm.updateValueAndValidity()
  }

  /**
   * Toggles the sidenav component being held opened from menu button click
   */
  toggleNavHold(): void {
    this.isSideNavHeldOpened = !this.isSideNavHeldOpened;
    this.expanded = !this.expanded;
  }

  /**
   * Handles mouse enter on sidenav component to display full menu if it's not already opened
   */
  onMouseEnter(): void {
    if (!this.isSideNavHeldOpened) {
      this.expanded = true;
    }
  }

  /**
   * Handles mouse leave on sidenav component to hide full menu if it's being permanently
   * held by menu button
   */
  onMouseLeave(): void {
    if (!this.isSideNavHeldOpened) {
      this.expanded = true;
    }
  }

  /**
   * When the sidenav mode changes from side to over, user clicking someone else
   * causes it to close. This method overrides that and returns the mode to it's original value
   */
  checkClosed(): void {
    this.expanded = false;
    this.isSideNavHeldOpened = false;
    this.sidenav.opened = true;
  }

  /**
   * Resets the menu to original state
   */
  resetMenu(): void {
    this.expanded = true;
    this.opened = true;
    this.isSideNavHeldOpened = false;
  }

  userCall() {}
  onKeyPress(evt) {}
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
  }

  toggleEditMode(): boolean {
    return (this.editMode = !this.editMode);
  }

  get reNewPassword(): FormControl {
    return this.resetForm.get('reNewPassword ') as FormControl;
  }
  get newPassword(): FormControl {
    return this.resetForm.get('newPassword') as FormControl;
  }
  get oldPassword(): FormControl {
    return this.resetForm.get('existingPassword') as FormControl;
  }
  getErrorEmail(): any {
    return this.editProfile.get('emailId').hasError('required')
      ? 'Email Id is required'
      : this.editProfile.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.editProfile.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
  }

  getErrorHomeNo(): any {
    return this.editProfile.get('homeNumber').hasError('required')
      ? 'Home number is required'
      : this.editProfile.get('homeNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Home Number'
      : '';
  }

  getErrorCellNo(): any {
    return this.editProfile.get('cellNumber').hasError('required')
      ? 'Cell number is required'
      : this.editProfile.get('cellNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Cell Number'
      : '';
  }

  getErrorZipCode(): any {
    return this.editProfile.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.editProfile.get('zipCode').hasError('pattern')
      ? 'Please, Enter 5 digit Zip Code'
      : '';
  }
  getErrorContactNo(): any {
    return this.editProfile.get('contactNumber').hasError('required')
      ? 'contact Number is required'
      : this.editProfile.get('contactNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Home Number'
      : '';
  }

  passwordMatchValidator(): any {
    return this.resetForm.get('confirmPassword').hasError('required')
      ? 'Confirm password is required'
      : this.resetForm.get('newPassword').value ===
        this.resetForm.get('confirmPassowrd').value
      ? 'Confirm password not matching'
      : '';
  }

  onStateSelection(event: any): any {
    this.city = [];
    // this.locationService.getFilteredJSONData(event).subscribe((data: any[]) => {
    //   this.city = data;
    // });
  }
  getRoute(url) {
    // this.filterService.globalHospitalCall('');
    // this.filterService.statusPatientCall('');
    // this.filterService.statusHospitalCall('');
    this.filterService.subModuleCall('');
    // this.filterService.globalDeviceCall('');
    // this.filterService.deviceTypeFilterCall('');
    // this.filterService.settingTypeTabsCall('');
    // this.filterService.deviceStatusFilterCall('');
    // this.filterService.globalDeviceModelCall('');
    // this.filterService.configureSearchCall('');
    // this.filterService.LeadershipSearchField('');
    // this.filterService.globalCareProviderCall('');
    // this.filterService.statusCareProviderCall('');
    // this.filterService.globalCareCoordinatorCall('');
    // this.filterService.statusCareCoordinatorCall('');
    // this.filterService.globalHospitalAdminsCall('');
    // this.filterService.statusHospitalAdminsCall('');
    // this.filterService.globalFacilityAdminsCall('');
    // this.filterService.statusFacilityAdminsCall('');
    // this.filterService.supportTicketCall('');
    // this.filterService.supportTicketSearch('');
    // this.filterService. defaultTicketSearch('');

    this.activeImg = url;
    localStorage.setItem('current-url', url);
    localStorage.removeItem('currentDilaog');
  }
  onSubmit(): void {
    if (this.editProfile.invalid) {
      return;
    }
    const formValue = this.editProfile.value;
    let body: any;
    if (
      this.selectedRole === this.userRoles.hospital_USER ||
      this.selectedRole === this.userRoles.BRANCH_USER
      // this.selectedRole === this.userRoles.BILLER
    ) {
      body = {
        userProfile: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          middleName: formValue.middleName,
          contactNumber: formValue.contactNumber,
        },
      };
    } else if (this.selectedRole === this.userRoles.CAREPROVIDER) {
      body = {
        userProfile: {
          name: formValue.name,
          homeNumber: formValue.homeNumber,
          cellNumber: formValue.cellNumber,
        },
      };
    } else {
      /** RPM_Admin and BILLER */
      body = {
        userProfile: {
          name: formValue.name,
        },
      };
    }

    this.userProfileService.updateUserDetails(body).subscribe(
      (data) => {
        this.snackBarService.success('Updated successfully!', 2000);
        this.navService.setUserDetails(body.userProfile);
        // return this.navService.patchProfileFormBasedOnRole(
        //   this.selectedRole,
        //   this.editProfile,
        //   body.userProfile
        // );
        // window.location.reload();
      },
      (error) => {
        this.snackBarService.error('Update Failed!', 2000);
      }
    );
  }
  closeProfileDrawer() {
    this.formGroupDirective.resetForm();
    this.navService.setProfileOpened(false);
  }
  onResetPassword(): void {
    // this.getNewPassErr();
    if (this.resetForm.invalid) {
      return;
    }
    const formValue = this.resetForm.value;

    this.userProfileService.resetPassword(formValue).subscribe(
      (data) => {
        this.resetForm.reset();
        this.snackBarService.success('Password changed successfully!', 2000);
        this.navService.setProfileOpened(false);
        this.authService.logout();
      },
      (error) => {
        // this.snackBarService.error(error.message, 2000);
      }
    );
  }

  showOfflineDialog(): void {
    this.offlineDialogBox = this.dialog.open(OfflineComponent);
  }
  getNewPassErr() {
    return this.resetForm.get('newPassword').errors
      ? 'Enter valid password format'
      : '';
  }
}
