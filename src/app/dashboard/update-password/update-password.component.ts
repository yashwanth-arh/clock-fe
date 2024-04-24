import { ForgotPasswordService } from './../../forgot-password/service/forgot-password.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PatientActivationService } from 'src/app/patient-account-activation/patient-activation.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  updateForm: FormGroup;
  showLoader = false;
  public submitted = false;
  mailSend = false;
  urlKey: string;
  public mailId: string;
  newFieldTextType = false;
  reNewFieldTextType = false;
  tokenValidationData: any;
  token: string;
  hideEyeSrc = 'assets/svg/DashboardIcons/Hide.svg';
  showEyeSrc = 'assets/svg/DashboardIcons/View.svg';
  hideEyeSrcRenew = 'assets/svg/DashboardIcons/Hide.svg';
  showEyeSrcRenew = 'assets/svg/DashboardIcons/View.svg';
  constructor(
    private fb: FormBuilder,
    public snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private forgotService: ForgotPasswordService,
    private activationService: PatientActivationService
  ) {
    this.mailId = this.route.snapshot.params.val;
    this.urlKey = this.route.snapshot.queryParams.key;
  }

  ngOnInit(): void {
    const tokenKey = this.urlKey?.split('=');
    if (tokenKey?.length)
      this.token = tokenKey[0];
    localStorage.setItem('validatedToken', this.token);

    this.validateHospitalForm();

    this.getTokenValidation();

  }
  getTokenValidation() {
    const val = {
      key: this.urlKey,
    };

    this.activationService.tokenValidation(this.urlKey, val).subscribe(
      (res) => {
        this.snackbarService.success('Token validated');
      },
      (err) => {
        this.snackbarService.error('Reset password link has expired');
        // this.router.navigate(['/login']);
      }
    );
  }
  private validateHospitalForm() {
    this.updateForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  get fields() {
    return this.updateForm.controls;
  }

  onSubmit(value, valid) {
    this.submitted = true;
    this.showLoader = true;

    if (!valid || !this.snackbarService.validRegexRenew) {
      this.snackbarService.error('Enter valid data');
      this.submitted = false;
      this.showLoader = false;
      return;
    }
    if (value.password === value.confirmPassword) {
      // api call
      // this.token = localStorage.getItem('validatedToken');
      this.forgotService.updatePassword(value, this.token).subscribe(
        (res) => {
          this.showLoader = false;
          this.snackbarService.success('Password updated successfully');
          this.router.navigate(['/login']);
          this.submitted = false;
        },
        (err) => {
          this.submitted = false;
          this.showLoader = false;
          // this.snackbarService.error(err.error.message);
        }
      );
    } else {
      this.submitted = false;
      this.showLoader = false;
      this.snackbarService.error('Password did not matched');
    }
  }

  toggleFieldTextType(type) {
    if (type == 'new') {
      this.newFieldTextType = !this.newFieldTextType;
    } else if (type == 'reNew') {
      this.reNewFieldTextType = !this.reNewFieldTextType;
    }
  }
}
