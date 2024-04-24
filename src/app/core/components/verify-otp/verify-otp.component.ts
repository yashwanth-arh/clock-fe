import { environment } from 'src/environments/environment';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissionGroups } from 'src/app/shared/entities/user-permission-groups';
import { User } from 'src/app/shared/models/user.model';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
  public title = '2 Step Authentication';
  public showResendCodeLink: boolean;
  private otp: number;
  public validOTP: boolean;
  private username: string;
  private password: string;
  private authenticationFlag: boolean;
  public otpConfig = {
    length: 6,
    inputClass: 'otp-input-box',
    allowNumbersOnly: true,
    disableAutoFocus: false,
  };
  public returnUrl: string;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  constructor(
    public dialogRef: MatDialogRef<VerifyOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private snackService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private pushNotificationService: PushNotificationService
  ) {
    this.showResendCodeLink = true;
    this.validOTP = false;
    this.username = data.username;
    this.password = data.password;
    this.authenticationFlag = environment.authentication_flag;
    this.pushNotificationService.requestPermission();
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams.returnUrl ||
      localStorage.getItem('returnUrl') ||
      '/app/home';
  }

  onOTPChange(event: any): void {
    if (event.length === 6) {
      this.validOTP = true;
      this.otp = event;
    } else {
      this.validOTP = false;
      this.otp = undefined;
    }
  }

  verifyOtp(): void {
    if (this.otp && this.username) {
      this.authService.verifyOTP(this.username, this.otp).subscribe(
        (data: User) => {
          const userRole = data.userDetails.userRole;
          if (userRole) {
            if (userRole === 'CAREPROVIDER') {
              this.router.navigate(['/caregiverDashboard/patientReadings']);
            } else {
              data.userDetails.permissions =
                UserPermissionGroups[userRole].permissions;
              if (userRole === 'RPM_ADMIN') {
                this.router.navigate(['/home/dashboard']).then(() => {
                  // window.location.reload();
                });
              } else if (userRole === 'BRANCH_USER') {
                this.router.navigate(['/home/dashboard']).then(() => {
                  // window.location.reload();
                });
              } else if (userRole === 'hospital_USER') {
                this.router.navigate(['/home/dashboard']).then(() => {
                  // window.location.reload();
                });
              }
            }
          }
          localStorage.setItem('auth', JSON.stringify(data));
          localStorage.setItem('username', data.userDetails.username);
          this.authStateService.setBaseResource(data.baseResourcePath);
          this.authStateService.setUserLoggedIn(true);
          this.authStateService.setRole(userRole);
          this.authService.authSubject.next(data);
          this.dialogRef.close();
        },
        (error) => {
          this.snackService.error('OTP is invalid/expired!', 3000);
        }
      );
    }
  }

  onResendOTP(): void {
    const fcmToken = localStorage.getItem('fcmToken');
    if (this.username && this.password) {
      this.showResendCodeLink = false;
      this.authService
        .login(this.username, this.password, this.authenticationFlag, fcmToken)
        .subscribe(() => {});
    }
    setTimeout(() => {
      this.showResendCodeLink = true;
    }, 20000);
  }
}
