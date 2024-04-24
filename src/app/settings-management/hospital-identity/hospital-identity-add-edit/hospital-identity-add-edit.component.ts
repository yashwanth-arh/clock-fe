import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { HospitalIdentityService } from '../../services/hospitalIdentity.service';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-hospital-identity-add-edit',
  templateUrl: './hospital-identity-add-edit.component.html',
  styleUrls: ['./hospital-identity-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalIdentityAddEditComponent implements OnInit {
  hospitalIdentityForm: FormGroup;
  doctorId: any = '';
  isSubmitted = false;
  HospitalIdentityAddEditForm(): void {
    // const hstName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
    this.hospitalIdentityForm = this.fb.group({
      identityType: [
        this.data.value ? this.data.value.identityType : '',
        [
          Validators.required,
          Validators.minLength(3),
          // Validators.pattern(hstName),
          this.noWhitespaceValidator,
        ],
      ],
    });
  }
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private hospitalIdentityService: HospitalIdentityService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HospitalIdentityAddEditComponent>,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.HospitalIdentityAddEditForm();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  IdentityNameErr() {
    return this.hospitalIdentityForm.get('identityType').hasError('required')
      ? 'Identity Type is required'
      : // : this.hospitalIdentityForm.get('identityType').hasError('pattern')
      // ? 'First later can not be space'
      this.hospitalIdentityForm.get('identityType').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.hospitalIdentityForm.get('identityType').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  submitHospitalIdentity(): void {
    this.isSubmitted = true;
    if (this.hospitalIdentityForm.valid) {
      const body = {
        identityType: this.hospitalIdentityForm
          .get('identityType')
          .value.trim(),
      };
      if (this.data.add === 'add') {
        this.createHospitalIdentity(body);
      } else {
        this.updateHospitalIdentity(body);
      }
    }
  }
  createHospitalIdentity(body): void {
    this.isSubmitted = true;
    this.hospitalIdentityService.AddHospitalIdentity(body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success('Hospital Identity created successfully!');
        this.isSubmitted = false;
      },
      (error) => {
        this.isSubmitted = false;
        // this.snackBarService.success('Speaciality creation unsuccessful!');
      }
    );
  }
  getErrorSpeciality() {
    return this.hospitalIdentityForm.get('identityType').hasError('required')
      ? 'Identity type is required'
      : this.hospitalIdentityForm.get('identityType').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  updateHospitalIdentity(body): void {
    this.doctorId = localStorage.getItem('doctorIdentity_id');

    this.hospitalIdentityService
      .updateHospitalIdentityTypes(this.doctorId, body)
      .subscribe(
        (data) => {
          this.dialogRef.close();
          this.snackBarService.success(
            'Hospital Identity updated successfully!'
          );
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
