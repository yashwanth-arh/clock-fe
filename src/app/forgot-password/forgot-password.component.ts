import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { emailRx } from '../shared/entities/routes';
import { ForgotPasswordService } from './service/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  public submitted = false;
  mailSend = false;
  userEmail = true;
  showLoader: boolean;
  constructor(private auth: AuthService,
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private snackBarService: SnackbarService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(emailRx)])),
    });
  }

  get fields(): any {
    return this.forgotPasswordForm.controls;
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  getErrorEmail(): string {
    return this.forgotPasswordForm.get('username').hasError('required')
      ? 'Email Id is required'
      : this.forgotPasswordForm.get('username').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }
  onSubmit(): void {    
    this.submitted = true;
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.forgotPasswordForm.value;
    this.showLoader = true;
    this.userEmail = false;
    this.forgotPasswordService.forgotPassword(formValue.username.toLowerCase()).subscribe((data) => {
      this.snackBarService.success('Mail sent successfully', 2000);
      this.submitted = false;
      this.showLoader = false;
      // this.router.navigate(['/login']);
      this.mailSend = true;

    },
      (error) => {
        // this.snackBarService.error('Entered username is not exist.', 2000);
        this.submitted = false;
        this.showLoader = false;
        this.userEmail = true;
        this.forgotPasswordForm.get('username').setValue("");
      }
    );
  }
}
