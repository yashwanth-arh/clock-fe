import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { phoneNumberRx, emailRx, maskRx } from 'src/app/shared/entities/routes';
import { PatientDataSource } from 'src/app/patient-management/service/patient-data-source';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { ZipStateCityService } from 'src/app/core/services/zip-state-city.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';

@Component({
  selector: 'app-care-coordinator-dialog',
  templateUrl: './care-coordinator-dialog.component.html',
  styleUrls: ['./care-coordinator-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CareCoordinatorDialogComponent implements OnInit {
  doctorsDialog: FormGroup;
  public submitted = false;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  StatusFilteredOptions: Observable<string[]> | undefined;
  editData = false;
  hospitals = [];
  branch = [];
  state: string[] = [];
  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  zipCode: string[] = [];
  zipCodeFilteredOptions: Observable<any>;
  emailExists: boolean = false;
  selectedState: string;
  selectedCity: string;
  specialityList: any;
  clinicList = [];
  practiceList = [];
  emailidValidation: boolean;
  mask = maskRx;
  userRole: string;
  docId: string;
  prefixList: any = ['Dr', 'No Prefix'];
  public dataSource: PatientDataSource;
  keyUpObservable: any;
  genderList: any[] = [];
  checkUserLoggedIn: boolean = false;
  existingEmail: any;
  constructor(
    public dialogRef: MatDialogRef<CareCoordinatorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public doctorService: DoctorService,
    public snackBarService: SnackbarService,
    public patientService: PatientManagementService,
    private branchService: BranchService,
    private ZipStateCityService: ZipStateCityService,
    private authService: AuthService,
    private hospitalService: HospitalManagementService
  ) {
    const user = this.authService.authData;
    if (user?.userDetails) {
      this.userRole = user?.userDetails?.userRole;
    }
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
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    if (this.data.add == null) {
      this.fillDoctorsEditForm(this.data.data);
    }
    if (this.userRole === 'HOSPITAL_USER') {
      this.getFacilityList();
    }
  }

  ngOnInit(): void {
    if (this.data.mode === 'EDIT') {
      this.hospitalService
        .checkUserIsLoggedIn(this.data?.data?.id)
        .subscribe((res) => {
          this.checkUserLoggedIn = res?.checkUserLoggedIn;
        });
      this.existingEmail = this.data?.data.emailId;
    }
    const name = /^[a-zA-Z.'\s]*$/;
    const alphabetspace = /^[A-Za-z][A-Za-z ]*$/;
    this.doctorsDialog = this.fb.group({
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

      designation: [null, [Validators.pattern(alphabetspace)]],

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

      cellNumber: [
        null,
        [Validators.required, Validators.pattern(phoneNumberRx)],
      ],
      facilityId: [null],
    });

    if (this.data.mode === 'ADD') {
      this.doctorsDialog.removeControl('userStatus');
      this.emailidValidation = true;
    } else {
      this.doctorsDialog.get('providerNPI')?.clearAsyncValidators();
      this.doctorsDialog.get('emailId')?.clearAsyncValidators();
      this.doctorsDialog.updateValueAndValidity();
      this.emailidValidation = false;
    }
  }

  private fillDoctorsEditForm(parsedData: any): void {
    this.doctorsDialog.get('firstName').setValue(parsedData?.firstName);
    this.doctorsDialog.get('middleName').setValue(parsedData?.middleName);
    this.doctorsDialog.get('lastName').setValue(parsedData?.lastName);

    this.doctorsDialog.get('emailId').setValue(parsedData?.emailId);
    this.doctorsDialog.get('gender').setValue(parsedData?.gender);

    this.doctorsDialog.get('cellNumber').setValue(parsedData?.cellNumber);
    this.doctorsDialog.get('designation').setValue(parsedData?.designation);
    let facilityValues = [];
    parsedData?.facilityIds.split(',').map((data) => {
      facilityValues.push(data);
    });
  }
  getEmail() {
    if (this.data.data?.emailId) {
      if (this.emailId.value !== this.data.data?.emailId) {
        this.emailId?.setValidators([
          Validators.required,
          Validators.pattern(emailRx),
        ]);
        this.emailId.setAsyncValidators([
          EmailNotTaken.createValidator(this.authService),
        ]);
      } else {
        this.emailId?.clearAsyncValidators();
      }
      this.emailId?.updateValueAndValidity();
    }
  }
  get emailId(): FormControl {
    return this.doctorsDialog.get('emailId') as FormControl;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  getErrorEmail(): string {
    return this.doctorsDialog.get('emailId').hasError('required')
      ? 'Email is required'
      : this.doctorsDialog.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.emailid?.errors?.emailTaken ||
        this.doctorsDialog.get('emailId').hasError('emailExists')
      ? 'This email address is already in use'
      : '';
  }

  getErrorCellNo(): string {
    return this.doctorsDialog.get('cellNumber').hasError('required')
      ? 'Contact Number is required'
      : this.doctorsDialog.get('cellNumber').hasError('pattern')
      ? 'Enter Valid Contact Number'
      : '';
  }
  getErrorDesignation(): string {
    return this.doctorsDialog.get('designation').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.doctorsDialog.get('designation').errors
      ? 'Enter minimum 2 characters'
      : this.doctorsDialog.get('deviceType').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : '';
  }
  getErrorName(): string {
    return this.doctorsDialog.get('firstName').hasError('required')
      ? 'First Name is required'
      : this.doctorsDialog.get('firstName').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.doctorsDialog.get('firstName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.doctorsDialog.get('firstName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : '';
  }
  getLastErrorName(): string {
    return this.doctorsDialog.get('lastName').hasError('required')
      ? 'Last Name is required'
      : this.doctorsDialog.get('lastName').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.doctorsDialog.get('lastName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.doctorsDialog.get('lastName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : '';
  }
  getMiddleErrorName() {
    return this.doctorsDialog.get('middleName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : '';
  }

  private _filterStatusSearch(valueStatus: string): string[] {
    const filterStatusValue = valueStatus.toLowerCase();
    return this.status.filter((option) =>
      option.toLowerCase().includes(filterStatusValue)
    );
  }

  get fields(): any {
    return this.doctorsDialog.controls;
  }

  keyUp(event): any {
    event.target.value = event.target.value.trim();
  }

  onClinicSelection(event): any {
    // this.clinicList = [];
  }

  getAllSpeciality(): void {
    this.doctorService.getSpecialization().subscribe((data: any) => {
      this.specialityList = data;
    });
  }

  displayName(obj): any {
    return obj ? obj.name : undefined;
  }

  getFacilityList(): void {
    this.doctorService.getFacilityList().subscribe((data: any) => {
      this.clinicList = data;
      // let val = this.clinicList.filter((res) => {;
      //   return res?.id === this.doctorsDialog.get('facilityId').value[0];
      // });
      if (this.data.mode === 'EDIT') {
        this.clinicList.map((e) => {
          if (e?.id === this.data?.data?.facilityIds) {
            this.doctorsDialog.get('facilityId').setValue(e?.id);
          }
        });
      }
    });
  }
  get emailid(): FormControl {
    return this.doctorsDialog.get('emailId') as FormControl;
  }

  get doctorNPI(): FormControl {
    return this.doctorsDialog.get('providerNPI') as FormControl;
  }

  onSubmit(value): void {
    this.submitted = true;
    if (this.doctorsDialog.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.doctorsDialog.value;
    formValue.prefix = formValue.prefix;
    formValue.emailId = formValue.emailId.toLowerCase();
    formValue.firstName = formValue.firstName.trim();
    formValue.middleName = formValue?.middleName?.trim();
    formValue.lastName = formValue.lastName.trim();
    formValue.designation = formValue.designation
      ? formValue.designation.trim()
      : null;
    if (this.userRole === 'HOSPITAL_USER') {
      formValue.facilityId = formValue.facilityId;
    } else {
      formValue.facilityId = null;
    }
    if (this.data.mode === 'ADD') {
      delete formValue.id;
      this.doctorService.createCareCoordinator(formValue).subscribe(
        (data) => {
          this.snackBarService.success('Created successfully!', 2000);
          this.dialogRef.close(true);
          this.submitted = false;
        },
        (error) => {
          // this.snackBarService.error(
          //   error.message ? error.message : 'Create failed!'
          // );
          this.submitted = false;
        }
      );
    } else {
      this.doctorService
        .updateCareCoordinator(this.data.data.id, formValue)
        .subscribe(
          (data) => {
            this.snackBarService.success('Updated successfully!', 2000);
            this.dialogRef?.close(true);
            this.submitted = false;
          },
          (error) => {
            // this.snackBarService.error(error.message);
            this.submitted = false;
            this.doctorsDialog
              .get('practice')
              .setValue(this.practiceList[0]?.id);
          }
        );
    }
  }
}
