import { User } from './../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService } from './../core/services/app-notification.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { VerifyOtpComponent } from './../core/components/verify-otp/verify-otp.component';
import { UserPermissionGroups } from './../shared/entities/user-permission-groups';
import { environment } from 'src/environments/environment';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { first, last } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { UserRoles } from '../shared/entities/user-roles.enum';
import { emailRx } from '../shared/entities/routes';
import { CaregiverSharedService } from '../CareproviderDashboard/caregiver-shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  enableOtpPage: boolean;
  otpForm: FormGroup;
  validOtp: any;
  enableResendOTP: boolean = false;
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  errorMessage(errorMessage: any) {
    throw new Error('Method not implemented.');
  }
  public loginForm: FormGroup;
  showLoader = false;
  public loading = false;
  public submitted = false;
  public twoFactorAuthRequired: boolean;
  public returnUrl: string;
  public authenticationFlag: boolean;
  public ipAddress: string;
  hide = false;
  fieldTextType: boolean;
  hideEyeSrc: string = 'assets/svg/DashboardIcons/eye.svg';
  showEyeSrc: string = 'assets/svg/DashboardIcons/eye-off.svg';
  signInSrc: string = 'assets/svg/SignIn.svg';
  static loginForm: any;
  display: any;
  public timerInterval: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authStateService: AuthStateService,
    public forgotPasswordModal: MatDialog,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private pushNotificationService: PushNotificationService,
    private appnotificationService: AppNotificationService,
    private sharedService: CaregiverSharedService,
    private http: HttpClient // private _compiler: Compiler
  ) {
    this.authenticationFlag = environment.authentication_flag;
    // this._compiler.clearCache();
    //

    // window.addEventListener('orientationchange', (event)=>{
    // if(screen.orientation.type==='portrait-primary' || screen.orientation.type==='portrait-secondary') {
    // });
  }

  // ngAfterViewInit() {;
  //   // if (window.screen.width < window.screen.height) {;
  //   //   this.hide = true;
  //   // } else if (window.screen.width > window.screen.height) {;
  //   //   this.hide = false;
  //   // };
  // };

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(emailRx),
        ])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
      osType: ['Win64'],
      osVersion: ['10'],
    });
    // debugger;
    const user = JSON.parse(localStorage.getItem('auth'));
    if (
      (this.route.snapshot.routeConfig.path === 'login' ||
        this.route.snapshot.routeConfig.path === '/') &&
      user['userDetails']?.sessionId
    ) {
      let roles = ['RPM_ADMIN', 'FACILITY_USER', 'HOSPITAL_USER'];
      const currentUrl = localStorage.getItem('current-url');
      if (localStorage.getItem('role') === 'CAREPROVIDER') {
        this.router.navigate([
          '/careproviderDashboard/careprovider-patient-list',
        ]);
      } else if (localStorage.getItem('role') === 'CARECOORDINATOR') {
        this.router.navigate([
          '/careproviderDashboard/careprovider-patient-list',
        ]);
      } else if (
        localStorage.getItem('role') === 'RPM_ADMIN' ||
        localStorage.getItem('role') === 'FACILITY_USER' ||
        localStorage.getItem('role') === 'HOSPITAL_USER'
      ) {
        if (localStorage.getItem('current-url')) {
          this.router.navigate([`/home/${currentUrl}`]);
          localStorage.setItem('current-url', 'dashboard');
        } else {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem('current-url', 'dashboard');
        }
        this.router.navigate(['/home/dashboard']);
      }
    } else {
      localStorage.clear();
    }
    // history.pushState(null, null, window.location.href);
    // history.back();
    // window.onpopstate = () => history.forward();
    const sessionData = JSON.parse(localStorage.getItem('sessionExpired'));
    // if (sessionData) {
    //   localStorage.setItem('sessionExpired', JSON.stringify(false));
    //   // this.snackBarService.error('Session Expired');
    // }
    this.pushNotificationService.requestPermission();
    // this.authService.setIsLoggedIn(false);

    this.returnUrl =
      this.route.snapshot.queryParams.returnUrl ||
      localStorage.getItem('returnUrl') ||
      '/app/home';
    // localStorage.clear();
    localStorage.setItem('osType', window.navigator.platform);
  }
  onMouseSignInOver() {
    this.signInSrc = 'assets/svg/Sign In.svg';
  }
  onMouseSihnInOut() {
    this.signInSrc = 'assets/svg/SignIn.svg';
  }
  // convenience getter for easy access to form fields
  get fields() {
    return this.loginForm.controls;
  }
  getErrorEmail(): string {
    return this.loginForm.get('username').hasError('required')
      ? 'Email is required'
      : this.loginForm.get('username').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }
  getErrorPassword(): string {
    return this.loginForm.get('password').hasError('required')
      ? 'Password is required'
      : '';
  }

  otp(e) {
    this.validOtp = e;
  }

  onLogin(event): void {
    event.preventDefault();
    const currentUrl = localStorage.getItem('current-url');
    this.submitted = true;
    if (
      !this.loginForm.controls.username.value ||
      !this.loginForm.controls.password.value
    ) {
      this.snackBarService.error('Enter proper email and password');
      this.submitted = false;
      return;
    }
    this.showLoader = true;
    const fcmToken = localStorage.getItem('fcmToken');
    if (this.authenticationFlag) {
      this.loginForm.addControl(
        'flag',
        this.formBuilder.control(
          true,
          Validators.compose([Validators.required])
        )
      );
    } else {
      this.loginForm.addControl(
        'flag',
        this.formBuilder.control(
          false,
          Validators.compose([Validators.required])
        )
      );
    }

    this.loginForm.addControl(
      'uid',
      this.formBuilder.control(
        fcmToken,
        Validators.compose([Validators.required])
      )
    );
    this.authService
      .login(
        this.fields.username.value.toLowerCase(),
        this.fields.password.value,
        this.fields.flag.value,
        this.fields.uid.value
        // this.fields.osType.value,
        // this.fields.osVersion.value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.enableResendOTP = false;
          this.display = '';
          this.stop();
          this.timer(data['duration']);
          setTimeout(() => {
            this.enableOtpPage = true;
            this.showLoader = false;
          }, 1000);
          this.sharedService.changeLoggedIn(true);
        },
        (error) => {
          this.enableOtpPage = false;
          this.submitted = false;
          this.showLoader = false;
        }
      );
  }
  onLoginValidOtp(event) {
    event.preventDefault();
    let roles = ['RPM_ADMIN', 'FACILITY_USER', 'HOSPITAL_USER'];
    const currentUrl = localStorage.getItem('current-url');
    this.submitted = true;
    // if (
    //   !this.loginForm.controls.username.value ||
    //   !this.loginForm.controls.password.value
    // ) {
    //   this.snackBarService.error('Enter proper email and password');
    //   this.submitted = false;
    //   return;
    // }
    this.showLoader = true;
    const fcmToken = localStorage.getItem('fcmToken');
    if (this.authenticationFlag) {
      this.loginForm.addControl(
        'flag',
        this.formBuilder.control(
          true,
          Validators.compose([Validators.required])
        )
      );
    } else {
      this.loginForm.addControl(
        'flag',
        this.formBuilder.control(
          false,
          Validators.compose([Validators.required])
        )
      );
    }

    this.loginForm.addControl(
      'uid',
      this.formBuilder.control(
        fcmToken,
        Validators.compose([Validators.required])
      )
    );
    this.authService
      .OtpAuthenticate(
        this.fields.username.value.toLowerCase(),
        this.validOtp ? this.validOtp : null,
        this.fields.flag.value,
        this.fields.uid.value
        // this.fields.osType.value,
        // this.fields.osVersion.value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          // debugger;
          const sessionId = data?.userDetails['sessionId'].toString();
          localStorage.setItem('sessionId', sessionId);
          this.enableOtpPage = true;
          this.showLoader = false;
          this.sharedService.changeLoggedIn(true);
          const userRole = data.userDetails.userRole;
          localStorage.setItem('s3BaseUrl', data['s3BaseUrl']);
          localStorage.setItem('username', data.userDetails.username);

          localStorage.setItem(
            'currentUserName',
            data.userDetails['firstName'] + ' ' + data.userDetails['lastName']
          );
          localStorage.setItem('currentUserId', data.userDetails['scopeId']);

          if (userRole === UserRoles.CAREPROVIDER) {
            data.userDetails.permissions =
              UserPermissionGroups[userRole].permissions;
          }

          if (userRole === 'CAREPROVIDER') {
            this.router.navigate([
              '/careproviderDashboard/careprovider-patient-list',
            ]);
          } else if (userRole === 'CARECOORDINATOR') {
            this.router.navigate([
              '/careproviderDashboard/careprovider-patient-list',
            ]);
          } else if (roles.includes(userRole)) {
            data.userDetails.permissions =
              UserPermissionGroups[userRole].permissions;
            if (currentUrl) {
              this.router.navigate([`/home/${currentUrl}`]);
            } else {
              localStorage.clear();
              sessionStorage.clear();
              localStorage.setItem('current-url', 'dashboard');
            }
            this.router.navigate(['/home/dashboard']);
          }

          localStorage.setItem('auth', JSON.stringify(data));
          let inputString = data.baseResourcePath;
          if (inputString.startsWith('/')) {
            inputString = inputString.substring(1);
            this.authStateService.setBaseResource(inputString);
          }
          localStorage.setItem('baseResource', inputString);
          this.authStateService.setUserLoggedIn(true);
          this.authStateService.setRole(userRole);
          this.authService.authSubject.next(data);
          this.submitted = false;
          this.stop();
          this.updateUID(
            this.fields.username.value.toLowerCase(),
            this.fields.uid.value
          );
        },
        (error) => {
          this.submitted = false;
          this.showLoader = false;
        }
      );
  }
  updateUID(email, uid) {
    if (uid) {
      this.authService.updateUID(email, uid).subscribe((res) => {});
    }
  }
  goToLogin() {
    this.enableOtpPage = false;
  }
  loginStatus() {
    const body = {
      browserAgent: 'chrome',
      ip: this.ipAddress,
    };
    this.appnotificationService.postloginDetails(body).subscribe((res) => {});
  }
  forgotPassword(): void {
    // debugger;
    this.router.navigate(['/forgot-password']);
  }

  openOTPDiaglog(): void {
    this.dialog.open(VerifyOtpComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        username: localStorage.getItem('username'),
        password: this.fields.password.value,
      },
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // OTP Timer

  // start() {
  //   this.timer(1);
  // }
  stop() {
    clearInterval(this.timerInterval);
  }

  timer(minute) {
    // let minute = 1;

    this.display = '';
    let seconds: number = minute;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.enableResendOTP = true;
        // this.snackBarService.error('OTP is expired! Please resend OTP.');
        this.stop();
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
}
