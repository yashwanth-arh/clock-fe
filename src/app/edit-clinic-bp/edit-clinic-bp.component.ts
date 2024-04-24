import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DiseaseService } from 'src/app/settings-management/services/disease.service';
import { DeviceTypeAddComponent } from '../device-management/device-type/device-type-add/device-type-add.component';

@Component({
  selector: 'app-edit-clinic-bp',
  templateUrl: './edit-clinic-bp.component.html',
  styleUrls: ['./edit-clinic-bp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditClinicBpComponent implements OnInit {
  deviceTypeForm: FormGroup;
  showBPError: boolean;
  clinic: any;
  initializeCreateDeviceForm() {
    this.deviceTypeForm = this.fb.group({
      // clinicBp: [this.data.data, Validators.required],

      sysBp: [
        this.clinic?.length ? this.clinic[0] : null,
        Validators.compose([
          Validators.required,
          Validators.max(500),
          Validators.min(30),
        ]),
      ],
      diaBp: [
        this.clinic?.length ? this.clinic[1] : null,
        Validators.compose([
          Validators.required,
          Validators.max(500),
          Validators.min(30),
        ]),
      ],
      // type: ["", Validators.required]
      // vendor: ["", Validators.required],
      // manfdate: ["", Validators.required],
      // version: ["", Validators.required],
      // baseLineDia: [this.data.dia, Validators.required],
    });
  }

  // statuslist = [
  // 	{ value: "Active", viewValue: "Active" },
  // 	{ value: "Inactive", viewValue: "Inactive" },
  // ];
  constructor(
    // private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeviceTypeAddComponent>,
    public diseaseService: DiseaseService,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.clinic = this.data?.data?.split('/');
    this.initializeCreateDeviceForm();
  }
  getErrorBP(): any {
    if (/^\d{1,3}\/\d{1,3}$/.test(this.deviceTypeForm.get('clinicBp').value)) {
    } else if (this.deviceTypeForm.get('clinicBp').value) {
      this.showBPError = true;
    }
    return this.deviceTypeForm.get('clinicBp').hasError('required')
      ? 'BP is required'
      : this.deviceTypeForm.get('clinicBp').hasError('pattern')
      ? 'Not a valid BP'
      : '';
  }
  getValidNoSys() {
    if (this.deviceTypeForm.get('sysBp')?.value?.length == 3) {
      return false;
    } else {
      return true;
    }
  }
  getValidNoDia() {
    if (this.deviceTypeForm.get('diaBp')?.value?.length == 3) {
      return false;
    } else {
      return true;
    }
  }
  createDeviceType() {
    if (this.deviceTypeForm.valid) {
      // console.warn(this.deviceTypeForm.value);
      const body = {
        clinicBp:
          this.deviceTypeForm.value.sysBp +
          '/' +
          this.deviceTypeForm.value.diaBp,
      };
      this.diseaseService.updateClinicBp(body, this.data.id).subscribe(
        (res) => {
          this.snackBar.success('Clinic BP edited sucessfully', 2000);
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.error(error.message);
        }
      );
    } else {
    }
  }
  dummycreateDeviceType() {
    if (this.deviceTypeForm.valid) {
      // console.warn(this.deviceTypeForm.value);
      const body = {
        clinicBp:
          this.deviceTypeForm.value.sysBp +
          '/' +
          this.deviceTypeForm.value.diaBp,
      };
      this.diseaseService.updateClinicBp(body, this.data.id).subscribe(
        (res) => {
          this.snackBar.success('Clinic BP edited sucessfully', 2000);
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.error(error.message);
        }
      );
    } else {
    }
  }
}
