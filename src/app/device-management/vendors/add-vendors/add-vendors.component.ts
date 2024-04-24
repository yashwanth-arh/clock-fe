import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmDialogModel } from 'src/app/CommonComponents/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';

@Component({
  selector: 'app-add-vendors',
  templateUrl: './add-vendors.component.html',
  styleUrls: ['./add-vendors.component.scss'],
})
export class AddVendorsComponent implements OnInit {
  vendorForm: FormGroup;
  dataValue: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  pdfimageSrc: any[] = [];
  imageSrc: any[] = [];
  attachmentId: any;
  isSubmitted: boolean = false;
  fileSelection: any;
  initializeCreateDeviceForm() {
    // const vendorName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
    this.vendorForm = this.fb.group({
      vendorName: [
        this.data ? this.data['vendorName'] : '',
        [
          Validators.required,
          // Validators.pattern(vendorName),
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
    });
  }
  constructor(
    public dialogRef: MatDialogRef<AddVendorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: SnackbarService,
    private service: DeviceTypeService,
    private _sanitizer: DomSanitizer
  ) {
    this.dataValue = data;
  }

  ngOnInit(): void {
    this.initializeCreateDeviceForm();
    if (this.dataValue !== 'add') {
      this.getAttachment();
    }
  }
  getAttachment() {
    this.service.getAllVendorListById(this.data['id']).subscribe((res) => {
      this.attachmentId = res?.vendorAttachment.id;
      this.pdfimageSrc.push(res?.vendorAttachment.documentPath);
    });
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  vendorErr() {
    return this.vendorForm.get('vendorName').hasError('required')
      ? 'Vendor name is required'
      : // : this.vendorForm.get('vendorName').hasError('pattern')
      //   ? 'First later can not be space'
      this.vendorForm.get('vendorName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.vendorForm.get('vendorName').hasError('minlength')
      ? 'Min 2 characters is required'
      : '';
  }

  submit(): void {
    const body = {
      vandorName: this.vendorForm.get('vendorName').value.trim(),
    };
    if (this.dataValue === 'add') {
      this.service.createVendor(body).subscribe((res) => {
        this.snackBar.success('Vendor created successfully');
        this.dialogRef.close(true);
      });
    } else {
      this.service.updateVendor(body, this.data['id']).subscribe((res) => {
        this.snackBar.success('Vendor updated successfully');
        this.dialogRef.close(true);
      });
    }
  }
  onFileSelected(event: any) {
    this.pdfimageSrc = [];
    this.selectedFile = null;
    this.previewUrl = null;
    const file: File = event.target.files[0];

    if (file && this.validateFile(file)) {
      this.selectedFile = file;
      // if (this.selectedFile['name'].includes('pdf')) {
      this.pdfimageSrc.push(this.selectedFile['name']);
      // }
      // Show file preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.pdfimageSrc = [];
      event.target.value = '';
      // Invalid file type or size
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  validateFile(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      this.snackBar.error(
        'Invalid file type. Only JPEG, JPG,  PNG and PDF files are allowed.'
      );
      return false;
    }

    if (file.size > maxSize) {
      this.snackBar.error('File size exceeds the maximum limit of 10MB.');
      return false;
    }

    return true;
  }
  removeSelectedFile() {
    this.pdfimageSrc = [];
    this.selectedFile = null;
    this.previewUrl = null;
    if (this.attachmentId) {
      this.service.deleteAttachment(this.attachmentId).subscribe((res) => {
        this.snackBar.success(res.message);
        this.attachmentId = '';
      });
    }
  }

  onUpload() {
    this.isSubmitted = true;
    if (this.selectedFile || this.vendorForm.value.vendorName) {
      const formData: FormData = new FormData();

      formData.append('file', this.selectedFile);
      formData.append(
        'vendor',

        `{"vendorName":"${this.vendorForm.value.vendorName.trim()}"}`
      );

      // Make the API call
      if (this.dataValue === 'add') {
        this.service.createVendor(formData).subscribe(
          (response) => {
            this.snackBar.success('Vendor Details Created Successfully!');
            // Reset file selection and preview
            this.isSubmitted = false;
            this.pdfimageSrc = [];
            this.selectedFile = null;
            this.previewUrl = null;
            this.dialogRef.close(true);
          },
          (error) => {
            this.isSubmitted = false;
            // this.snackBar.error('Upload failed:', error);
          }
        );
      } else {
        this.service.updateVendor(formData, this.data['id']).subscribe(
          (response) => {
            this.snackBar.success('Vendor Details Updated Successfully!');
            // Reset file selection and preview
            this.isSubmitted = false;
            this.pdfimageSrc = [];
            this.selectedFile = null;
            this.previewUrl = null;
            this.dialogRef.close(true);
          },
          (error) => {
            this.isSubmitted = false;
            // this.snackBar.error('Upload failed:', error);
          }
        );
      }
    }
  }
}
