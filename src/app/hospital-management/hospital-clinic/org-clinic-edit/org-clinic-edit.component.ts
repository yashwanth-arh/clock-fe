import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { BranchService } from '../../../branches/branch/branch.service';
import { LocationService } from 'src/app/core/services/location.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { maskRx,phoneNumberRx } from 'src/app/shared/entities/routes';
// import { phoneNumberRx } from 'src/app/shared/entities/routes';

@Component({
  selector: 'app-org-clinic-edit',
  templateUrl: './org-clinic-edit.component.html',
  styleUrls: ['./org-clinic-edit.component.scss'],
})
export class OrgClinicEditComponent implements OnInit {
  orgBranchForm: FormGroup;
  branchId: any = '';
  status: string[] = ['ACTIVE', 'INACTIVE'];
  state: string[] = [];
  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  hospital = [];
  mask = maskRx;

  initializeBranchAddEditForm(): void {
    const phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const zipCode = /^(\+\d{1,3}[- ]?)?\d{6}$/;
    this.orgBranchForm = this.fb.group({
      name: [this.data.value ? this.data.value.name : null, Validators.required],
      emergencyContactNumber: [this.data.value ? this.data.value.emergencyContactNumber : null, [Validators.pattern(phoneNumberRx)]],
      primaryContactNumber: [
        this.data.value ? this.data.value.primaryContactNumber : null,
        [Validators.required, Validators.pattern(phoneNumber)],
      ],
      emailId: [
        this.data.value ? this.data.value.emailId : null,
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      city: [this.data.value && this.data.value.address ? this.data.value.address.city : null, Validators.required],
      state: [this.data.value && this.data.value.address ? this.data.value.address.state : null, Validators.required],
      addressLine: [this.data.value && this.data.value.address ? this.data.value.address.addressLine : null],
      zipCode: [
        this.data.value && this.data.value.address ? this.data.value.address.zipCode : null,
        [Validators.required, Validators.pattern(zipCode)],
      ],
      clinicNPI: [this.data.value && this.data.value.clinicNPI ? this.data.value.clinicNPI : null, Validators.required],
      status: [this.data.value ? this.data.value.status : null, Validators.required],
    });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private branchservice: BranchService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrgClinicEditComponent>,
    private snackBarService: SnackbarService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.branchId = this.data ? this.data.id : '';
    const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const zipCode = /^([0-9]{5})$/;
    this.orgBranchForm = this.fb.group({
      name: [null, Validators.required],
      primaryContactNumber: [null, [Validators.required, Validators.pattern(phoneNumber)]],
      emergencyContactNumber: [null, [Validators.pattern(phoneNumber)]],
      // emailId: [null, [Validators.required, Validators.pattern(emailregex)]],
      city: [null, Validators.required],
      state: [null, Validators.required],
      addressLine: [null],
      zipCode: [null, [Validators.required, Validators.pattern(zipCode)]],
      clinicNPI: [null, Validators.compose([Validators.required, Validators.maxLength(16)])],
      status: [null, Validators.required],
    });

    this.locationService.getJSONData()?.subscribe((res: any) => {
      this.state = Object.keys(res);
    });

    if (this.data.add === 'add') {
      this.orgBranchForm.removeControl('status');
    }

    this.CityFilteredOptions = this.orgBranchForm.get('city').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCitySearch(value))
    );
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data !== 'null') {
        this.fillhospitalClinicEditForm(this.data);
      }
    }, 200);
  }

  private fillhospitalClinicEditForm(parsedData: any): any {
    this.orgBranchForm.get('name').setValue(parsedData.name);
    // this.orgBranchForm.get('emailId').setValue(parsedData.emailId);
    this.orgBranchForm.get('primaryContactNumber').setValue(parsedData.primaryContactNumber);
    this.orgBranchForm.get('emergencyContactNumber').setValue(parsedData.emergencyContactNumber);
    if (parsedData.address?.state == null) {
      this.orgBranchForm.get('state').setValue(null);
    } else {
      this.orgBranchForm.get('state').setValue(parsedData.address.state);
      // this.locationService.getFilteredJSONData(parsedData.address.state).subscribe((data: any[]) => {
      //   this.city = data;
      // });
    }
    if (parsedData.address?.city == null) {
      this.orgBranchForm.get('city').setValue(null);
    } else {
      this.orgBranchForm.get('city').setValue(parsedData.address.city);
    }

    if (parsedData.address?.addressLine == null) {
      this.orgBranchForm.get('addressLine').setValue(null);
    } else {
      this.orgBranchForm.get('addressLine').setValue(parsedData.address.addressLine);
    }

    if (parsedData.address?.zipCode == null) {
      this.orgBranchForm.get('zipCode').setValue(null);
    } else {
      this.orgBranchForm.get('zipCode').setValue(parsedData.address.zipCode);
    }

    if (parsedData?.clinicNPI == null) {
      this.orgBranchForm.get('clinicNPI').setValue(null);
    } else {
      this.orgBranchForm.get('clinicNPI').setValue(parsedData.clinicNPI);
    }
    if (parsedData?.status == null) {
      this.orgBranchForm.get('status').setValue(null);
    } else {
      this.orgBranchForm.get('status').setValue(parsedData.status);
    }
  }

  getErrorPrimaryContactNo(): any {
    return this.orgBranchForm.get('primaryContactNumber').hasError('required')
      ? 'Primary contact number is required'
      : this.orgBranchForm.get('primaryContactNumber').hasError('pattern')
        ? 'Enter valid Mobile Number'
        : '';
  }

  getErrorEmerContactNo(): any {
    return this.orgBranchForm.get('emergencyContactNumber').hasError('pattern') ? 'Enter valid Mobile Number' : '';
  }

  getErrorEmail(): any {
    return this.orgBranchForm.get('emailId').hasError('required')
      ? 'Email Id is required'
      : this.orgBranchForm.get('emailId').hasError('pattern')
        ? 'Not a valid email address'
        : this.orgBranchForm.get('emailId').hasError('alreadyInUse')
          ? 'This email address is already in use'
          : '';
  }

  getErrorZipCode(): any {
    return this.orgBranchForm.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.orgBranchForm.get('zipCode').hasError('pattern')
        ? 'Please, Enter 5 digits'
        : '';
  }

  get fields(): any {
    return this.orgBranchForm.controls;
  }

  submitBranch(): void {
    if (this.orgBranchForm.valid) {
      const formValue = this.orgBranchForm.value;
      formValue.address = {
        state: formValue.state,
        city: formValue.city,
        addressLine: formValue.addressLine,
        zipCode: formValue.zipCode,
      };

      if (this.data.add === 'add') {
        this.createBranch(formValue);
      } else {
        this.updateBranch(formValue);
      }
    }
  }
  createBranch(body): void {

    this.branchservice.addBranch(body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success(' Clinic Created successfully!', 2000);
      },
      (error) => {
        this.snackBarService.error('Failed!', 2000);
      }
    );
  }

  updateBranch(body): void {

    this.branchservice.editBranch(this.branchId, body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success(' Branch Updated successfully!', 2000);
      },
      (error) => {
        this.snackBarService.error('Failed!', 2000);
      }
    );
  }

  onStateSelection(event: any): any {
    this.city = [];
    // this.locationService.getFilteredJSONData(event).subscribe((data: any[]) => {
    //   this.city = data;
    // });
  }

  private _filterCitySearch(value: string): string[] {
    const filterCityValue = value?.toLowerCase();
    return this.city.filter((option) => option?.toLowerCase().includes(filterCityValue));
  }
}
