import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { DeviceModelService } from '../../device-models/device-model.service';
import { DeviceManagementService } from '../../service/device.management.service';
import { AllFiltersComponent } from 'src/app/core/components/all-filters/all-filters.component';
import { log } from 'console';
@Component({
  selector: 'app-add-edit-device',
  templateUrl: './add-edit-device.component.html',
  styleUrls: ['./add-edit-device.component.scss'],
})
export class AddEditDeviceComponent implements OnInit {
  addEditDevice: FormGroup;
  public deviceTypeList = [];
  public vendorList = [];
  private deviceData: string[] = [];
  minDate = new Date('01/01/2022');
  tomorrow = new Date();
  submitted = false;
  deviceId: any;
  vendorId: any;
  connectivityValues: any = ['Bluetooth', 'Cellular', 'Wifi'];
  @ViewChild(AllFiltersComponent) allFilter;
  deviceModels: any = [];
  deviceModelDetails: any;
  status: any = [
    { status: 'Available', value: 'AVAILABLE_CH' },
    { status: 'Damaged', value: 'DAMAGED' },
    { status: 'Returned', value: 'RETURNED' },
  ];
  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditDeviceComponent>,
    private deviceService: DeviceManagementService,
    private snackBarService: SnackbarService,
    private deviceTypeService: DeviceTypeService,
    private deviceModelservice: DeviceModelService
  ) {}

  ngOnInit(): void {
    this.validateForm();
    if (this.data.assignStatus === 'AVAILABLE_CH') {
      this.status = [
        { status: 'Available', value: 'AVAILABLE_CH' },
        { status: 'Damaged', value: 'DAMAGED' },
        { status: 'Returned', value: 'RETURNED' },
      ];
    }
    if (this.data.assignStatus === 'ASSIGNED_HOS') {
      this.status = [
        { status: 'Assigned', value: 'ASSIGNED_HOS' },
        { status: 'Unassigned', value: 'AVAILABLE_CH' },
        { status: 'Damaged', value: 'DAMAGED' },
        { status: 'Returned', value: 'RETURNED' },
      ];
    }
    if (this.data.assignStatus === 'ASSIGNED_PAT') {
      this.status = [
        { status: 'Assigned', value: 'ASSIGNED_PAT' },
        // { status: 'Unassigned', value: 'AVAILABLE_CH' },
        // { status: 'Damaged', value: 'DAMAGED' },
        // { status: 'Returned', value: 'RETURNED' },
      ];
    }

    if (this.data.add === 'add') {
      this.addEditDevice.removeControl('assignStatus');
    } else {
      this.getVendorId(this.data.deviceName);
    }

    this.getDeviceModels();
    // this.getCategory();
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data.add == null) {
        this.fillDeviceForm(this.data);
      }
    }, 200);
  }

  // -----Function to fill the device form controls----------
  private fillDeviceForm(parsedData: any): void {
    const parsedDate = new Date(parsedData.procurementDate);
    parsedDate.setDate(parsedDate.getDate() - 1);

    this.getModelId(parsedData.deviceModelId);
    this.addEditDevice.get('deviceModelNo').setValue(parsedData.deviceModelId);
    // if (parsedData.deviceCode == null) {
    //   this.addEditDevice.get('deviceCode').setValue('');
    // } else {
    //   this.addEditDevice.get('deviceCode').setValue(parsedData.deviceCode);
    // }
    if (parsedData.vendorId == null) {
      this.addEditDevice.get('vendorId').setValue('');
    } else {
      this.addEditDevice.get('vendorId').setValue(parsedData.vendorId);
    }

    this.addEditDevice.get('deviceName').setValue(parsedData.deviceTypeId);
    this.addEditDevice
      .get('connectivity')
      .setValue(parsedData.connectivity?.toLowerCase());
    this.addEditDevice.get('category').setValue(parsedData.category);
    this.addEditDevice.get('imeinumber').setValue(parsedData.imeinumber);
    this.addEditDevice
      .get('procurementDate')
      .setValue(parsedDate.toISOString());
    this.addEditDevice.get('deviceVersion').setValue(parsedData.deviceVersion);
    this.addEditDevice.get('currency').setValue(parsedData.currency);
    this.addEditDevice.get('price').setValue(parsedData.price);
    if (parsedData.assignStatus == null) {
      this.addEditDevice.get('assignStatus').setValue('');
    } else {
      this.addEditDevice.get('assignStatus').setValue(parsedData.assignStatus);
    }
    if (
      this.data.assignStatus === 'ASSIGNED_HOS' ||
      this.data.assignStatus === 'ASSIGNED_PAT'
    ) {
      this.addEditDevice.get('imeinumber').disable();
      this.addEditDevice.get('price').disable();
      this.addEditDevice.get('deviceVersion').disable();
    }
  }

  // ---Function to validate the device form-------
  private validateForm(): void {
    this.addEditDevice = this.fb.group({
      // deviceCode: [
      //   '',
      //   Validators.compose([Validators.required, Validators.minLength(3)]),
      // ],
      connectivity: [
        this.data?.connectivity ? this.data?.connectivity : '',
        Validators.required,
      ],
      category: [this.data?.category ? this.data?.category : ''],
      deviceName: [
        this.data?.deviceTypeId ? this.data?.deviceTypeId : '',
        Validators.required,
      ],
      deviceModelNo: [
        this.data?.deviceModelId ? this.data?.deviceModelId : '',
        Validators.required,
      ],
      vendorId: [
        this.data?.vendorId ? this.data?.vendorId : '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      imeinumber: [
        this.data?.imeinumber ? this.data?.imeinumber : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
          // Validators.pattern(/^(?![ ])[a-zA-Z0-9 ]+$/),
        ]),
      ],
      // formValue.procurementDate?.setDate(
      //   new Date(formValue.procurementDate).getDate() + 1
      // );
      procurementDate: [
        this.data?.procurementDate ? this.data?.procurementDate : '',
        Validators.required,
      ],
      deviceVersion: [
        this.data?.deviceVersion ? this.data?.deviceVersion : '',
        [
          Validators.required,
          this.noZerosValidator,
          this.validateDeviceVersion,
          Validators.pattern(/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/),
          Validators.minLength(1),
          Validators.maxLength(5),
        ],
      ],
      price: [
        this.data?.price ? this.data?.price : '',
        Validators.compose([
          Validators.pattern(/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/),
        ]),
      ],
      assignStatus: [
        this.data?.assignStatus ? this.data?.assignStatus : '',
        Validators.required,
      ],
      currency: [this.data?.currency ? this.data?.currency : ''],
    });
  }
  // Custom Validator function to restrict to 5 digits
  validateDeviceVersion(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if ((control.value || '').toString().trim().length > 5) {
      return { invalidDeviceVersion: true };
    }
    return null;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  noZerosValidator(control: FormControl) {
    const value = control.value;
    if (value == 0 && control.value.length > 0) {
      return { zeros: true };
    }
    return null;
  }

  get fields(): any {
    return this.addEditDevice.controls;
  }
  getDeviceModels(): void {
    this.deviceModelservice.getAllModelsWithoutPagination().subscribe(
      (data) => {
        this.deviceModels = data.deviceTypes;
      },
      (error) => {
        this.snackBarService.error(error.message);
      }
    );
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.addEditDevice.invalid) {
      this.submitted = false;
      return;
    }

    if (this.data.add === 'add') {
      const parsedDate = new Date(
        this.addEditDevice.get('procurementDate').value
      );
      parsedDate.setDate(parsedDate.getDate() + 1);
      const formValue = {
        connectivity: this.addEditDevice.get('connectivity').value,
        category: this.addEditDevice.get('category').value,
        deviceName: this.addEditDevice.get('deviceName').value,
        deviceModelNo: this.addEditDevice.get('deviceModelNo').value,
        vendorId: this.addEditDevice.get('vendorId').value,
        imeinumber: this.addEditDevice.get('imeinumber').value,
        procurementDate: parsedDate.toISOString(),
        deviceVersion: this.addEditDevice.get('deviceVersion').value,
        price: this.addEditDevice.get('price').value,
        // assignStatus: this.addEditDevice.get('assignStatus').value,
        currency: this.addEditDevice.get('currency').value,
      };

      // formValue.deviceCode = formValue.deviceCode.trim();
      // formValue.vendorId = formValue.vendorId;
      // formValue.category = formValue.deviceName;
      // formValue.connectivity = formValue.connectivity?.toLowerCase();
      // formValue?.procurementDate?.setDate(
      //   new Date(formValue.procurementDate).getDate() + 1
      // );

      this.deviceService.createDevice(formValue).subscribe(
        (data) => {
          this.snackBarService.success('Created successfully!');
          this.dialogRef.close(true);
          this.submitted = false;
        },
        (error) => {
          this.submitted = false;
        }
      );
    } else {
      const parsedDate = new Date(
        this.addEditDevice.get('procurementDate').value
      );
      parsedDate.setDate(parsedDate.getDate() + 1);
      const formValue = {
        connectivity: this.addEditDevice.get('connectivity').value,
        category: this.addEditDevice.get('category').value,
        deviceName: this.addEditDevice.get('deviceName').value,
        deviceModelNo: this.addEditDevice.get('deviceModelNo').value,
        vendorId: this.addEditDevice.get('vendorId').value,
        imeinumber: this.addEditDevice.get('imeinumber').value,
        procurementDate: parsedDate.toISOString(),
        deviceVersion: this.addEditDevice.get('deviceVersion').value,
        price: this.addEditDevice.get('price').value,
        assignStatus: this.addEditDevice.get('assignStatus').value,
        currency: this.addEditDevice.get('currency').value,
      };

      // formValue.deviceCode = formValue.deviceCode.trim();
      formValue.vendorId = formValue.vendorId;
      formValue.category = formValue.deviceName;
      formValue.connectivity = formValue.connectivity?.toLowerCase();
      // let pDate;
      // let splittedPDate;
      // let parsedPDate;
      // if (typeof formValue.procurementDate !== 'string') {
      //   pDate = formValue.procurementDate.toISOString();
      //   splittedPDate = pDate?.split('T');
      //   parsedPDate = this.data.procurementDate?.split('T');
      //   if (parsedPDate?.length) {
      //     if (parsedPDate[0] !== splittedPDate[0]) {
      //       formValue.procurementDate?.setDate(
      //         new Date(formValue.procurementDate).getDate() + 1
      //       );
      //     }
      //   }
      // } else {
      //   formValue.procurementDate = new Date(
      //     formValue.procurementDate
      //   ).toISOString();
      // }

      this.deviceService.editDevice(this.data.id, formValue).subscribe(
        (data) => {
          this.snackBarService.success('Updated successfully!');
          this.dialogRef.close(true);
          this.submitted = false;
        },
        (error) => {
          this.submitted = false;
          // this.snackBarService.error(error.message);
        }
      );
    }
  }
  getDeviceCodeError() {
    return this.addEditDevice.get('deviceCode').hasError('required')
      ? 'Device code is required'
      : this.addEditDevice.get('deviceCode').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  getVendorNameError() {
    return this.addEditDevice.get('vendorId').hasError('required')
      ? 'Vendor Name is required'
      : this.addEditDevice.get('vendorId').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  getIMEIErr() {
    return this.addEditDevice.get('imeinumber').hasError('required')
      ? 'IMEI / Serial Number is required'
      : this.addEditDevice.get('imeinumber').hasError('pattern')
      ? 'Special characters are not allowed'
      : this.addEditDevice.get('imeinumber').hasError('minlength')
      ? 'Min 5 characters is required'
      : '';
  }
  getVersionErr() {
    return this.addEditDevice.get('deviceVersion').hasError('required')
      ? 'Version is required'
      : this.addEditDevice.get('deviceVersion').hasError('pattern')
      ? 'Enter valid version'
      : this.addEditDevice.get('deviceVersion').hasError('zeros')
      ? 'Only zero is not allowed'
      : this.addEditDevice.get('deviceVersion').hasError('invalidDeviceVersion')
      ? 'Version must be between 1 to 5 digit.'
      : '';
  }
  getAmountErr() {
    return this.addEditDevice.get('price').hasError('required')
      ? 'Amount is required'
      : this.addEditDevice.get('price').hasError('pattern')
      ? 'Enter valid amount'
      : '';
  }
  getDeviceTypeList(): void {
    this.deviceTypeService
      .getAllDeviceTypeWithoutPagination()
      .subscribe((res) => {
        if (res.deviceTypes) {
          this.deviceTypeList = res.deviceTypes;

          this.deviceTypeList = this.deviceTypeList.filter((data) => {
            if (data.id === this.deviceModelDetails[0].device_type_id) {
              return data;
            }
          });
          this.addEditDevice
            .get('deviceName')
            .setValue(this.deviceTypeList[0].id);
        }
      });
  }

  getVendorList(): void {
    this.deviceTypeService.getVendorNames().subscribe((res) => {
      if (res) {
        this.vendorList = res.vendorList;
        this.vendorList = this.vendorList.filter((datas) => {
          if (datas.id === this.deviceModelDetails[0].vendor_id) {
            return datas;
          }
        });
        this.addEditDevice.get('vendorId').setValue(this.vendorList[0].id);
      }
    });
  }
  getVendorId(id) {
    this.deviceId = id;
  }

  removeSelectedFile() {
    const ele = document.getElementById('pres-image') as HTMLInputElement;
    ele.value = '';
  }
  getModelId(val) {
    this.deviceTypeService.getModelId(val).subscribe((res) => {
      if (res.length) {
        this.deviceModelDetails = res;
        this.getVendorList();
        this.getDeviceTypeList();
      }
    });
  }
}
