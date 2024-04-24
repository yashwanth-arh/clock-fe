import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { SpecialityService } from '../../services/speciality.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-speciality-add-edit',
  templateUrl: './speciality-add-edit.component.html',
  styleUrls: ['./speciality-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpecialityAddEditComponent implements OnInit {
  specialtyForm: FormGroup;
  specialtyId: any = '';
  isSubmitted = false;
  initializeSpecialtyAddEditForm(): void {
    // const specialityName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
    this.specialtyForm = this.fb.group({
      specialityName: [
        this.data.value ? this.data.value.specialityName : '',
        [
          Validators.required,
          // Validators.pattern(specialityName),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
      ],
    });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private specialtyservice: SpecialityService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SpecialityAddEditComponent>,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initializeSpecialtyAddEditForm();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  specNameErr() {
    return this.specialtyForm.get('specialityName').hasError('required')
      ? 'Speciality name is required'
      : // : this.specialtyForm.get('specialityName').hasError('pattern')
      // ? 'First later can not be space'
      this.specialtyForm.get('specialityName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.specialtyForm.get('specialityName').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  submitSpecialty(): void {
    this.isSubmitted = true;
    if (this.specialtyForm.valid) {
      const body = {
        specialityName: this.specialtyForm.get('specialityName').value.trim(),
      };
      if (this.data.add === 'add') {
        this.createSpecialty(body);
      } else {
        this.updateSpecialty(body);
      }
    }
  }
  createSpecialty(body): void {
    this.isSubmitted = true;
    this.specialtyservice.addSpecialty(body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success(' Speciality created successfully!');
        this.isSubmitted = false;
      },
      (error) => {
        this.isSubmitted = false;
        // this.snackBarService.success('Speaciality creation unsuccessful!');
      }
    );
  }
  getErrorSpeciality() {
    return this.specialtyForm.get('specialtyname').hasError('required')
      ? 'Speciality is required'
      : this.specialtyForm.get('specialtyname').errors
      ? 'Enter minimum 3 characters'
      : '';
  }
  updateSpecialty(body): void {
    this.specialtyId = localStorage.getItem('speciality_id');

    this.specialtyservice.editSpecialty(this.specialtyId, body).subscribe(
      (data) => {
        this.dialogRef.close();
        this.snackBarService.success(' Speciality updated successfully!');
        this.isSubmitted = false;
      },
      (error) => {
        // this.snackBarService.error('Update failed!');
        this.isSubmitted = false;
      }
    );
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
