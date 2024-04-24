import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DiseaseService } from 'src/app/settings-management/services/disease.service';

@Component({
  selector: 'app-device-type-edit',
  templateUrl: './device-type-edit.component.html',
  styleUrls: ['./device-type-edit.component.scss'],
})
export class DeviceTypeEditComponent implements OnInit {
  deviceTypeEditForm: FormGroup;
  id: any;
  isSubmitted: boolean = false;

  initializeCreateDeviceForm() {
    this.id = this.data.id;
    const name = /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/;
    const deviceDec = /^[a-zA-Z0-9][a-zA-Z0-9]*$/;
    this.deviceTypeEditForm = this.fb.group({
      deviceType: [
        this.data.deviceType,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
      deviceDescription: [
        this.data.deviceDescription,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
          this.noWhitespaceValidator,
        ],
      ],
      // version: [this.data.version, Validators.required],
      // video: [this.data.video, Validators.required],
      // status: [this.data.status, Validators.required],
    });
  }

  // statuslist = [
  // 	{ value: "Active", viewValue: "Active" },
  // 	{ value: "Inactive", viewValue: "Inactive" },
  // ];
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeviceTypeEditComponent>,
    private diseaseService: DiseaseService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initializeCreateDeviceForm();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  deviceTypeErr() {
    return this.deviceTypeEditForm.get('deviceType').hasError('required')
      ? 'Device Type is required'
      : // : this.deviceTypeEditForm.get('deviceType').hasError('pattern')
      // ? 'First later can not be space'
      this.deviceTypeEditForm.get('deviceType').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.deviceTypeEditForm.get('deviceType').hasError('minlength')
      ? 'Min 2 characters is required'
      : '';
  }
  deviceDecErr() {
    return this.deviceTypeEditForm.get('deviceDescription').hasError('required')
      ? 'Description is required'
      : // : this.deviceTypeEditForm.get('deviceDescription').hasError('pattern')
      // ? 'First later can not be space'
      this.deviceTypeEditForm.get('deviceDescription').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.deviceTypeEditForm.get('deviceDescription').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  updateDeviceType(val) {
    this.isSubmitted = true;
    const body = {
      deviceType: val.deviceType.trim(),
      deviceDescription: val.deviceDescription.trim(),
    };
    if (this.deviceTypeEditForm.valid) {
      // console.warn(this.deviceTypeEditForm.value);
      this.diseaseService.editDeviceType(body, this.id).subscribe(
        (res) => {
          this.snackBar.success('Device type edited successfully', 2000);
          this.isSubmitted = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBar.error(error.message);
        }
      );
    } else {
    }
  }
}
