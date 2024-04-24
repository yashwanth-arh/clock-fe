import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CptCode, Status } from '../../entities/cpt-code';
import { CptCodeService } from '../../services/cpt-code.service';

@Component({
  selector: 'app-edit-cpt',
  templateUrl: './edit-cpt.component.html',
  styleUrls: ['./edit-cpt.component.scss'],
})
export class EditCptComponent implements OnInit {
  public editCPTForm: FormGroup;
  public isSubmitted = false;
  public status: string[] = [Status.Active, Status.Inactive];

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cptService: CptCodeService,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.editCPTForm = this.fb.group({
      name: [this.data ? this.data.code?.name : '', [Validators.required]],
      description: [
        this.data ? this.data.code?.description : '',
        [Validators.required],
      ],
      code: [this.data ? this.data.code?.code : '', [Validators.required]],
      amount: [this.data ? this.data.code?.amount : '', [Validators.required]],
      // status: [this.data ? this.data.code.status : '', [Validators.required]],
    });
  }

  get fields(): any {
    return this.editCPTForm.controls;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(codeId: string): void {
    this.isSubmitted = true;
    if (this.editCPTForm.invalid) {
      return;
    }
    const formValue: CptCode = this.editCPTForm.value;

    this.cptService.editCPTCode(formValue, codeId).subscribe(
      (response: CptCode) => {
        this.snackBar.success('Cpt Code edited successfully!', 2000);
        this.editCPTForm.reset();
      },
      (error) => {
        this.snackBar.error('Update CPT Code failed !', 2000);
      }
    );
  }
}
