import { AuthService } from 'src/app/core/services/auth.service';
import { ZipStateCityService } from './../../core/services/zip-state-city.service';
import { CaregiverService } from './../caregiver.service';
import { DoctorService } from './../../doctor-management/service/doctor.service';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { LocationService } from 'src/app/core/services/location.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { maskRx } from 'src/app/shared/entities/routes';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';

@Component({
  selector: 'app-caregiver-dialog',
  templateUrl: './caregiver-dialog.component.html',
  styleUrls: ['./caregiver-dialog.component.scss'],
})
export class CaregiverDialogComponent implements OnInit {
  caregiverForm: FormGroup;
  public submitted = false;
  filteredHospital: Observable<any>;
  state: string[] = [];
  city: string[] = [];
  clinicList = [];
  practiceList = [];
  eleData: any;
  userRole: string;
  CityFilteredOptions: Observable<any>;
  zipCode: string[] = [];
  zipCodeFilteredOptions: Observable<any>;
  public mask = maskRx;
  keyUpObservable: any;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public caregiverService: CaregiverService,
    private branchService: BranchService,
    public ZipStateCityService: ZipStateCityService,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // Used in modal for close()
    public dialogRef: MatDialogRef<CaregiverDialogComponent>,
    public snackBarService: SnackbarService,
    private locationService: LocationService,
    private authService: AuthService
  ) {
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
    this.eleData = data.data;
  }

  ngOnInit(): void {
    this.validateForm();
    // this.locationService.getJSONData().subscribe((res: any) => {
    //   this.state = Object.keys(res);
    // });
    this.CityFilteredOptions = this.caregiverForm.get('city').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCitySearch(value))
    );

    this.keyUpObservable = this.caregiverForm
      .get('zipCode')
      ?.valueChanges.pipe(
        map((data: any) => {
          return data;
        }),
        filter((res) => res.length > 5),

        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((phoneStr) => {
        this.onZipCodeSelection('');
      });


    if (this.eleData) {
      this.caregiverForm.get('email').clearAsyncValidators();
      this.caregiverForm.get('email').updateValueAndValidity();
      this.caregiverForm.get('name').setValue(this.eleData.name);
      this.caregiverForm.get('email').setValue(this.eleData.email);
      // let contactNumber = this.eleData.contactNo.substring(0, this.eleData.contactNo.length-3);
      this.caregiverForm.get('contactNo').setValue(this.eleData.contactNo);
      this.caregiverForm.get('state').setValue(this.eleData.address?.state);
      this.caregiverForm.get('city').setValue(this.eleData.address?.city);
      this.caregiverForm
        .get('address')
        .setValue(this.eleData.address?.addressLine);
      this.caregiverForm.get('zipCode').setValue(this.eleData.address?.zipCode);
      this.onZipCodeSelection(this.eleData?.address?.zipCode);
    }
    if (
      this.userRole === 'hospital_USER' ||
      this.userRole === 'BRANCH_USER'
    ) {
      this.getPractices();
      this.caregiverForm.get('hospital').clearAsyncValidators();
      this.caregiverForm.get('hospital').updateValueAndValidity();
      this.caregiverForm.get('branch').clearAsyncValidators();
      this.caregiverForm.get('branch').updateValueAndValidity();

    } else {
      this.doctorService.getPracticeList().subscribe(
        (res: any) => {
          this.practiceList = res.hospitalList;
        },
        (err) => {
          // this.snackBarService.error(err.message);
        }
      );
      this.doctorService.getPracticeList().subscribe(
        (res: any) => {
          this.practiceList = res.hospitalList;
          const org_data = this.practiceList.find((ele) => {
            return ele.id == this.eleData.hospitalId;
          });
          this.caregiverForm.get('hospital').setValue(org_data);
        },
        (err) => {
          // this.snackBarService.error(err.message);
        }
      );
      if (!this.eleData) {
        this.branchService.getBranchDropdownList().subscribe((data: any) => {
          this.clinicList = data['branchList'];
          const branch_data = this.clinicList.find((ele) => {
            return ele.id == this.eleData.branchId;
          });
          this.caregiverForm.get('branch').setValue(branch_data);
        });
      } else {
        this.branchService.getFilteredhospitalBranch(this.eleData.hospitalId).subscribe((data: any) => {
          this.clinicList = data['branchList'];
          const branch_data = this.clinicList.find((ele) => {
            return ele.id == this.eleData.branchId;
          });
          this.caregiverForm.get('branch').setValue(branch_data);
        });

      }
    }
  }
  changeZipcode() {
    if (this.caregiverForm.get('zipCode')?.value?.length < 6) {
      this.caregiverForm.get('state').setValue(null);
    }
  }
  getErrorContactNo(): any {
    return this.caregiverForm.get('contactNo').hasError('required')
      ? 'Contact Number is required'
      : this.caregiverForm.get('contactNo').hasError('pattern')
        ? 'Enter Valid Contact Number'
        : '';
  }
  onStateSelection(event: any): any {
    this.city = [];
    this.state.forEach((ele) => {
      if (event == ele['primary_city']) { this.city.push(ele['primary_city']); }
    });
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
    if (!this.caregiverForm.get('zipCode').value || this.caregiverForm.get('zipCode').value?.length < 6) {
      this.snackBarService.error('Enter 6 digit zipcode');
      return;
    }
    let zipcodeVal;
    this.state = [];
    if (!data) {
      zipcodeVal = this.caregiverForm.get('zipCode').value;
    } else {
      zipcodeVal = data;
    }
    this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
      (res: any[]) => {
        if (res['results'].length) {
          this.state =
            res['results'][0].address_components[
              res['results'][0].address_components.length - 2
            ].long_name; this.caregiverForm.get('state').setValue(this.state);
        } else if (!this.caregiverForm.get('state').value) {
          this.snackBarService.error('Enter state manually');
        }
      },
      (err) => {
        // this.caregiverForm.get('zipCode').setValue(null);
        // this.caregiverForm.get('state').setValue(null);
      }
    );
  }
  private _filterZipCodeSearch(value) {
    const filterzipCodeValue = value;
    return this.zipCode.filter((option) =>
      option.toString().includes(filterzipCodeValue)
    );
  }
  getZipCodeError() {
    return this.caregiverForm.get('zipCode').hasError('required')
      ? 'Zipcode is required'
      : this.caregiverForm.get('zipCode').hasError('pattern')
        ? 'Enter only numbers'
        : !this.state.length
          ? 'Enter valid zipcode'
          : '';
  }
  private validateForm() {
    const emailregex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumber = /^(?!0+$)\d{10,}$/;
    const zipCode = /^([0-9]{5})$/;
    this.caregiverForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]*$'),
          Validators.minLength(3),
        ],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(emailregex)],
        EmailNotTaken.createValidator(this.authService),
      ],
      contactNo: [null, [Validators.required, Validators.pattern(phoneNumber)]],
      hospital: [null, Validators.required],
      branch: [null, Validators.required],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      zipCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      address: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  getPractices(): any {
    this.practiceList = [];
    this.doctorService.getPracticeList().subscribe(
      (data: any) => {
        this.practiceList = data.hospitalList.filter(
          (element) => element.name != null
        );
        this.caregiverForm.get('hospital').setValue(this.practiceList[0]);
        this.onPracticeSelection(this.practiceList[0]);
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }
  onPracticeSelection(event): any {
    this.clinicList = [];
    // this.doctorService.getClinicList(event.id).subscribe((data: any) => {
    //   this.clinicList = data.branchList;
    //   if (
    //     this.userRole === 'hospital_USER' ||
    //     this.userRole === 'BRANCH_USER'
    //   ) {
    //     this.clinicList = data.branchList.filter(
    //       (element) => element?.name != null
    //     );
    //     if (!this.clinicList.length) {
    //       this.snackBarService.error('No clinic available');
    //     }
    //     if (this.clinicList.length > 1) {
    //       this.clinicList.forEach((datas) => {
    //         if (
    //           this.eleData &&
    //           this.eleData.branchId &&
    //           datas.id === this.eleData.branchId
    //         ) {
    //           this.caregiverForm.get('branch').setValue(datas);
    //         }
    //       });
    //     } else {
    //       this.caregiverForm.get('branch').setValue(this.clinicList[0]);
    //     }
    //   } else {
    //     if (!this.clinicList.length) {
    //       this.snackBarService.error('No clinic available');
    //     }
    //     this.clinicList = data.branchList;
    //     const branchValue = this.clinicList.filter((res) => {
    //       return res.id === this.eleData.branchId;
    //     });
    //     this.caregiverForm.get('branch').setValue(branchValue[0]);
    //   }
    // });
  }

  // getBranchList(): void {
  //   this.clinicList = [];
  //   this.branchService.getBranchDropdownList().subscribe((data: any) => {
  //     this.clinicList = data.branchList.filter(element => element.name === this.caregiverForm.get('branch').value.name);
  //     if (this.userRole === 'hospital_USER' || this.userRole === 'BRANCH_USER') {
  //       this.caregiverForm.get('branch').setValue(this.clinicList[0]);
  //     }
  //   });
  // }
  getErrorName(): any {
    return this.caregiverForm.get('name').hasError('required')
      ? 'Name is required'
      : this.caregiverForm.get('name').hasError('pattern')
        ? 'Only alphabets,space,dot & apostrophe are allowed'
        : this.caregiverForm.get('name').errors
          ? 'Enter minimum 3 characters'
          : '';
  }
  getErrorAddress(): any {
    return this.caregiverForm.get('address').hasError('required')
      ? 'Address is required'
      : this.caregiverForm.get('address').errors
        ? 'Enter minimum 3 characters'
        : '';
  }
  getErrorEmail(): any {
    // this.caregiverForm.setValidators(EmailNotTaken.createValidator(this.auth))
    return this.caregiverForm.get('email').hasError('required')
      ? 'Email Id is required'
      : this.caregiverForm.get('email').hasError('pattern')
        ? 'Not a valid email address'
        : this.caregiverForm.get('email').hasError('alreadyInUse')
          ? 'This email address is already in use'
          : '';
  }
  getErrorZipCode(): any {
    return this.caregiverForm.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.caregiverForm.get('zipCode').hasError('pattern')
        ? 'Enter 5 digit Zip Code'
        : '';
  }
  getErrorHomeNo(): any {
    return this.caregiverForm.get('contactNo').hasError('required')
      ? 'Home number is required'
      : this.caregiverForm.get('contactNo').hasError('pattern')
        ? 'Enter Valid Contact Number'
        : '';
  }

  get emailId(): FormControl {
    return this.caregiverForm.get('email') as FormControl;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.caregiverForm.invalid) {
      // this.submitted = false;
      return;
    }
    const formValue = this.caregiverForm.value;
    formValue.email = formValue.email.toLowerCase();
    formValue.name = formValue.name.trim();
    formValue.hospitalId = this.caregiverForm.get('hospital').value.id;
    formValue.hospitalName =
      this.caregiverForm.get('hospital').value.name;
    formValue.branchName = this.caregiverForm.get('branch').value.name;
    formValue.branchId = this.caregiverForm.get('branch').value.id;
    (formValue.address = {
      city: this.caregiverForm.get('city').value.trim(),
      state: this.caregiverForm.get('state').value,
      addressLine: this.caregiverForm.get('address').value.trim(),
      zipCode: this.caregiverForm.get('zipCode').value,
    }),
      delete formValue.hospital;
    delete formValue.branch;

    if (!this.eleData) {
      this.caregiverService.addCaregiver(formValue).subscribe(
        () => {
          this.snackBarService.success('Created successfully!');
          this.dialogRef.close();
          this.submitted = false;
        },
        (error) => {
          // this.snackBarService.error(error.message);
          this.submitted = false;
          if (error.err === 409) {
            this.snackBarService.error(error.message);
          }
        }
      );
    } else {
      this.caregiverService
        .editCaregiver(this.eleData.careGiverId, formValue)
        .subscribe(
          () => {
            this.snackBarService.success('Updated successfully!');
            this.dialogRef.close();
            this.submitted = false;
          },
          (error) => {
            // this.snackBarService.error(error.message);
            if (error.err === 409) {
              this.snackBarService.error(error.message);
            }
            this.submitted = false;
          }
        );
    }
  }
}
