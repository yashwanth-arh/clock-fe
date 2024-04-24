import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CptCode } from '../../entities/cpt-code';
import { CptCodeService } from '../../services/cpt-code.service';

@Component({
  selector: 'app-add-cpt',
  templateUrl: './add-cpt.component.html',
  styleUrls: ['./add-cpt.component.scss']
})
export class AddCptComponent implements OnInit {
  public addCPTCodeForm: FormGroup;
  public isSubmitted = false;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cptService: CptCodeService,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.addCPTCodeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      code: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
  }


  get fields(): any {
    return this.addCPTCodeForm.controls;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.addCPTCodeForm.invalid) {
      return;
    }
    const formValue = this.addCPTCodeForm.value;


    this.cptService.addCPTCode(formValue).subscribe((response: CptCode) => {
      this.snackBar.success('CPT code added successfully!', 2000);
      this.addCPTCodeForm.reset();
    }, error => {
      this.snackBar.error('Add CPT code failed !', 2000);

    });
  }

}
