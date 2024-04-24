import { SnackbarService } from './../../core/services/snackbar.service';
import { AuthService } from './../../core/services/auth.service';
import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  public submitted = false;
  mailSend = false;
  userRole: string;
  roleid: string;
  email: string;
  hideEyeSrc = 'assets/svg/DashboardIcons/Hide.svg';
  showEyeSrc = 'assets/svg/DashboardIcons/View.svg';
  oldFieldTextType: boolean;
  newFieldTextType: boolean = false;
  reNewFieldTextType: boolean = false;

  @Output() triggeredMailSend = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private auth: AuthService,
    public snackbarService: SnackbarService,
    private service: CaregiverDashboardService,
    private router: Router
  ) {
    // this.roleId = this.auth.authData.userDetails['id'];
    this.email = this.auth?.authData?.userDetails['username'];
    //
  }
  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', Validators.required, Validators.minLength(8)],
      reNewPassword: ['', Validators.required, Validators.minLength(8)],
      existingPassword: ['', Validators.required, Validators.minLength(8)],
    });
    // this.resetForm.reset();
    // this.resetForm.markAsUntouched();
    // this.resetForm.get('newPassword').untouched;
    // this.resetForm.get('reNewPassword').untouched;
    // this.resetForm.get('existingPassword').untouched;
  }

  get fields() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    const body = {
      existingPassword: this.resetForm.get('existingPassword').value,
      newPassword: this.resetForm.get('newPassword').value,
      reNewPassword: this.resetForm.get('reNewPassword').value,
    };
    if (this.resetForm.invalid) {
      this.snackbarService.error('Enter valid details');
      return;
    }
    if (!this.snackbarService.validRegex) {
      this.snackbarService.error('Enter valid details');
      return;
    }
    if (
      this.resetForm.get('newPassword').value !=
      this.resetForm.get('existingPassword').value
    ) {
      if (
        this.resetForm.get('newPassword').value ==
        this.resetForm.get('reNewPassword').value
      ) {
        this.service.resetPassword(body).subscribe(
          () => {
            this.snackbarService.success('Password reset successfully');
            this.mailSend = true;
            this.triggeredMailSend.emit(true);
            // this.snackbarService.validRegex = false;
            // this.snackbarService.validRegexRenew = false;
            this.onLogout();
            // this.router.navigate(['/login']);
          },
          (err) => {
            if (err.error.message == 'invalid role') {
              this.snackbarService.error('Incorrect old password');
            } else {
              this.snackbarService.error(err.error.message);
            }
          }
        );
      } else {
        this.snackbarService.error('Password did not matched');
      }
    } else {
      this.snackbarService.error(
        'New password must be different from old password.'
      );
    }
  }

  onLogout(): void {
    this.dialogRef.close();
    // this.auth.logout();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleFieldTextType(type) {
    if (type == 'old') {
      this.oldFieldTextType = !this.oldFieldTextType;
    } else if (type == 'new') {
      this.newFieldTextType = !this.newFieldTextType;
    } else if (type == 'reNew') {
      this.reNewFieldTextType = !this.reNewFieldTextType;
    }
  }
}
