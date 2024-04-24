import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Disease } from '../../entities/disease';
import { DiseaseService } from '../../services/disease.service';

@Component({
  selector: 'app-edit-disease',
  templateUrl: './edit-disease.component.html',
  styleUrls: ['./edit-disease.component.scss'],
})
export class EditDiseaseComponent implements OnInit {
  public editDiseaseForm: FormGroup;
  public isSubmitted = false;
  public status: string[] = ['ACTIVE', 'INACTIVE'];
  public icdCodes: any;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDiseaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diseaseService: DiseaseService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    // const icdnames = /^[^\s].*/;
    this.editDiseaseForm = this.fb.group({
      icdName: [
        this.data.disease.icdName,
        [
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator,
          // Validators.pattern(icdnames)
        ],
      ],
      // description: [this.data.disease.description, [Validators.required]],
      icdCode: [
        this.data.disease.icdCode,
        [
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator,
          // Validators.pattern(icdnames)
        ],
      ],
      // status: [this.data.disease.status, [Validators.required]]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  icdNameErr() {
    return this.editDiseaseForm.get('icdName').hasError('required')
      ? 'ICD name is required'
      : // : this.editDiseaseForm.get('icdName').hasError('pattern')
      // ? 'First character can not be a space'
      this.editDiseaseForm.get('icdName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.editDiseaseForm.get('icdName').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }
  icdCodeErr() {
    return this.editDiseaseForm.get('icdCode').hasError('required')
      ? 'ICD code is required'
      : // : this.editDiseaseForm.get('icdCode').hasError('pattern')
      // ? 'First character can not be a space'
      this.editDiseaseForm.get('icdCode').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.editDiseaseForm.get('icdCode').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  get fields(): any {
    return this.editDiseaseForm.controls;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(diseaseId: string): void {
    this.isSubmitted = true;
    if (this.editDiseaseForm.invalid) {
      return;
    }
    const formValue: Disease = this.editDiseaseForm.value;
    formValue.icdName = formValue.icdName.trim();
    formValue.icdCode = formValue.icdCode.trim();

    if (this.editDiseaseForm.valid && diseaseId) {
      this.diseaseService.editDisease(formValue, diseaseId).subscribe(
        (response: Disease) => {
          this.snackBar.success('ICD code updated successfully!', 2000);
          this.isSubmitted = true;
          // this.editDiseaseForm.reset();
          this.dialogRef.close();
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBar.error('Update ICD code failed !', 2000);
        }
      );
    }
  }

  onKeyUp(value: string): void {
    if (value.length > 4) {
      this.diseaseService.getICDCodes(value).subscribe((data) => {
        this.icdCodes = data;
      });
    }
  }

  onSelectICD(event: MatAutocompleteSelectedEvent): void {
    this.editDiseaseForm.patchValue({
      name: event.option.viewValue,
      description: `${event.option.value}-${event.option.viewValue}`,
    });
  }
}
