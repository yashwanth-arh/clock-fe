import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DoctorIdentityService } from '../../services/doctorIdentity.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-doctor-identity-add-edit',
  templateUrl: './doctor-identity-add-edit.component.html',
  styleUrls: ['./doctor-identity-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DoctorIdentityAddEditComponent implements OnInit {
  doctorIdentityForm: FormGroup;
  doctorId: any = '';
  isSubmitted = false;
  DoctorIdentityAddEditForm(): void {
    // const idName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
    this.doctorIdentityForm = this.fb.group({
      identityType: [
        this.data.value ? this.data.value.identityType : '',
        [
          Validators.required,
          Validators.minLength(3),
          // Validators.pattern(idName),
          this.noWhitespaceValidator,
        ],
      ],
    });
  }
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private doctorIdentityService: DoctorIdentityService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DoctorIdentityAddEditComponent>,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.DoctorIdentityAddEditForm();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  IdentityNameErr() {
    return this.doctorIdentityForm.get('identityType').hasError('required')
      ? 'Identity Type is required'
      : // : this.doctorIdentityForm.get('identityType').hasError('pattern')
      // ? 'First later can not be space'
      this.doctorIdentityForm.get('identityType').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.doctorIdentityForm.get('identityType').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  submitSpecialty(): void {
    this.isSubmitted = true;
    if (this.doctorIdentityForm.valid) {
      const body = {
        identityType: this.doctorIdentityForm.get('identityType').value.trim(),
      };
      if (this.data.add === 'add') {
        this.createDoctorIdentity(body);
      } else {
        this.updateDoctorIdentity(body);
      }
    }
  }
  createDoctorIdentity(body): void {
    this.isSubmitted = true;
    this.doctorIdentityService.AddCareProviderIdentity(body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success('Doctor Identity created successfully!');
        this.isSubmitted = false;
      },
      (error) => {
        this.isSubmitted = false;
        // this.snackBarService.success('Speaciality creation unsuccessful!');
      }
    );
  }
  getErrorSpeciality() {
    return this.doctorIdentityForm.get('identityType').hasError('required')
      ? 'Identity type is required'
      : this.doctorIdentityForm.get('identityType').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  updateDoctorIdentity(body): void {
    this.doctorId = localStorage.getItem('doctorIdentity_id');

    this.doctorIdentityService
      .updateCareProviderIdentityTypes(this.doctorId, body)
      .subscribe(
        (data) => {
          this.dialogRef.close();
          this.snackBarService.success('Doctor Identity updated successfully!');
          this.isSubmitted = false;
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBarService.error('Update failed!');
        }
      );
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
