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
  selector: 'app-device-type-add',
  templateUrl: './device-type-add.component.html',
  styleUrls: ['./device-type-add.component.scss'],
})
export class DeviceTypeAddComponent implements OnInit {
  deviceTypeForm: FormGroup;
  isSubmitted: boolean = false;
  component: { valid: true; value: { name: string } };

  initializeCreateDeviceForm() {
    const name = /^[a-zA-Z0-9 ]+$/;
    const deviceDec = /^[a-zA-Z0-9 ]+$/;
    this.deviceTypeForm = this.fb.group({
      deviceType: [
        '',
        [
          Validators.required,
          Validators.pattern(name),
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
      // type: ["", Validators.required]
      // vendor: ["", Validators.required],
      // manfdate: ["", Validators.required],
      // version: ["", Validators.required],
      deviceDescription: [
        '',
        [
          Validators.required,
          Validators.pattern(deviceDec),
          Validators.minLength(3),
          Validators.maxLength(500),
          this.noWhitespaceValidator,
        ],
      ],
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
    public dialogRef: MatDialogRef<DeviceTypeAddComponent>,
    public diseaseService: DiseaseService,
    public snackBar: SnackbarService
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
    return this.deviceTypeForm.get('deviceType').hasError('required')
      ? 'Device Type is required'
      : this.deviceTypeForm.get('deviceType').hasError('pattern')
      ? 'Only Alphabtes,numbers are allowed'
      : this.deviceTypeForm.get('deviceType').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.deviceTypeForm.get('deviceType').hasError('minlength')
      ? 'Min 2 characters is required'
      : '';
  }
  deviceDecErr() {
    return this.deviceTypeForm.get('deviceDescription').hasError('required')
      ? 'Description is required'
      : this.deviceTypeForm.get('deviceDescription').hasError('pattern')
      ? 'Only Alphanumeric are allowed '
      : this.deviceTypeForm.get('deviceDescription').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.deviceTypeForm.get('deviceDescription').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  createDeviceType(val) {
    this.isSubmitted = true;
    const body = {
      deviceType: val.deviceType.trim(),
      deviceDescription: val.deviceDescription.trim(),
    };
    if (this.deviceTypeForm?.valid) {
      this.diseaseService.createDeviceType(body).subscribe(
        (res) => {
          this.snackBar.success('Device type added successfully', 2000);
          this.isSubmitted = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBar.error(error.message);
        }
      );
    }
  }
}
