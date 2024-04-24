import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { DeviceManagementService } from '../../service/device.management.service';

@Component({
  selector: 'app-assign-device',
  templateUrl: './assign-device.component.html',
  styleUrls: ['./assign-device.component.scss'],
})
export class AssignDeviceComponent implements OnInit {
  assignDevice: FormGroup;
  practiceList = [];
  isSubmitted = false;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignDeviceComponent>,
    private deviceService: DeviceManagementService,
    private snackBarService: SnackbarService,
    private hospitalService: HospitalManagementService
  ) {}

  ngOnInit(): void {
    this.validateForm();

    this.hospitalService.getPracticeList()?.subscribe(
      (res: any) => {
        this.practiceList = res.content;
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }

  // ---Function to validate the assign device form-------
  private validateForm(): void {
    this.assignDevice = this.fb.group({
      hospitalId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.assignDevice.invalid) {
      this.isSubmitted = false;
      return;
    }
    const formValue = this.assignDevice.value;
    if (this.data.mode === 'assign') {
      this.isSubmitted = true;
      this.deviceService
        .assignDevice(this.data.deviceDetails.imeinumber, formValue)
        .subscribe(
          (data) => {
            this.snackBarService.success('Assigned successfully!', 2000);
            this.dialogRef.close();
            this.isSubmitted = false;
          },
          (error) => {
            this.isSubmitted = false;

            this.snackBarService.error(error.message, 2000);
          }
        );
    }
  }
}
