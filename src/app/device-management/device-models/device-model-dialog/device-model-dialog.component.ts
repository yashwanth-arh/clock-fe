import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { DeviceModelService } from '../device-model.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
@Component({
  selector: 'app-device-model-dialog',
  templateUrl: './device-model-dialog.component.html',
  styleUrls: ['./device-model-dialog.component.scss'],
})
export class DeviceModelDialogComponent implements OnInit {
  modelForm: FormGroup;
  modelId: any = '';
  isSubmitted: boolean = false;
  submitted = false;
  public deviceTypeList = [];
  public vendorList = [];
  initializeModelAddEditForm(): void {
    const modelName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/;
    this.modelForm = this.fb.group({
      vendorId: [this.data.vendorId, [Validators.required]],
      deviceTypeId: [this.data.deviceTypeId, [Validators.required]],
      deviceModelName: [
        this.data ? this.data.deviceModelName : '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9 -]*$/),
          Validators.minLength(3),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
    });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modelservice: DeviceModelService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeviceModelDialogComponent>,
    private snackBarService: SnackbarService,
    private deviceTypeService: DeviceTypeService
  ) {}

  ngOnInit(): void {
    this.initializeModelAddEditForm();
    this.getDeviceTypeList();
    this.getVendorList();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  deviceModelErr() {
    return this.modelForm.get('deviceModelName').hasError('required')
      ? 'Model no. is required'
      : this.modelForm.get('deviceModelName').hasError('pattern')
      ? 'Special characters are not allowed except for the (-)'
      : this.modelForm.get('deviceModelName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.modelForm.get('deviceModelName').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  submit(): void {
    this.isSubmitted = true;
    if (this.modelForm.valid) {
      if (this.data == 'add') {
        this.createDeviceModel(this.modelForm.value);
      } else {
        this.updateDeviceModel(this.modelForm.value);
      }
    }
  }
  getDeviceTypeList(): void {
    // this.deviceTypeService.getAllDeviceType(0, 10, '', '').subscribe((data) => {
    this.deviceTypeService
      .getAllDeviceTypeWithoutPagination()
      .subscribe((res) => {
        this.deviceTypeList = res.deviceTypes;
      });

    // });
  }
  getVendorList(): void {
    this.deviceTypeService.getVendorNames().subscribe((res) => {
      if (res) {
        this.vendorList = res.vendorList;
      }
    });
  }
  createDeviceModel(val): void {
    this.isSubmitted = true;
    const body = {
      deviceModelName: val.deviceModelName.trim(),
      deviceTypeId: val.deviceTypeId.trim(),
      vendorId: val.vendorId.trim(),
    };

    this.modelservice.addDeviceModel(body).subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.snackBarService.success('Device Model created successfully!');
        this.isSubmitted = false;
      },
      (error) => {
        this.isSubmitted = false;
        // this.snackBarService.success('Speaciality creation unsuccessful!');
      }
    );
  }
  getVendorNameError() {
    return this.modelForm.get('vendorId').hasError('required')
      ? 'Vendor name is required'
      : this.modelForm.get('vendorId').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  getErrorSpeciality() {
    return this.modelForm.get('specialtyname').hasError('required')
      ? 'Speciality is required'
      : this.modelForm.get('specialtyname').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  updateDeviceModel(val): void {
    this.modelId = this.data.id;
    const body = {
      deviceModelName: val.deviceModelName.trim(),
      deviceTypeId: val.deviceTypeId.trim(),
      vendorId: val.vendorId.trim(),
    };
    this.modelservice.editDeviceModel(this.data.deviceModelId, body).subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.snackBarService.success(' Device Model updated successfully!');
      },
      (error) => {
        this.snackBarService.error('Update failed!');
      }
    );
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
