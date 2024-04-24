import { AuthService } from 'src/app/core/services/auth.service';
import { ZipStateCityService } from './../../../core/services/zip-state-city.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { BranchService } from '../branch.service';
import { LocationService } from 'src/app/core/services/location.service';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import { HospitalManagementService } from '../../../hospital-management/service/hospital-management.service';
import { NPINotTaken } from 'src/app/core/validators/async.npi.validators';
import { emailRx, maskRx, phoneNumberRx } from 'src/app/shared/entities/routes';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';

@Component({
  selector: 'app-branch-add-edit',
  templateUrl: './branch-add-edit.component.html',
  styleUrls: ['./branch-add-edit.component.scss'],
})
export class BranchAddEditComponent implements OnInit {
  mask = maskRx;
  userRole: string;
  // clinicTimingForm: FormGroup;
  maxDate: Date = new Date();
  user: any;
  existingNPI: any;
  existingEmail: any;
  constructor(
    private fb: FormBuilder,
    private branchservice: BranchService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BranchAddEditComponent>,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private ZipStateCityService: ZipStateCityService
  ) {
    this.user = this.auth.authData;
    this.userRole = this.user?.userDetails?.userRole;

    // this.clinicTimingForm = this.fb.group({
    //   session1ContactNumber: [
    //     this.data.value ? this.data.value.session1ContactNumber : null,
    //     [Validators.required, Validators.pattern(phoneNumberRx)],
    //   ],
    //   session1From: [
    //     this.data.value ? new Date(this.data.value.session1From) : null,
    //     [Validators.required],
    //   ],
    //   session1To: [
    //     this.data.value ? new Date(this.data.value.session1To) : null,
    //     [Validators.required],
    //   ],
    //   session2ContactNumber: [
    //     this.data.value ? this.data.value.session2ContactNumber : null,
    //   ],
    //   session2From: [
    //     this.data.value && this.data.value.session2From
    //       ? new Date(this.data.value.session2From)
    //       : null,
    //   ],
    //   session2To: [
    //     this.data.value && this.data.value.session2To
    //       ? new Date(this.data.value.session2To)
    //       : null,
    //   ],
    // });
  }
  branchForm: FormGroup;
  private keyUpObservable!: any;
  branchId: any = null;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  state: string[] = [];
  city: string[] = [];
  hospital = [];
  CityFilteredOptions: Observable<any>;
  zipCode: string[] = [];
  zipCodeFilteredOptions: Observable<any>;
  isSubmitted = false;
  branchTypes = [
    { value: 'CLINIC', viewValue: 'Clinic' },
    { value: 'HOSPITAL', viewValue: 'Hospital' },
  ];
  initializeBranchAddEditForm(): void {
    const name = /^[a-zA-Z.'\s]*$/;
    const npi = /^([0-9]{10})$/;
    const mobileNoPattern = /^[0-9\-]*$/;
    this.branchForm = this.fb.group({
      name: [
        this.data.value ? this.data.value.name : null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
      ],
      emailId: [
        this.data.value ? this.data?.value?.emailId : null,
        [Validators.required, Validators.pattern(emailRx)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingEmail === control.value) {
              return of(null);
            }
            if (control.value && control.value.length) {
              return EmailNotTaken.createValidator(this.auth)(control);
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      emergencyContactNumber: [
        this.data.value ? this.data.value.emergencyContactNumber : null,
        [Validators.required, Validators.pattern(phoneNumberRx)],
      ],
      pcontact: [
        this.data.value ? this.data.value.primaryContactNumber : null,
        [Validators.required, Validators.pattern(phoneNumberRx)],
      ],
      country: [
        this.data.value ? this.data.value.address.country : null,
        [Validators.required],
      ],
      city_name: [
        this.data.value && this.data.value.address
          ? this.data.value.address.city
          : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(name),
          Validators.maxLength(30),
          this.noWhitespaceValidator,
        ]),
      ],
      state_name: [
        this.data.value && this.data.value.address
          ? this.data.value.address.state
          : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(name),
          Validators.maxLength(20),
          this.noWhitespaceValidator,
        ]),
      ],
      address: [
        this.data.value && this.data.value.address
          ? this.data.value.address.addressLine
          : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ]),
      ],
      zip_code: [
        this.data.value && this.data.value.address
          ? this.data.value.address.zipCode
          : null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      clinic_npi: [
        this.data.value && this.data.value?.facilityNPI
          ? this.data.value.facilityNPI
          : null,
        [Validators.pattern(/^[0-9]+$/), Validators.minLength(10)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingNPI === control.value) {
              return of(null);
            }
            if (control.value && control.value.length > 9) {
              return NPINotTaken.createClinicNPIValidator(this.branchservice)(
                control
              );
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      status: [this.data.value ? this.data.value.status : null],
    });
    if (this.data.value) {
      this.onZipCodeSelection(this.data.value?.address?.zipCode);
      this.getcountry(this.data.value ? this.data.value.address.country : null);
    }
  }

  ngOnInit(): void {
    if (this.data.add === 'edit') {
      this.existingNPI = this.data?.value?.facilityNPI;
      this.existingEmail = this.data?.value?.emailId;
    }

    const coeff = 1000 * 60 * 5;
    const date = new Date();
    this.maxDate = new Date(Math.round(date.getTime() / coeff) * coeff);
    this.branchId = this.data && this.data.value ? this.data.value.id : null;
    this.initializeBranchAddEditForm();
    // this.ZipStateCityService.getUSZip().subscribe((res: any) => {
    //   this.zipCode = res.data;
    // });
    // this.zipCodeFilteredOptions = this.branchForm.get('zip_code').valueChanges.pipe(startWith(null),
    //   map((value) => this._filterZipCodeSearch(value)));

    this.CityFilteredOptions = this.branchForm
      .get('city_name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCitySearch(value))
      );

    if (this.data.add === 'add') {
      this.branchForm.removeControl('status');
    } else {
      // this.branchForm.get('clinic_npi').clearAsyncValidators();
      // this.branchForm.get('emailId').clearAsyncValidators();
      this.branchForm.updateValueAndValidity();
    }
    // this.keyUpObservable = this.branchForm
    //   .get('zip_code')
    //   ?.valueChanges.pipe(
    //     map((data: any) => {
    //       return data;
    //     }),
    //     filter((res) => res?.length > 5),

    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((phoneStr) => {
    //     this.onZipCodeSelection('');
    //   });
  }
  getCountry(event) {
    this.branchForm.get('state_name').setValue(null);
    this.branchForm.get('city_name').setValue(null);
    this.branchForm.get('zip_code').reset();
    if (event.value === 'India') {
      this.branchForm
        .get('zip_code')
        .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
    } else if ('USA') {
      this.branchForm
        .get('zip_code')
        .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
    } else {
      this.branchForm.get('zip_code').reset();
      if (event.value === 'India') {
        this.branchForm
          .get('zip_code')
          .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
      } else if ('USA') {
        this.branchForm
          .get('zip_code')
          .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
      }
    }
  }
  getcountry(event) {
    // this.branchForm.get('state_name').setValue(null);
    // this.branchForm.get('city_name').setValue(null);
    // this.branchForm.get('zip_code').reset();
    if (event === 'India') {
      this.branchForm
        .get('zip_code')
        .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
    } else if ('USA') {
      this.branchForm
        .get('zip_code')
        .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
    } else {
      this.branchForm.get('zip_code').reset();
      if (event === 'India') {
        this.branchForm
          .get('zip_code')
          .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
      } else if ('USA') {
        this.branchForm
          .get('zip_code')
          .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
      }
    }
  }
  changeZipcode() {
    if (
      this.branchForm.get('country')?.value === 'India' &&
      this.branchForm.get('zip_code')?.value?.length === 6
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.branchForm.get('country')?.value === 'USA' &&
      this.branchForm.get('zip_code')?.value?.length === 5
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.branchForm.get('country')?.value === 'India' &&
      this.branchForm.get('zip_code')?.value?.length < 6 &&
      this.branchForm.get('zip_code')?.value?.length > 1
    ) {
      this.branchForm.get('state_name').setValue(null);
      this.branchForm.get('city_name').setValue(null);
    } else if (
      this.branchForm.get('country')?.value === 'USA' &&
      this.branchForm.get('zip_code')?.value?.length < 5 &&
      this.branchForm.get('zip_code')?.value?.length > 1
    ) {
      this.branchForm.get('state_name').setValue(null);
      this.branchForm.get('city_name').setValue(null);
    } else if (this.branchForm.get('zip_code')?.value?.length === 0) {
      if (this.branchForm.get('country')?.value === 'India') {
        this.branchForm
          .get('zip_code')
          .setValidators([
            Validators.required,
            Validators.maxLength(6),
            Validators.minLength(6),
          ]);
      } else if ('USA') {
        this.branchForm
          .get('zip_code')
          .setValidators([
            Validators.required,
            Validators.maxLength(5),
            Validators.minLength(5),
          ]);
      }
      // this.branchForm.get('zip_code').setValidators([Validators.required]);
      this.branchForm.get('zip_code').updateValueAndValidity();
      this.branchForm.get('zip_code').setValue(null);
      this.branchForm.get('state_name').setValue(null);
      this.branchForm.get('city_name').setValue(null);
    }
  }
  onZipCodeSelection(data): any {
    this.state = [];
    this.city = [];
    let zipcodeVal;
    if (!data) {
      zipcodeVal = this.branchForm.get('zip_code').value;
    } else {
      zipcodeVal = data;
    }
    if (
      this.branchForm.get('country')?.value === 'India' &&
      this.branchForm.get('zip_code')?.value?.length === 6
    ) {
      // let zipcodeVal = this.branchForm.get('zip_code').value;
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;
            this.branchForm.get('city_name').setValue(this.city);
            this.branchForm.get('state_name').setValue(this.state);
          } else if (!this.branchForm.get('state_name').value) {
            this.snackBarService.error('Enter state and city manually');
          }
        },
        (err) => {
          // this.branchForm.get('zip_code').setValue(null);
          // this.branchForm.get('state_name').setValue(null);
        }
      );
    } else if (
      this.branchForm.get('country')?.value === 'USA' &&
      (this.branchForm.get('zip_code')?.value?.length === 5 ||
        this.branchForm.get('zip_code')?.value?.length === 10)
    ) {
      // let zipcodeVal = this.branchForm.get('zip_code').value;
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;
            this.branchForm.get('city_name').setValue(this.city);
            this.branchForm.get('state_name').setValue(this.state);
          } else if (!this.branchForm.get('state_name').value) {
            this.snackBarService.error('Enter state and city manually');
          }
        },
        (err) => {
          // this.branchForm.get('zip_code').setValue(null);
          // this.branchForm.get('state_name').setValue(null);
        }
      );
    }
  }

  getErrorPrimaryContactNo(): any {
    return this.branchForm.get('pcontact').hasError('required')
      ? 'Contact Number is required'
      : this.branchForm.get('pcontact').hasError('pattern')
      ? 'Please Enter valid Contact Number'
      : null;
  }
  getErrorEmergencyContactNo(): any {
    return this.branchForm.get('emergencyContactNumber').hasError('required')
      ? 'Emergency Contact Number is required'
      : this.branchForm.get('emergencyContactNumber').hasError('pattern')
      ? 'Please Enter valid Emergency Contact Number'
      : null;
  }
  get emailid(): FormControl {
    return this.branchForm.get('emailId') as FormControl;
  }

  getZipCodeError() {
    return this.branchForm.get('zip_code').hasError('required')
      ? 'Zipcode is required'
      : this.branchForm.get('zip_code').hasError('maxlength')
      ? this.branchForm.get('country')?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : !this.state.length
      ? this.branchForm.get('country')?.value === 'India'
        ? 'Enter valid 6 digit zipcode'
        : 'Enter valid 5 digit zipcode'
      : this.branchForm.get('zip_code').hasError('minlength')
      ? this.branchForm.get('country')?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : '';
  }
  getClinicNpiError() {
    return this.branchForm.get('clinic_npi').hasError('pattern')
      ? 'Enter only numbers'
      : this.branchForm.get('clinic_npi').hasError('minlength')
      ? 'Enter 10 digit Facility NPI'
      : this.branchForm.get('clinic_npi').hasError('clinicNPITaken')
      ? 'This Facility NPI is already exists.'
      : '';
  }
  getErrorEmail(): any {
    return this.branchForm.get('emailId').hasError('required')
      ? 'Email is required'
      : this.branchForm.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.branchForm.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : null;
  }

  getErrorZipCode(): any {
    return this.branchForm.get('zip_code').hasError('required')
      ? 'Zip code is required'
      : this.branchForm.get('zip_code').hasError('pattern')
      ? 'Please Enter 5 digits'
      : null;
  }
  getErrorPrimaryPersonContactNo(): string {
    return this.branchForm.get('prcontact').hasError('pattern')
      ? 'Please Enter valid Contact Number'
      : null;
  }

  getErrorName(): string {
    return this.branchForm.get('name').hasError('required')
      ? 'Facility Name is required'
      : this.branchForm.get('name').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.branchForm.get('name').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.branchForm.get('name').errors
      ? 'Enter minimum 3 characters'
      : null;
  }
  getErrorPrName(): string {
    return this.branchForm.get('prname').errors
      ? 'Enter minimum 3 characters'
      : null;
  }
  getErrorAddress(): string {
    return this.branchForm.get('address').hasError('required')
      ? 'Address is required'
      : this.branchForm.get('address').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.branchForm.get('address').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit(): void {
    if (
      this.branchForm.get('country').value === 'USA' &&
      this.branchForm.get('zip_code').value.length > 5
    ) {
      this.snackBarService.error('Enter valid zipcode');
      return;
    }
    const body = {
      name: this.branchForm.get('name').value?.trim(),
      address: {
        city: this.branchForm.get('city_name').value?.trim(),
        state: this.branchForm.get('state_name').value?.trim(),
        addressLine: this.branchForm.get('address').value?.trim(),
        zipCode: this.branchForm.get('zip_code').value,
        country: this.branchForm.get('country').value,
      },
      emergencyContactNumber: this.branchForm.get('emergencyContactNumber')
        .value,
      primaryContactNumber: this.branchForm.get('pcontact').value,
      emailId: this.branchForm.get('emailId').value,
      facilityNPI: this.branchForm.get('clinic_npi').value
        ? this.branchForm.get('clinic_npi').value
        : null,
      hospitals: this.user?.userDetails['scopeId'],
      status: this.branchForm.get('status')?.value,
      // session1ContactNumber: this.clinicTimingForm.get('session1ContactNumber')
      //   .value,
      // session1From: this.clinicTimingForm.get('session1From').value,
      // session1To: this.clinicTimingForm.get('session1To').value,
      // session2ContactNumber: this.clinicTimingForm.get('session2ContactNumber')
      //   .value,
      // session2From: this.clinicTimingForm.get('session2From').value,
      // session2To: this.clinicTimingForm.get('session2To').value,
    };
    // this.isSubmitted = true;

    // if (this.branchForm.valid && this.clinicTimingForm.valid) {
    // if (this.branchForm.valid) {
    if (this.data.add === 'add') {
      this.branchservice.addBranch(body).subscribe(
        (res) => {
          this.snackBarService.success('Facility added successfully');
          this.dialogRef.close(true);
          this.isSubmitted = true;
        },
        (err) => {
          // this.snackBarService.error(err.message);
          this.isSubmitted = false;
        }
      );
    } else {
      this.branchservice.editBranch(this.data.value.id, body).subscribe(
        (res) => {
          this.snackBarService.success('Facility updated successfully');
          this.dialogRef.close(true);
          this.isSubmitted = false;
        },
        (err) => {
          // this.snackBarService.error(err.message);
          this.isSubmitted = false;
        }
      );
    }
    // } else {
    //   this.isSubmitted = false;
    // }
  }

  get clinicNPI(): FormControl {
    return this.branchForm.get('clinic_npi') as FormControl;
  }

  onStateSelection(event: any): any {
    this.city = [];
    this.state.forEach((ele) => {
      if (event == ele['primary_city']) {
        this.city.push(ele['primary_city']);
      }
    });
  }
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
  private _filterCitySearch(value: string): string[] {
    const filterCityValue = value.toLowerCase();
    return this.city.filter((option) =>
      option.toLowerCase().includes(filterCityValue)
    );
  }

  keyUp(event): any {
    event.target.value = event.target.value.trim();
  }

  // get session1ContactNumber(): FormControl {
  //   return this.clinicTimingForm.get('session1ContactNumber') as FormControl;
  // }
  // get session2ContactNumber(): FormControl {
  //   return this.clinicTimingForm.get('session2ContactNumber') as FormControl;
  // }
  // getSession1TimeFromError() {
  //   return this.clinicTimingForm.get('session1From').hasError('required')
  //     ? 'Session 1 Time From is required'
  //     : this.clinicTimingForm.get('session1From').value >
  //       this.clinicTimingForm.get('session1To').value
  //       ? 'Session 1 Time From should be less than Session 1 Time To'
  //       : null;
  // }
  // getSession1TimeToError() {
  //   return this.clinicTimingForm.get('session1To').hasError('required')
  //     ? 'Session 1 Time From is required'
  //     : this.clinicTimingForm.get('session1To').value <
  //       this.clinicTimingForm.get('session1From').value
  //       ? 'Session 1 Time To should be greater than Session 1 Time From'
  //       : null;
  // }
}
