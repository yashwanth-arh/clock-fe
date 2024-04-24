import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { ForgotPasswordService } from '../forgot-password/service/forgot-password.service';
import { PatientActivationService } from './patient-activation.service';

@Component({
  selector: 'app-patient-account-activation',
  templateUrl: './patient-account-activation.component.html',
  styleUrls: ['./patient-account-activation.component.scss'],
})
export class PatientAccountActivationComponent implements OnInit {
  public activationForm: FormGroup;
  public loading = false;
  public submitted = false;
  public urlKey: string;
  tokenValidationData: any;
  newFieldTextType: boolean;
  reNewFieldTextType: boolean;
  hideEyeSrc = 'assets/svg/DashboardIcons/Hide.svg';
  showEyeSrc = 'assets/svg/DashboardIcons/View.svg';
  token: string;

  // public returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private activationService: PatientActivationService,
    private passwordService: ForgotPasswordService,
    public forgotPasswordModal: MatDialog,
    public snackBarService: SnackbarService
  ) {
    this.urlKey = this.route.snapshot.queryParams.key;
  }

  ngOnInit(): void {
    const tokenKey = this.urlKey?.split('=');
    this.activationForm = this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(8)],
      repassword: ['', Validators.required, Validators.minLength(8)],
    });
    if (tokenKey.length) {
      this.token = tokenKey[0];
    }
    // this.validateHospitalForm();
    const val = {
      key: this.urlKey,
    };
    this.activationService.tokenValidation(this.urlKey, val).subscribe(
      (res) => {
        this.tokenValidationData = res;
        this.validateHospitalForm();
      },
      (err) => {
        this.snackBarService.error('Token Expired!');

        // this.snackBarService.error(err.error.message);
      }
    );
  }

  private validateHospitalForm() {
    this.activationForm = this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(8)],
      repassword: ['', Validators.required, Validators.minLength(8)],
    });
  }
  get fields() {
    return this.activationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.activationForm.invalid) {
      this.snackBarService.error('Enter valid details');
      this.submitted = false;
      return;
    }
    if (!this.snackBarService.validRegex) {
      this.snackBarService.error('Enter valid details');
      return;
    }
    if (
      this.activationForm.get('password').value ==
      this.activationForm.get('repassword').value
    ) {
      // api call
      // this.activationForm.get('username').setValue(this.tokenValidationData.username);
      //
      const body = {
        confirmPassword: this.activationForm.value?.repassword,
        password: this.activationForm.value?.password,
      };

      this.passwordService.updatePassword(body, this.token).subscribe(
        () => {
          this.submitted = false;
          this.snackBarService.success('Password set successfully');
          this.router.navigate(['/login']);
        },
        (err) => {
          this.submitted = false;
          // this.snackBarService.error(err.message);
        }
      );
    } else {
      this.submitted = false;
      this.snackBarService.error('Password did not matched');
    }
    // else{this.snackbarservice.error('Password didn't matched);}
    // this.auth.resetPassword(this.updateForm.value).subscribe((res) => {
    //   this.snackbarService.success('Password reseted successfully');
    //   this.mailSend = true;
    //   // this.router.navigate(['/login']);
    // }, err => {
    //   this.snackbarService.error(err.error.message);
    // })
  }
  toggleFieldTextType(type) {
    if (type == 'new') {
      this.newFieldTextType = !this.newFieldTextType;
    } else if (type == 'reNew') {
      this.reNewFieldTextType = !this.reNewFieldTextType;
    }
  }
}
