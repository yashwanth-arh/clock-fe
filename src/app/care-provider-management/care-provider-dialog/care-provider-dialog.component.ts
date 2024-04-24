import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { NPINotTaken } from 'src/app/core/validators/async.npi.validators';
import { phoneNumberRx, emailRx, maskRx } from 'src/app/shared/entities/routes';
import { PatientDataSource } from 'src/app/patient-management/service/patient-data-source';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { ZipStateCityService } from 'src/app/core/services/zip-state-city.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';

@Component({
  selector: 'app-care-provider-dialog',
  templateUrl: './care-provider-dialog.component.html',
  styleUrls: ['./care-provider-dialog.component.scss'],
})
export class CareProviderDialogComponent implements OnInit {
  doctorsDialog: FormGroup;
  public submitted = false;
  specializations: any;
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

  selectedState: string;
  selectedCity: string;
  specialityList: any;
  clinicList = [];
  practiceList = [];
  mask = maskRx;
  userRole: string;
  docId: string;
  roleList: any = [
    { name: 'Doctor', value: 'DOCTOR' },
    { name: 'Nurse', value: 'NURSE' },
    { name: 'Others', value: 'OTHERS' },
  ];
  public dataSource: PatientDataSource;
  keyUpObservable: any;
  facilityList: any;
  providerNPIExists: boolean;
  checkUserLoggedIn: boolean = false;
  existingNPI: any;
  existingEmail: any;
  constructor(
    public dialogRef: MatDialogRef<CareProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public doctorService: DoctorService,
    public snackBarService: SnackbarService,
    public patientService: PatientManagementService,
    private authService: AuthService,
    private branchService: BranchService,
    private hospitalService: HospitalManagementService
  ) {
    const user = this.authService.authData;
    if (user?.userDetails) {
      this.userRole = user?.userDetails?.userRole;
    }
    this.getAllSpeciality();
    this.docId = data.providerId;
    this.dataSource = new PatientDataSource(
      this.patientService,
      this.snackBarService,
      this.authService
    );
    this.dataSource.loadPatients(
      0,
      10,

      '',
      this.docId !== '' ? this.docId : null,
      ''
    );
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    if (this.data.mode == 'EDIT') {
      if (this.data.edit?.role !== 'DOCTOR') {
        this.doctorsDialog.removeControl('specialties');
      }
      this.fillDoctorsEditForm(this.data.edit);
    }
  }

  ngOnInit(): void {
    if (this.data.mode === 'EDIT') {
      this.existingNPI = this.data?.edit?.providerNPI;
      this.existingEmail = this.data?.edit.emailId;

      this.hospitalService
        .checkUserIsLoggedIn(this.data?.providerId)
        .subscribe((res) => {
          this.checkUserLoggedIn = res?.checkUserLoggedIn;
        });
    }
    const name = /^[a-zA-Z.'\s]*$/;
    this.doctorsDialog = this.fb.group({
      role: [],
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
      specialties: [null, [Validators.required]],
      facilityId: [null, [Validators.required]],
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
      providerNPI: [
        null,
        [Validators.minLength(10)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingNPI === control.value) {
              return of(null);
            }
            if (control.value && control.value.length > 9) {
              return NPINotTaken.createProviderNPIValidator(this.doctorService)(
                control
              );
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      medication: [false],
      notes: [false],
    });
    // this.getProviderNPI();
    if (this.doctorsDialog.get('role').value === 'DOCTOR') {
      this.doctorsDialog.get('medication').setValue(true);
      this.doctorsDialog.get('notes').setValue(true);
    }
    if (this.data.mode === 'ADD') {
      this.doctorsDialog.removeControl('userStatus');
    } else {
      // this.doctorsDialog.get('providerNPI').clearAsyncValidators();
      // this.doctorsDialog.get('emailId').clearAsyncValidators();
      this.doctorsDialog.updateValueAndValidity();
    }
    if (this.userRole !== 'HOSPITAL_USER') {
      this.doctorsDialog.get('facilityId').clearValidators();
      this.doctorsDialog.get('facilityId').updateValueAndValidity();
    } else {
      this.getFacilityList();
    }
  }

  private fillDoctorsEditForm(parsedData: any): void {
    this.doctorsDialog.get('firstName').setValue(parsedData?.firstName);
    this.doctorsDialog.get('middleName').setValue(parsedData?.middleName);
    this.doctorsDialog.get('lastName').setValue(parsedData?.lastName);
    this.doctorsDialog.get('role').setValue(parsedData?.role);
    let specialityValues = [];
    let facilityValues = [];
    parsedData?.specialties.map((specialties) => {
      specialityValues.push(specialties.id);
    });
    parsedData?.facilities.map((facilities) => {
      facilityValues.push(facilities?.id);
    });
    if (this.data.edit?.role === 'DOCTOR') {
      this.doctorsDialog
        .get('specialties')
        .setValue(specialityValues.map((specialties: any[]) => specialties));
    }

    this.doctorsDialog
      .get('facilityId')
      .setValue(facilityValues.map((facilities: any[]) => facilities));

    this.doctorsDialog.get('emailId').setValue(parsedData?.emailId);

    this.doctorsDialog.get('cellNumber').setValue(parsedData?.cellNumber);

    this.doctorsDialog.get('providerNPI').setValue(parsedData?.providerNPI);
    this.doctorsDialog.get('medication').setValue(parsedData?.medication);
    this.doctorsDialog.get('notes').setValue(parsedData?.notes);
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  getProviderNPI() {
    if (
      this.data.mode === 'ADD' &&
      this.doctorsDialog.get('providerNPI').value > 9
    ) {
      this.doctorsDialog
        .get('providerNPI')
        .setAsyncValidators(
          NPINotTaken.createProviderNPIValidator(this.doctorService)
        );
      this.doctorsDialog.updateValueAndValidity();
    } else if (
      this.data.mode === 'EDIT' &&
      this.doctorsDialog.get('providerNPI').value > 9 &&
      this.doctorsDialog.get('providerNPI').value !== this.data.edit.providerNPI
    ) {
      this.doctorsDialog
        .get('providerNPI')
        .setAsyncValidators(
          NPINotTaken.createProviderNPIValidator(this.doctorService)
        );
      this.doctorsDialog.updateValueAndValidity();
    } else {
      // this.doctorsDialog.get('providerNPI').clearAsyncValidators();
      this.doctorsDialog.updateValueAndValidity();
    }
  }
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
  getProviderNPIError(): string {
    return this.providerNPIExists === false
      ? 'Provider NPI already exists.'
      : '';
  }
  getErrorEmail(): string {
    return this.doctorsDialog.get('emailId').hasError('required')
      ? 'Email is required'
      : this.doctorsDialog.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.doctorsDialog.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
  }

  getErrorHomeNo(): string {
    return this.doctorsDialog.get('homeNumber').hasError('required')
      ? 'Home number is required'
      : this.doctorsDialog.get('homeNumber').hasError('pattern')
      ? 'Enter Valid Home Number'
      : '';
  }
  getErrorAddress(): string {
    return this.doctorsDialog.get('addressLine').hasError('required')
      ? 'Address is required'
      : this.doctorsDialog.get('addressLine').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  getZipCodeError() {
    return this.doctorsDialog.get('zipCode').hasError('required')
      ? 'Zipcode is required'
      : this.doctorsDialog.get('zipCode').hasError('pattern')
      ? 'Enter only numbers'
      : !this.state.length
      ? 'Enter valid zipcode'
      : '';
  }

  getErrorCellNo(): string {
    return this.doctorsDialog.get('cellNumber').hasError('required')
      ? 'Contact Number is required'
      : this.doctorsDialog.get('cellNumber').hasError('pattern')
      ? 'Enter Valid Contact Number'
      : '';
  }

  getErrorZipCode(): string {
    return this.doctorsDialog.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.doctorsDialog.get('zipCode').hasError('pattern')
      ? 'Enter 5 digit Zip Code'
      : '';
  }
  getErrorName(): string {
    return this.doctorsDialog.get('firstName')?.hasError('required')
      ? 'First Name is required'
      : this.doctorsDialog.get('firstName')?.hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.doctorsDialog.get('firstName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.doctorsDialog.get('firstName').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : '';
  }
  getErrorMiddleName(): string {
    return this.doctorsDialog.get('middleName')?.hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : '';
  }
  getLastErrorName(): string {
    return this.doctorsDialog.get('lastName')?.hasError('required')
      ? 'Last Name is required'
      : this.doctorsDialog.get('lastName')?.hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.doctorsDialog.get('lastName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      :this.doctorsDialog.get('lastName').hasError('pattern')
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

  getAllSpeciality(): void {
    this.branchService
      .getAllBranchforProvidersWithoutPagination()
      .subscribe((data: any) => {
        this.specialityList = data;
      });
  }
  getFacilityList() {
    this.branchService.getAllBranchforProviders(0, 1000).subscribe((res) => {
      this.facilityList = res.content;
    });
  }

  displayName(obj): any {
    return obj ? obj.name : undefined;
  }

  get emailid(): FormControl {
    return this.doctorsDialog.get('emailId') as FormControl;
  }

  get doctorNPI(): FormControl {
    return this.doctorsDialog.get('providerNPI') as FormControl;
  }
  changeRole() {
    this.doctorsDialog.get('notes').reset();
    this.doctorsDialog.get('medication').reset();
    if (this.doctorsDialog.get('role').value !== 'DOCTOR') {
      this.doctorsDialog.get('specialties').clearValidators();
      this.doctorsDialog.get('specialties').updateValueAndValidity();
    } else if (this.doctorsDialog.get('role').value === 'DOCTOR') {
      this.doctorsDialog.addControl(
        'specialties',
        this.fb.control(null, Validators.compose([Validators.required]))
      );
    }
  }
  onSubmit(value): void {
    this.submitted = true;
    if (this.doctorsDialog.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.doctorsDialog.value;
    formValue.role = formValue.role;
    formValue.emailId = formValue.emailId.toLowerCase();
    formValue.firstName = formValue.firstName.trim();
    formValue.middleName = formValue?.middleName
      ? formValue?.middleName?.trim()
      : null;
    formValue.lastName = formValue.lastName.trim();
    // formValue.clinicIds = this.doctorsDialog.get('clinic').value.toString();
    // formValue.userStatus = formValue.userStatus
    //   ? formValue.userStatus
    //   : 'ACTIVE';
    formValue.providerNPI = formValue.providerNPI
      ? formValue.providerNPI
      : null;
    if (formValue?.specialties?.length) {
      formValue.specialties = formValue.specialties.toString();
    } else {
      delete formValue.specialties;
    }
    formValue.facilityId = formValue.facilityId ? formValue.facilityId : [''];
    if (formValue.role !== 'DOCTOR') {
      formValue.specialties = null;
    } else {
      formValue.medication = true;
      formValue.notes = true;
    }

    if (this.data.mode === 'ADD') {
      delete formValue.id;
      this.doctorService.createCareProvider(formValue).subscribe(
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
        .editDoctor(this.data.edit.careProviderId, formValue)
        .subscribe(
          (data) => {
            this.snackBarService.success('Updated successfully!', 2000);
            this.dialogRef?.close(true);
            this.submitted = false;
          },
          (error) => {
            // this.snackBarService.error(error.message);
            this.submitted = false;
          }
        );
    }
  }
  getNotesCheckedValue(evt) {
    this.doctorsDialog.get('notes').setValue(evt.checked);
  }
  getMedicationCheckedValue(evt) {
    this.doctorsDialog.get('medication').setValue(evt.checked);
  }
}
