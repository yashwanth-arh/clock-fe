import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { hospitalUserService } from '../../service/hospital-user.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/shared/entities/role.enum';
import { maskRx, phoneNumberRx, emailRx } from 'src/app/shared/entities/routes';
import { HospitalManagementService } from '../../service/hospital-management.service';
import { of } from 'rxjs';
// import { phoneNumberRx, emailRx } from 'src/app/shared/entities/routes';

@Component({
  selector: 'app-hospital-add-edit-user',
  templateUrl: './hospital-add-edit-user.component.html',
  styleUrls: ['./hospital-add-edit-user.component.scss'],
})
export class HospitalAddEditUserComponent implements OnInit {
  addEditUser: FormGroup;
  paginator: string[] = [];
  dataSource: string[] = [];
  selectedData: any | undefined;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  userRecordId: any;
  role = Role;
  submitted = false;
  public roleList = [{ value: 'hospital_USER', displayName: 'Admin' }];
  mask = maskRx;
  hUserId: any;
  genderList: { name: string; value: string }[];
  emailidValidation: boolean;
  emailExists: boolean;
  adminAccessBoolean: boolean = false;
  userRole: any;
  checkUserLoggedIn: boolean = false;
  existingEmail: any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HospitalAddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    public hospitalService: HospitalManagementService,
    private organizatioUserService: hospitalUserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.add === 'edit') {
      this.hospitalService
        .checkUserIsLoggedIn(this.data?.value?.id)
        .subscribe((res) => {
          this.checkUserLoggedIn = res?.checkUserLoggedIn;
        });

      this.existingEmail = this.data?.value?.emailId;
    }
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    this.genderList = [
      { name: 'Male', value: 'MALE' },
      { name: 'Female', value: 'FEMALE' },
      { name: 'Transgender Male', value: 'TRANSGENDER_Male' },
      { name: 'Transgender Female', value: 'TRANSGENDER_Female' },
      {
        name: 'Transgender(as non-binary)',
        value: 'TRANSGENDER_AS_NON_BINARY',
      },
      { name: 'non-binary', value: 'NON_BINARY' },
      { name: 'Gender-queer', value: 'GENDER_QUEER' },
      { name: 'Two-spirit', value: 'TWO_SPIRIT' },
      { name: 'Dont want to disclose', value: 'DONT_WANT_TO_DISCLOSE' },
    ];
    this.hUserId = this.data?.value?.id;
    this.route.queryParams.subscribe((params) => {
      this.selectedData = { org_id: params.org_id };
    });

    this.validateUserForm();
    if (this.userRole == 'RPM_ADMIN') {
      this.addEditUser.get('provideAccess').setValue(true);
      // console.log(this.addEditUser.get('provideAccess').value);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    this.adminAccessBoolean = this.data?.value?.provideAccess;
    if (this.data.add === 'edit') {
      // this.addEditUser.get('emailId')?.clearAsyncValidators();
      this.addEditUser.updateValueAndValidity();

      this.emailidValidation = false;
      this.fillUserEditForm(this.data.value);
    }
  }
  // getEmail() {
  //   if (this.addEditUser.get('emailId').value !== this.data.value.emailId) {
  //     this.addEditUser
  //       .get('emailId')
  //       ?.setValidators([
  //         Validators.required,
  //         Validators.pattern(emailRx),
  //         EmailNotTaken.createValidator(this.authService),
  //       ]);
  //     this.addEditUser.updateValueAndValidity();
  //     this.emailExists = true;
  //   }
  // }
  private fillUserEditForm(parsedData: any): void {
    // role: parsedData ? parsedData.Role : null,
    this.addEditUser
      .get('firstName')
      .setValue(parsedData.firstName ? parsedData.firstName : null);
    this.addEditUser
      .get('middleName')
      .setValue(parsedData.middleName ? parsedData.middleName : null);
    this.addEditUser
      .get('lastName')
      .setValue(parsedData.lastName ? parsedData.lastName : null);
    this.addEditUser
      .get('contactNumber')
      .setValue(parsedData.contactNumber ? parsedData.contactNumber : null);
    this.addEditUser
      .get('emailId')
      .setValue(parsedData.emailId ? parsedData.emailId : null);
    this.addEditUser
      .get('designation')
      .setValue(parsedData.designation ? parsedData.designation : null);
    this.addEditUser
      .get('gender')
      .setValue(parsedData.gender ? parsedData.gender : null);
  }

  private validateUserForm(): void {
    // const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const name = /^[a-zA-Z ]*$/;
    // const spaceValidation = /^[A-Za-z][A-Za-z ]*$/;

    this.addEditUser = this.fb.group({
      // role: ['ADMIN', Validators.required],
      firstName: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
      ],
      middleName: [null, [Validators.pattern(name)]],
      lastName: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(1),
          this.noWhitespaceValidator,
        ],
      ],
      gender: [null],
      designation: [
        null,
        [
          Validators.minLength(2),
          Validators.maxLength(50),
          // this.noWhitespaceValidator,
          Validators.pattern(name),
        ],
      ],
      emailId: [
        null,
        [Validators.required, Validators.pattern(emailRx)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingEmail === control.value) {
              return of(null);
            }

            if (control.value) {
              return EmailNotTaken.createValidator(this.authService)(control);
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern(phoneNumberRx)],
      ],
      provideAccess: [false],

      // userStatus: [null],
    });
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  getErrorEmail(): string {
    return this.addEditUser.get('emailId').hasError('required')
      ? 'Email is required'
      : this.addEditUser.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.addEditUser.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : null;
  }

  getErrorContactNo(): string {
    return this.addEditUser.get('contactNumber').hasError('required')
      ? 'Contact Number is required'
      : this.addEditUser.get('contactNumber').hasError('pattern')
      ? 'Enter valid contact number'
      : null;
  }

  getErrorfirstName(): string {
    return this.addEditUser.get('firstName').hasError('required')
      ? 'First Name is required'
      : this.addEditUser.get('firstName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEditUser.get('firstName').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.addEditUser.get('firstName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrorlastName(): string {
    return this.addEditUser.get('lastName').hasError('required')
      ? 'Last Name is required'
      : this.addEditUser.get('lastName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEditUser.get('lastName').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.addEditUser.get('lastName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrormiddleName(): string {
    return this.addEditUser.get('middleName').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.addEditUser.get('middleName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : null;
  }
  getErrorDesignation(): string {
    return this.addEditUser.get('designation').hasError('minlength')
      ? 'Enter minimum 2 character and maximun 50 characters'
      : this.addEditUser.get('designation').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : null;
  }
  private _filterStatusSearch(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.status.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(userDetails: any): void {
    this.submitted = true;
    if (this.addEditUser.invalid) {
      return;
    }

    const designation = userDetails.designation
      ? userDetails.designation.trim()
      : null;
    const middleName = userDetails.middleName
      ? userDetails.middleName.trim()
      : null;
    const body = {
      firstName: userDetails.firstName ? userDetails.firstName.trim() : null,
      middleName: middleName !== '' ? middleName : null,
      lastName: userDetails.lastName ? userDetails.lastName.trim() : null,
      emailId: userDetails.emailId,
      gender: userDetails.gender,
      designation: designation !== '' ? designation : null,
      contactNumber: userDetails.contactNumber,
      provideAccess: userDetails.provideAccess,
      hospital: this.selectedData.org_id ? this.selectedData.org_id : null,

      // role: userDetails.role,
      // userRole: userDetails.role,
    };

    if (this.data.add === 'add') {
      this.organizatioUserService.createhospitalUser(body).subscribe(
        () => {
          this.dialogRef.close(true);
          this.snackBarService.success('Created  successfully!', 2000);
          this.submitted = false;
        },
        (error) => {
          // this.snackBarService.error('Failed!');
          this.submitted = false;
        }
      );
    } else {
      const designation = this.addEditUser.value.designation
        ? this.addEditUser.value.designation.trim()
        : null;
      const middleName = this.addEditUser.value.middleName
        ? this.addEditUser.value.middleName.trim()
        : null;
      this.addEditUser.value.middleName = middleName !== '' ? middleName : null;
      this.addEditUser.value.designation =
        designation !== '' ? designation : null;
      this.addEditUser.value.firstName = this.addEditUser.value.firstName
        ? this.addEditUser.value.firstName.trim()
        : null;
      this.addEditUser.value.lastName = this.addEditUser.value.lastName
        ? this.addEditUser.value.lastName.trim()
        : null;
      this.organizatioUserService
        .updatehospitalUser(this.hUserId, this.addEditUser.value)
        .subscribe(
          () => {
            this.dialogRef.close(true);
            this.snackBarService.success('Updated successfully!', 2000);
            this.submitted = false;
          },
          (error) => {
            if (error.err === 409) {
              this.snackBarService.error(error.message);
            }
            // this.snackBarService.error('Failed!');
            this.submitted = false;
          }
        );
    }
  }

  get emailid(): FormControl {
    return this.addEditUser.get('emailId') as FormControl;
  }
  adminAccess(e) {
    // this.organizatioUserService
    // .adminAccess(this.data?.value?.id)
    // .subscribe(
    //   () => {
    //     this.snackBarService.success('Updated successfully!', 2000);
    //   },
    //   (error) => {

    //   }
    // );
    if ((e.checked = true)) {
      this.adminAccessBoolean = true;
      // this.snackBarService.success('Updated successfully');
    } else {
      this.adminAccessBoolean = false;
      // this.snackBarService.success('Updated successfully');
    }
  }
}
