import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Disease } from '../../entities/disease';
import { DiseaseService } from '../../services/disease.service';

@Component({
  selector: 'app-add-disease',
  templateUrl: './add-disease.component.html',
  styleUrls: ['./add-disease.component.scss'],
})
export class AddDiseaseComponent implements OnInit {
  public addDiseaseForm: FormGroup;
  public isSubmitted = false;
  public icdCodes: any;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDiseaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public diseaseService: DiseaseService,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    // const name = /^[a-zA-Z][a-zA-Z\s]*$/;
    // const icdnames = /^[^\s].*/;
    this.addDiseaseForm = this.fb.group({
      icdName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator,
          // Validators.pattern(icdnames)
        ],
      ],
      // description: [''],
      icdCode: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator,
          // Validators.pattern(icdnames)
        ],
      ],
    });
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData.getData('text');
    const alphabeticText = pastedText.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
    if (alphabeticText !== pastedText) {
      event.preventDefault();
      document.execCommand('insertText', false, alphabeticText); // Paste the cleaned text
    }
  }

  icdNameErr() {
    return this.addDiseaseForm.get('icdName').hasError('required')
      ? 'ICD name is required'
      : // : this.addDiseaseForm.get('icdName').hasError('pattern')
      // ? 'First character can not be a space'
      this.addDiseaseForm.get('icdName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.addDiseaseForm.get('icdName').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }
  icdCodeErr() {
    return this.addDiseaseForm.get('icdCode').hasError('required')
      ? 'ICD code is required'
      : // : this.addDiseaseForm.get('icdCode').hasError('pattern')
      // ? 'First character can not be a space'
      this.addDiseaseForm.get('icdCode').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.addDiseaseForm.get('icdCode').hasError('minlength')
      ? 'Min 3 characters is required'
      : '';
  }

  get fields(): any {
    return this.addDiseaseForm.controls;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.addDiseaseForm.invalid) {
      return;
    }
    const formValue = this.addDiseaseForm.value;
    formValue.icdName = formValue.icdName.trim();
    formValue.icdCode = formValue.icdCode.trim();

    this.diseaseService.createDisease(formValue).subscribe(
      (response: Disease) => {
        this.snackBar.success('ICD code created successfully!', 2000);
        this.isSubmitted = true;
        this.addDiseaseForm.reset();
        this.closeDialog();
      },
      (error) => {
        // this.snackBar.error('Create ICD code failed !', 2000);
        this.isSubmitted = false;
      }
    );
  }

  onKeyUp(value: string): void {
    // if (value.length > 4) {
    //   this.diseaseService.getICDCodes(value).subscribe((data) => {
    //     this.icdCodes = data;
    //   });
    // }
  }

  onSelectICD(event: MatAutocompleteSelectedEvent): void {
    this.addDiseaseForm.patchValue({
      icdName: event.option.viewValue,
      // icdCode: ,
    });
  }
}
