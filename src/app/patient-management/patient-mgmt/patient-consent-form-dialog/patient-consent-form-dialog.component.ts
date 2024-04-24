import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { startWith, map, take } from 'rxjs/operators';
import { PatientManagementService } from '../../service/patient-management.service';
@Component({
  selector: 'app-patient-consent-form-dialog',
  templateUrl: './patient-consent-form-dialog.component.html',
  styleUrls: ['./patient-consent-form-dialog.component.scss'],
})
export class PatientConsentFormDialogComponent implements OnInit {
  patientId: string;
  imageSrc = '';
  pdfimageSrc = '';
  body = new FormData();
  isSubmitted = false;
  constructor(
    public dialogRef: MatDialogRef<PatientConsentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private compressImage: CompressImageService,
    private snackbarService: SnackbarService,
    private patService: PatientManagementService
  ) {}

  ngOnInit(): void {
    this.patientId = this.data;
  }
  uploadImage(event) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (
          event.target.files[i].type.includes('.sheet') ||
          event.target.files[i].type.includes('.xls') ||
          event.target.files[i].type.includes('ms-excel')
          // ||
          // event.target.files[i].type.includes('jpeg') ||
          // event.target.files[i].type.includes('jpg') ||
          // event.target.files[i].type.includes('png')        
        ) {
          this.snackbarService.error('File not supported', 2000);
          return;
        }
        // else if (event.target.files[i].name.includes('.jpeg') || event.target.files[i].name.includes('.jpg')) {
        //   this.snackbarService.error('Please upload only png files');
        //   return;
        // }
        const [_file] = event.target.files;
        if (event.target.files[i]?.type.includes('pdf')) {
          this.pdfimageSrc = 'assets/svg/pdf img.svg';
          this.body.append('file', event.target.files[i]);
        } else {
          reader.readAsDataURL(_file);
          reader.onload = () => {
            this.imageSrc = reader.result as string;
          };
          if (event.target.files[i]?.size > 5242880) {
            this.compressImage
              .compress(event.target.files[i])
              .pipe(take(1))
              .subscribe((compressedImage) => {
                this.body.append('file', compressedImage);
              });
          } else if (event.target.files[i]?.size > 10485760)
            {this.snackbarService.error('Upload file upto 10 mb');}
          else {
            this.body.append('file', event.target.files[i]);
          }
        }
        //
      }
    }
  }

  removeSelectedFile() {
    const ele = document.getElementById('file') as HTMLInputElement;
    ele.value = '';
    this.imageSrc = '';
    this.pdfimageSrc = '';
    this.body.delete('file');
  }
  saveForm() {
    this.isSubmitted = true;
    if (!this.body.has('file')) {
      this.isSubmitted = false;
      this.snackbarService.error('Select a file');
      return;
    }
    // this.snackbarService.openSnackBar('Uploading...');
    this.patService
      .uploadPatientConsentForm(this.body, this.patientId)
      .subscribe(
        () => {
          this.snackbarService.success('File uploaded successfully');
          this.dialogRef.close(true);
          this.isSubmitted = false;
        },
        (err) => {
          // this.snackbarService.error(err.message, 2000);
          this.isSubmitted = false;
        }
      );
  }
}
