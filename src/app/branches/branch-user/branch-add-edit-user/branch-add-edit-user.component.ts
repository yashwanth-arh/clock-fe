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
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { BranchUserService } from '../branch-user.service';
import { maskRx, phoneNumberRx, emailRx } from 'src/app/shared/entities/routes';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-branch-add-edit-user',
  templateUrl: './branch-add-edit-user.component.html',
  styleUrls: ['./branch-add-edit-user.component.scss'],
})
export class BranchAddEditUserComponent implements OnInit {
  addEditUser: FormGroup;
  paginator: string[] = [];
  dataSource: string[] = [];
  selectedData: any | undefined;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  userRecordId: any;
  mask = maskRx;

  isSubmitted = false;
  genderList: { name: string; value: string }[];
  adminAccessBoolean: boolean = false;
  userRole: any;
  userId: string;
  checkUserLoggedIn: boolean = false;
  existingEmail: any;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<BranchAddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    public snackBarService: SnackbarService,
    public branchuserservice: BranchUserService,
    private authService: AuthService,
    private hospitalService: HospitalManagementService
  ) {}

  ngOnInit(): void {
    if (this.data.add === 'edit') {
      this.hospitalService
        .checkUserIsLoggedIn(this.data?.value?.id)
        .subscribe((res) => {
          this.checkUserLoggedIn = res?.checkUserLoggedIn;
        });
      this.existingEmail = this.data?.value.emailId;
    }
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;

    this.userId = authDetails?.userDetails?.scopeId;
    // const name = /^[a-zA-Z ]+$/;
    const name = /^[a-zA-Z.'\s]*$/;
    this.addEditUser = this.fb.group({
      id: [null],
      firstName: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
          
        ],
      ],
      gender: [null],
      middleName: [
        null,
        [
          Validators.pattern(name),
        ],
      ],
      lastName: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(1),
          this.noWhitespaceValidator,
        ],
      ],
      designation: [null, [Validators.minLength(2), Validators.maxLength(50),Validators.pattern(name)]],
      emailId: [
        null,
        [Validators.required, Validators.pattern(emailRx)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingEmail === control.value) {
              return of(null);
            }
            if (control.value && control.value.length) {
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
      // status: [null],
      provideAccess: [false],
    });

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
    this.route.queryParams.subscribe((params) => {
      this.selectedData = {
        org_id: params.org_id,
        branch_id: params.branch_id,
      };
    });

    if (this.data.add === 'edit') {
      this.removeValidators();
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    this.adminAccessBoolean = this.data?.value?.provideAccess;
    this.fillUserEditForm(this.data.value);
    if (this.userRole == 'HOSPITAL_USER') {
      this.addEditUser.get('provideAccess').setValue(true);
    }
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  get emailid(): FormControl {
    return this.addEditUser.get('emailId') as FormControl;
  }
  getAccess() {
    if (
      this.userRole === 'FACILITY_USER' &&
      this.userId === this.data.value?.id
    ) {
      return false;
    } else if (
      this.userRole === 'FACILITY_USER' &&
      this.userId !== this.data.value?.id
    ) {
      return true;
    } else {
      return false;
    }
  }
  public fillUserEditForm(parsedData: any): void {
    this.addEditUser.setValue({
      id: parsedData ? parsedData.id : null,
      firstName: parsedData ? parsedData.firstName : null,
      middleName: parsedData ? parsedData.middleName : null,
      lastName: parsedData ? parsedData.lastName : null,
      designation: parsedData ? parsedData.designation : null,
      gender: parsedData ? parsedData.gender : null,
      emailId: parsedData ? parsedData.emailId : null,
      contactNumber: parsedData ? parsedData.contactNumber : null,
      // status: parsedData ? parsedData.userStatus : null,
      provideAccess: parsedData ? parsedData.provideAccess : '',
    });
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
      ? 'Enter valid contact Number'
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
      ? 'Enter minimum 1 character'
      : this.addEditUser.get('lastName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrormiddleName(): string {
    return this.addEditUser.get('middleName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEditUser.get('middleName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.addEditUser.get('middleName').errors
      ? 'Enter minimum 3 characters'
      : null;
  }
  getDesignation(): string {
    return this.addEditUser.get('designation').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : // : this.addEditUser.get('designation').hasError('whitespace')
      // ? 'Only spaces are not allowed'
      this.addEditUser.get('designation').errors
      ? 'Enter minimum 2 characters'
      : null;
  }
  removeValidators() {
    // this.addEditUser.get('emailId').clearAsyncValidators();
    this.addEditUser.get('emailId').updateValueAndValidity();
  }
  onSubmit(userDetails: any): void {
    this.isSubmitted = true;
    if (this.addEditUser.invalid) {
      return;
    }

    if (this.data.add === 'add') {
      const body = {
        firstName: userDetails?.firstName
          ? userDetails?.firstName.trim()
          : null,
        middleName: userDetails?.middleName
          ? userDetails?.middleName.trim()
          : null,
        gender: userDetails?.gender ? userDetails?.gender : null,
        lastName: userDetails?.lastName ? userDetails?.lastName.trim() : null,
        emailId: userDetails?.emailId,
        designation: userDetails?.designation ? userDetails?.designation : null,
        contactNumber: userDetails?.contactNumber,
        facilityId: localStorage.getItem('branch_id'),
        provideAccess: userDetails.provideAccess,
      };
      this.branchuserservice.addBranchUser(body).subscribe(
        () => {
          this.dialogRef.close(true);
          this.snackBarService.success('Created  successfully!', 2000);
          this.isSubmitted = false;
        },
        (error) => {
          // this.snackBarService.error(error.message);
          this.isSubmitted = false;
        }
      );
    } else {
      const body = {
        firstName: this.addEditUser.get('firstName').value,
        middleName: this.addEditUser.get('middleName').value
          ? this.addEditUser.get('middleName').value
          : null,
        lastName: this.addEditUser.get('lastName').value,
        emailId: this.addEditUser.get('emailId').value,
        gender: this.addEditUser.get('gender').value,
        designation: this.addEditUser.get('designation').value
          ? this.addEditUser.get('designation').value
          : null,
        contactNumber: this.addEditUser.get('contactNumber').value,
        facilityId: localStorage.getItem('branch_id'),
        provideAccess: this.addEditUser.get('provideAccess').value,
      };
      this.branchuserservice.editBranchUser(this.data.value.id, body).subscribe(
        () => {
          this.dialogRef.close(true);
          this.snackBarService.success('Updated successfully!', 2000);
          this.isSubmitted = false;
        },
        (error) => {
          // this.snackBarService.error(error.message);
          this.isSubmitted = false;
        }
      );
    }
  }

  checkValue(event) {
    return String.fromCharCode(event.charCode).match(/^[A-Za-z ]+$/)
      ? event.CharCode
      : event.preventDefault();
  }
  adminAccess(event) {
    //   this.branchuserservice
    //     .adminFacilityAccess(this.userId)
    //     .subscribe(
    //       (res) => {

    //         this.snackBarService.success('Updated successfully!', 2000);
    //       },
    //       (error) => {

    //       }
    //     );
    if ((event.checked = true)) {
      this.adminAccessBoolean = true;
      // this.snackBarService.success('Updated successfully')
    } else {
      this.adminAccessBoolean = false;
      // this.snackBarService.success('Updated successfully')
    }
  }
}
