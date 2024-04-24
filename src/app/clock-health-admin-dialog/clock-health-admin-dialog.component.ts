import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../core/services/snackbar.service';
import { CHAdminService } from '../clock-health-admin/clock-health-admin.service';
import { emailRx, phoneNumberRx } from '../shared/entities/routes';
import { EmailNotTaken } from '../core/validators/async.email.validator';
import { AuthService } from '../core/services/auth.service';
import { HospitalManagementService } from '../hospital-management/service/hospital-management.service';

@Component({
  selector: 'app-clock-health-admin-dialog',
  templateUrl: './clock-health-admin-dialog.component.html',
  styleUrls: ['./clock-health-admin-dialog.component.scss'],
})
export class ClockHealthAdminDialogComponent implements OnInit {
  adminForm: FormGroup;
  submitted: boolean = false;
  emailExists: boolean = false;
  checkUserLoggedIn: boolean = false;
  // statuslist = [
  // 	{ value: "Active", viewValue: "Active" },
  // 	{ value: "Inactive", viewValue: "Inactive" },
  // ];
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClockHealthAdminDialogComponent>,
    public snackBar: SnackbarService,
    private service: CHAdminService,
    private authService: AuthService,
    private hospitalService: HospitalManagementService
  ) {}

  ngOnInit(): void {
    this.initializeCreateDeviceForm();
    if (this.data) {
      this.hospitalService
        .checkUserIsLoggedIn(this.data?.id)
        .subscribe((res) => {
          this.checkUserLoggedIn = res?.checkUserLoggedIn;
        });
    }

    if (this.data.emailId && Object.keys(this.data.emailId)) {
      this.adminForm.get('emailId')?.clearAsyncValidators();
      this.adminForm.updateValueAndValidity();
    }
  }
  initializeCreateDeviceForm() {
    const name = /^[a-zA-Z ]*$/;
    this.adminForm = this.fb.group({
      contactnumber: [
        this.data.contactnumber ? this.data.contactnumber : null,
        [Validators.required, Validators.pattern(phoneNumberRx)],
      ],
      emailId: [
        this.data.emailId ? this.data.emailId : null,
        [Validators.required, Validators.pattern(emailRx)],
        EmailNotTaken.createValidator(this.authService),
      ],
      firstname: [
        this.data.firstname ? this.data.firstname : null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
        ,
      ],
      lastname: [
        this.data.lastname ? this.data.lastname : null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(1),
          this.noWhitespaceValidator,
        ],
        ,
      ],
      middlename: [
        this.data.middlename ? this.data.middlename : null,
        [Validators.pattern(name)],
      ],
      status: ['ACTIVE', Validators.required],
    });
  }
  get middlename(): FormControl {
    return this.adminForm.get('middlename') as FormControl;
  }
  get lastname(): FormControl {
    return this.adminForm.get('lastname') as FormControl;
  }
  get emailId(): FormControl {
    return this.adminForm.get('emailId') as FormControl;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  getErrorfirstName(): string {
    return this.adminForm?.get('firstname').hasError('required')
      ? 'First Name is required'
      : this.adminForm.get('firstname').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.adminForm.get('firstname').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.adminForm.get('firstname').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : '';
  }
  getErrorlastName(): string {
    return this.adminForm?.get('lastname').hasError('required')
      ? 'Last Name is required'
      : this.adminForm.get('firstname').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.adminForm.get('lastname').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.adminForm.get('lastname').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : '';
  }
  getEmail() {
    if (this.data.emailId) {
      if (this.emailId.value !== this.data.emailId) {
        this.emailId.setValidators([
          Validators.required,
          Validators.pattern(emailRx),
        ]);
        this.emailId.setAsyncValidators([
          EmailNotTaken.createValidator(this.authService),
        ]);
      } else {
        this.emailId.clearAsyncValidators();
      }
      this.emailId.updateValueAndValidity();
    }
  }
  submitCHAdmin() {
    this.submitted = true;
    this.adminForm.value.middlename = this.adminForm.value.middlename
      ? this.adminForm.value.middlename.trim()
      : null;
    const formValue = this.adminForm.value;
    formValue.firstname = formValue.firstname.trim();
    formValue.lastname = formValue.lastname.trim();
    if (this.adminForm?.valid) {
      this.adminForm.value.middlename = this.adminForm.value.middlename
        ? this.adminForm.value.middlename.trim()
        : null;

      // console.warn(this.deviceTypeForm.value);
      if (!this.data) {
        this.service.createCHAdmin(formValue).subscribe(
          (res) => {
            this.snackBar.success('CH Admin added successfully', 2000);
            this.dialogRef.close();
          },
          (error) => {
            // this.snackBar.error(error.message);
            this.submitted = false;
          }
        );
      } else {
        this.service.updateCHAdmin(this.data.id, formValue).subscribe(
          (res) => {
            this.snackBar.success('CH Admin updated successfully', 2000);
            this.dialogRef.close();
          },
          (error) => {
            // this.snackBar.error(error.message);
            if (error.err === 409) {
              this.snackBar.error(error.message);
            }
            this.submitted = false;
          }
        );
      }
    } else {
    }
  }

  getErrorContactNo(): any {
    return this.adminForm.get('contactnumber').hasError('required')
      ? 'Contact Number is required'
      : this.adminForm.get('contactnumber').hasError('pattern')
      ? 'Please Enter 10 digit valid Contact Number'
      : null;
  }
  getErrorEmail(): any {
    return this.adminForm.get('emailId').hasError('required')
      ? 'Email is required'
      : this.adminForm.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.adminForm.get('emailId').hasError('emailExists')
      ? 'This email address is already in use'
      : '';
  }
  get emailid(): FormControl {
    return this.adminForm.get('emailId') as FormControl;
  }
}
