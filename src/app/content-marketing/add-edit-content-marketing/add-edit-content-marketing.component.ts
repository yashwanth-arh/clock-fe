import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ContentMarketing } from '../content-marketing.service';

@Component({
  selector: 'app-add-edit-content-marketing',
  templateUrl: './add-edit-content-marketing.component.html',
  styleUrls: ['./add-edit-content-marketing.component.scss'],
})
export class AddEditContentMarketingComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  contentForm: FormGroup;
  pdfimageSrc: any;
  selectedThumbFile: File | null = null;
  submitted: boolean = false;
  editFilePath: any;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditContentMarketingComponent>,
    private snackBarService: SnackbarService,
    private contentMarketing: ContentMarketing
  ) {}

  ngOnInit(): void {
    if (this.data?.mode === 'edit') {
      this.selectedFile = null;
      this.editFilePath = this.data?.contentMarketingDetails;
    }

    this.contentForm = this.fb.group({
      description: [
        this.data?.mode === 'edit'
          ? this.data?.contentMarketingDetails?.description
          : '',
        Validators.compose([Validators.required]),
      ],
      title: [
        this.data?.mode === 'edit'
          ? this.data?.contentMarketingDetails?.title
          : '',
        Validators.compose([Validators.required]),
      ],
    });

    if (this.data) {
    }
  }
  getFileName(e) {
    // console.log(e?.attachments.split('guide/'));

    let arr;
    arr = e?.attachments.split('/')[1];
    return arr;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && this.validateFile(file)) {
      this.editFilePath = '';
      this.selectedFile = file;
      // this.pdfimageSrc.push(this.selectedFile['name']);
      // Show file preview
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   this.previewUrl = e.target?.result;
      // };
      // reader.readAsDataURL(file);
    } else {
      event.target.value = '';
      // Invalid file type or size
      this.selectedFile = null;
      this.previewUrl = null;
    }
    event.target.value = '';
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      this.snackBarService.error(
        'Invalid file type. Only JPEG, JPG, PNG and MP4 files are allowed.'
      );
      return false;
    }

    if (file.size > maxSize) {
      this.selectedFile = null;
      this.snackBarService.error(
        'File size exceeds the maximum limit of 10MB.'
      );
      return false;
    }

    return true;
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.editFilePath = '';
  }

  onUpload(e) {
    // // Make the API call
    if (this.selectedFile == null && !this.editFilePath) {
      this.snackBarService.error('Please Upload Cover Image / Video');
      return;
    }
    this.submitted = true;
    if (this.data?.mode !== 'edit') {
      const body = {
        title: e?.title,
        description: e?.description,
        attachments: this.selectedFile?.name,
        // thumbnail: this.selectedThumbFile?.name,
        type: this.selectedFile?.type.split('/')[0],
      };
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append(
        'contenMarketing',

        JSON.stringify(body)
      );
      

      this.contentMarketing.createContent(formData).subscribe(
        (response) => {
          this.snackBarService.success('Content uploaded successfully');
          this.dialogRef.close(true);
          // Reset file selection and preview
          this.selectedFile = null;
          this.selectedThumbFile = null;
          this.previewUrl = null;
          this.submitted = false;
        },
        (error) => {
          // console.error('Upload failed:', error);
          this.submitted = false;
        }
      );
    } else {
      const body = {
        title: e?.title,
        description: e?.description,
        attachments: this.selectedFile?.name,
        // thumbnail: this.selectedThumbFile?.name,
        type: this.selectedFile?.type.split('/')[0],
      };
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile ? this.selectedFile : null);
      formData.append(
        'contenMarketing',

        JSON.stringify(body)
      );
      this.contentMarketing
        .updateContent(formData, this.data?.contentMarketingDetails?.id)
        .subscribe(
          (response) => {
            this.snackBarService.success('Content updated successfully');
            this.dialogRef.close(true);
            // Reset file selection and preview
            this.editFilePath = '';
            this.selectedFile = null;
            this.selectedThumbFile = null;
            this.previewUrl = null;
            this.submitted = false;
          },
          (error) => {
            // this.snackBarService.error('Upload failed:', error);
            this.submitted = false;
          }
        );
    }
  }
  contentTitleError() {
    return this.contentForm.get('title').hasError('required')
      ? 'Title is required'
      : this.contentForm.get('title').hasError('minlength')
      ? 'Enter minimum 3 characters '
      : '';
  }
  contentdescriptionError() {
    return this.contentForm.get('description').hasError('required')
      ? 'Description is required'
      : this.contentForm.get('description').hasError('minlength')
      ? 'Enter minimum 5 characters'
      : '';
  }
}
