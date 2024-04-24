import { ZipStateCityService } from './../../../core/services/zip-state-city.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  startWith,
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { NPINotTaken } from 'src/app/core/validators/async.npi.validators';
import { emailRx, maskRx, phoneNumberRx } from 'src/app/shared/entities/routes';
// import { phoneNumberRx, emailRx } from 'src/app/shared/entities/routes';
@Component({
  selector: 'app-hospital-add-edit',
  templateUrl: './hospital-add-edit.component.html',
  styleUrls: ['./hospital-add-edit.component.scss'],
})
export class HospitalAddEditComponent implements OnInit {
  public addEdithospital: FormGroup;
  public submitted = false;

  status: string[] = ['ACTIVE', 'INACTIVE'];
  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  zipCode: string[] = [];
  zipCodeFilteredOptions: Observable<any>;
  emailidValidation: boolean;

  state: string[] = [];
  public mask = maskRx;
  example: string;
  keyUpObservable: any;
  userRole: any;
  existingNPI: any;
  existingEmail: any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HospitalAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public hospitalService: HospitalManagementService,
    private snackBarService: SnackbarService,
    public dialog: MatDialog,
    private ZipStateCityService: ZipStateCityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.mode === 'EDIT') {
      this.existingNPI = this.data.edit?.hospitalNPI;
      this.existingEmail = this.data.edit?.emailId;
    }
    // const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const phoneNumber = /^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/;
    // const zipCode = /^([0-9]{5})$/;
    // if (this.data.mode === 'EDIT') {
    //   // console.log(this.data);

    //   this.hospitalService
    //     .checkUserIsLoggedIn(this.data?.edit?.id)
    //     .subscribe((res) => {
    //       console.log(res);
    //     });
    // }
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    const name = /^[a-zA-Z ]*$/;
    const spaceValidation = /^(?! ).*/;
    this.addEdithospital = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
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
      addressLine: [
        null,
        [
          Validators.required,
          // Validators.pattern(spaceValidation),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
      ],
      zipCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      hospitalNPI: [
        null,
        [Validators.minLength(10)],

        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingNPI === control.value) {
              return of(null);
            }

            if (control.value && control.value.length > 9) {
              return NPINotTaken.createPracticeNPIValidator(
                this.hospitalService
              )(control);
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      city: [
        null,
        [
          Validators.required,
          Validators.pattern(name),
          this.noWhitespaceValidator,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      state: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(name),
          this.noWhitespaceValidator,
        ],
      ],
      status: [null, Validators.required],
      address: [null],
      country: [null],
    });

    if (this.data.mode === 'ADD') {
      this.addEdithospital.removeControl('status');
      this.emailidValidation = true;
    } else {
      this.emailidValidation = false;
    }

    if (this.data.mode === 'EDIT') {
      // this.addEdithospital.removeControl('emailId');
      // this.addEdithospital.removeControl('hospitalNPI');
      // this.addEdithospital.get('emailId').clearAsyncValidators();
      // this.addEdithospital.get('hospitalNPI').clearAsyncValidators();
      this.addEdithospital.updateValueAndValidity();
      // console.log(this.data?.edit?.address?.country);

      this.getcountry(this.data?.edit?.address?.country);
    }

    // this.ZipStateCityService.getUSZip().subscribe((res: any) => {
    //   this.zipCode = res.data;
    // });
    // this.zipCodeFilteredOptions = this.addEdithospital.get('zipCode').valueChanges.pipe(startWith(null),
    //   map((value) => this._filterZipCodeSearch(value)));

    this.CityFilteredOptions = this.addEdithospital
      .get('city')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCitySearch(value))
      );

    // this.keyUpObservable = this.addEdithospital
    //   .get('zipCode')
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

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data.mode === 'EDIT') {
        this.fillhospitalEditForm(this.data.edit);
      }
    }, 200);
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  get emailid(): FormControl {
    return this.addEdithospital.get('emailId') as FormControl;
  }

  get hospitalNPI(): FormControl {
    return this.addEdithospital.get('hospitalNPI') as FormControl;
  }
  getCountry(event) {
    this.addEdithospital.get('state').setValue(null);
    this.addEdithospital.get('city').setValue(null);
    this.addEdithospital.get('zipCode').reset();
    if (event.value === 'India') {
      this.addEdithospital
        .get('zipCode')
        .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
    } else if (event.value === 'USA') {
      this.addEdithospital
        .get('zipCode')
        .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
    }
  }
  getcountry(event) {
    // this.addEdithospital.get('state').setValue(null);
    // this.addEdithospital.get('city').setValue(null);
    // this.addEdithospital.get('zipCode').reset();
    if (event === 'India') {
      this.addEdithospital
        .get('zipCode')
        .setValidators([Validators.maxLength(6), Validators.minLength(6)]);
    } else if (event === 'USA') {
      this.addEdithospital
        .get('zipCode')
        .setValidators([Validators.maxLength(5), Validators.minLength(5)]);
    }
  }
  changeZipcode() {
    // if (this.addEdithospital.get('zipCode')?.value?.length < 6) {
    //   this.addEdithospital.get('state').setValue(null);
    //   this.addEdithospital.get('city').setValue(null);
    // }
    if (
      this.addEdithospital.get('country')?.value === 'India' &&
      this.addEdithospital.get('zipCode')?.value?.length === 6
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.addEdithospital.get('country')?.value === 'USA' &&
      this.addEdithospital.get('zipCode')?.value?.length === 5
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.addEdithospital.get('country')?.value === 'India' &&
      this.addEdithospital.get('zipCode')?.value?.length < 6
    ) {
      this.addEdithospital.get('state').setValue(null);
      this.addEdithospital.get('city').setValue(null);
    } else if (
      this.addEdithospital.get('country')?.value === 'USA' &&
      this.addEdithospital.get('zipCode')?.value?.length < 5
    ) {
      this.addEdithospital.get('state').setValue(null);
      this.addEdithospital.get('city').setValue(null);
    }
  }

  // -----Function to parse the data to form contol-----------
  private fillhospitalEditForm(parsedData: any): any {
    this.addEdithospital.get('name').setValue(parsedData.name);
    this.addEdithospital.get('country').setValue(parsedData?.address?.country);
    this.addEdithospital
      .get('emailId')
      .setValue(parsedData.emailId ? parsedData.emailId : null);
    this.addEdithospital
      .get('contactNumber')
      .setValue(parsedData.contactNumber);

    if (parsedData.address == null || parsedData.address.city == null) {
      this.addEdithospital.get('city').setValue(null);
    } else {
      this.addEdithospital.get('city').setValue(parsedData.address.city);
    }

    if (parsedData.address == null || parsedData.address.addressLine == null) {
      this.addEdithospital.get('addressLine').setValue(null);
    } else {
      this.addEdithospital
        .get('addressLine')
        .setValue(parsedData.address.addressLine);
    }

    if (parsedData.address == null || parsedData.address.zipCode == null) {
      this.addEdithospital.get('zipCode').setValue(null);
    } else {
      this.addEdithospital.get('zipCode').setValue(parsedData.address.zipCode);
      this.onZipCodeSelection(parsedData.address.zipCode);
    }
    if (parsedData.address == null || parsedData.address.state == null) {
      this.addEdithospital.get('state').setValue(null);
    } else {
      this.addEdithospital.get('state').setValue(parsedData.address.state);
      this.addEdithospital.get('city').setValue(parsedData.address.city);
      // this.locationService.getFilteredJSONData(parsedData.address.state).subscribe((data: any[]) => {
      //   this.city = data;
      // });
    }

    if (parsedData.hospitalNPI == null) {
      this.addEdithospital.get('hospitalNPI').setValue(null);
    } else {
      this.addEdithospital.get('hospitalNPI').setValue(parsedData.hospitalNPI);
    }
    if (parsedData.status == null) {
      this.addEdithospital.get('status').setValue(null);
    } else {
      this.addEdithospital.get('status').setValue(parsedData.status);
    }
  }

  private _filterStatusSearch(value: string): string[] {
    const filterStatusValue = value.toLowerCase();
    return this.status.filter((option) =>
      option.toLowerCase().includes(filterStatusValue)
    );
  }

  getErrorEmail(): any {
    return this.addEdithospital.get('emailId').hasError('required')
      ? 'Email Id is required'
      : this.addEdithospital.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.addEdithospital.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : null;
  }

  getErrorContactNo(): any {
    return this.addEdithospital.get('contactNumber').hasError('required')
      ? 'Contact Number is required'
      : this.addEdithospital.get('contactNumber').hasError('pattern')
      ? 'Enter valid Contact Number'
      : null;
  }

  getErrorZipCode(): any {
    return this.addEdithospital.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.addEdithospital.get('zipCode').hasError('pattern')
      ? 'Please Enter 5 digits'
      : null;
  }

  getErrorName(): any {
    return this.addEdithospital.get('name').hasError('required')
      ? 'Hospital Name is required'
      : this.addEdithospital.get('name').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEdithospital.get('name').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.addEdithospital.get('name').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrorAddress(): any {
    return this.addEdithospital.get('addressLine').hasError('required')
      ? 'Address is required'
      : // : this.addEdithospital.get('addressLine').hasError('pattern')
      // ? 'First character cannot be space'
      this.addEdithospital.get('addressLine').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.addEdithospital.get('addressLine').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrorState(): any {
    return this.addEdithospital.get('state').hasError('required')
      ? 'State is required'
      : this.addEdithospital.get('state').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.addEdithospital.get('state').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEdithospital.get('state').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.addEdithospital.get('state').hasError('maxlength')
      ? 'Max length is 20 characters'
      : null;
  }
  getErrorCity(): any {
    return this.addEdithospital.get('city').hasError('required')
      ? 'City is required'
      : this.addEdithospital.get('city').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.addEdithospital.get('city').hasError('pattern')
      ? 'Only alphabets,space are allowed'
      : this.addEdithospital.get('city').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.addEdithospital.get('city').hasError('maxlength')
      ? 'Max length is 30 characters'
      : null;
  }

  get fields(): any {
    return this.addEdithospital.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    // this.addEdithospital.get('hospitalNPI').setValidators([NPINotTaken.createPracticeNPIValidator(this.hospitalService)]);
    if (this.addEdithospital.invalid) {
      return;
    }
    this.addEdithospital.value.hospitalNPI = this.addEdithospital.value
      .hospitalNPI
      ? this.addEdithospital.value.hospitalNPI
      : null;
    const formValue = this.addEdithospital.value;
    formValue.name = formValue.name.trim();
    formValue.emailId = formValue.emailId.toLowerCase();
    formValue.address = {
      state: formValue.state ? formValue.state.trim() : null,
      city: formValue.city ? formValue.city.trim() : null,
      addressLine: formValue.addressLine ? formValue.addressLine.trim() : null,
      zipCode: formValue.zipCode,
      country: formValue.country,
    };
    if (this.data.mode === 'ADD') {
      this.hospitalService.createhospital(formValue).subscribe(
        () => {
          this.snackBarService.success('Created successfully!', 2000);
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBarService.error(error.message);
          this.submitted = false;
        }
      );
    } else {
      this.hospitalService.edithospital(this.data.edit.id, formValue).subscribe(
        () => {
          this.snackBarService.success('Updated successfully!', 2000);
          this.dialogRef.close(true);
        },
        (error) => {
          if (error.err === 409) {
            this.snackBarService.error(error.message);
          }
          this.submitted = false;
        }
      );
    }
  }

  getZipCodeError() {
    return this.addEdithospital.get('zipCode').hasError('required')
      ? 'Zipcode is required'
      : this.addEdithospital.get('zipCode').hasError('maxlength')
      ? this.addEdithospital.get('country')?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : !this.state.length
      ? this.addEdithospital.get('country')?.value === 'India'
        ? 'Enter valid 6 digit zipcode'
        : 'Enter valid 5 digit zipcode'
      : this.addEdithospital.get('zipCode').hasError('minlength')
      ? this.addEdithospital.get('country')?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : '';
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
  onZipCodeSelection(data): any {
    this.state = [];
    this.city = [];
    let zipcodeVal;
    if (!data) {
      zipcodeVal = this.addEdithospital.get('zipCode').value;
    } else {
      zipcodeVal = data;
    }
    // let zipcodeVal = this.addEdithospital.get('zipCode').value;
    if (
      this.addEdithospital.get('country')?.value === 'India' &&
      this.addEdithospital.get('zipCode')?.value?.length === 6
    ) {
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;
            this.addEdithospital.get('city').setValue(this.city);
            this.addEdithospital.get('state').setValue(this.state);
          } else if (!this.addEdithospital.get('state').value) {
            this.snackBarService.error('Enter state manually');
          }
        },
        (err) => {
          // this.addEdithospital.get('zipCode').setValue(null);
          // this.addEdithospital.get('state').setValue(null);
        }
      );
    } else if (
      this.addEdithospital.get('country')?.value === 'USA' &&
      this.addEdithospital.get('zipCode')?.value?.length === 5
    ) {
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;
            this.addEdithospital.get('city').setValue(this.city);
            this.addEdithospital.get('state').setValue(this.state);
          } else if (!this.addEdithospital.get('state').value) {
            this.snackBarService.error('Enter state manually');
          }
        },
        (err) => {
          // this.addEdithospital.get('zipCode').setValue(null);
          // this.addEdithospital.get('state').setValue(null);
        }
      );
    }
  }
}
