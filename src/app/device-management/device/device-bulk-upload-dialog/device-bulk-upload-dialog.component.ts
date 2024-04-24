import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { SnackbarService } from './../../../core/services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { DeviceUpload } from 'src/app/shared/entities/device';
import { environment } from 'src/environments/environment.prod';
import { viewDeviceService } from 'src/app/hospital-management/service/view-device.service';

@Component({
  selector: 'app-device-bulk-upload-dialog',
  templateUrl: './device-bulk-upload-dialog.component.html',
  styleUrls: ['./device-bulk-upload-dialog.component.scss'],
})
export class DeviceBulkUploadDialogComponent implements OnInit {
  public uploadForm: FormGroup;
  bulkUploadUrl: string;
  fileName: any;
  deviceUrl: string;
  constructor(
    public fb: FormBuilder,
    private snackBarService: SnackbarService,
    private viewDeviceService: viewDeviceService,
    private deviceTypeService: DeviceTypeService,
    public dialogRef: MatDialogRef<DeviceBulkUploadDialogComponent>
  ) {
    this.deviceUrl = environment.deviceUrl;
    this.bulkUploadUrl = environment.bulkUploadUrl;
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      uploadFile: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('uploadFile').value);
      this.viewDeviceService.bulkUploadDevices(formData).subscribe(
        (res: DeviceUpload) => {
          this.snackBarService.success('File uploaded successfully');
          if (res && res?.blob) {
            this.deviceTypeService.downloadFile(res);
          }
          this.dialogRef.close(true);
        },
        () => {
          // this.snackBarService.error('Device bulk upload failed!', 2000);
        }
      );
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.uploadForm.get('uploadFile').setValue(file);
    }
  }
}
