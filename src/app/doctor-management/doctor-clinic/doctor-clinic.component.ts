import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TouchSequence } from 'selenium-webdriver';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DoctorService } from '../service/doctor.service';

@Component({
  selector: 'app-doctor-clinic',
  templateUrl: './doctor-clinic.component.html',
  styleUrls: ['./doctor-clinic.component.scss'],
})
export class DoctorClinicComponent implements OnInit {
  doctorsClinicDialog: FormGroup;
  clinicList = [];
  public submitted = false;
  editClinicArr: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DoctorClinicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public branchService: BranchService,
    public doctorService: DoctorService,
    public snackBarService: SnackbarService
  ) {

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.branchService
      .getFilteredhospitalBranch(data.hospital?.id)
      .subscribe((ele: any) => {
        this.clinicList = [];
        this.doctorsClinicDialog
          .get('clinicIds')
          .setValue(
            this.data.clinicIds?.split(',').map((clinics: any[]) => clinics)
          );
        this.data.clinicIds.split(',').map((res) => {
          this.editClinicArr.push(res);
        });
        this.clinicList = ele.branchList;
      });
  }

  ngOnInit(): void {
    this.doctorsClinicDialog = this.fb.group({
      clinicIds: ['', [Validators.required]],
    });
  }

  get fields(): any {
    return this.doctorsClinicDialog.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.doctorsClinicDialog.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.doctorsClinicDialog.value;
    const clincs = formValue.clinicIds.toString();
    this.doctorService.addClinicsToDoctor(this.data?.id, clincs).subscribe(
      (data) => {
        this.snackBarService.success('Assigned successfully!', 2000);
        this.dialogRef.close();
      },
      (error) => {
        this.snackBarService.error('Failed!', 2000);
      }
    );
  }

  dummySubmit():void{
    this.submitted = true;
    if (this.doctorsClinicDialog.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.doctorsClinicDialog.value;
    const clincs = formValue.clinicIds.toString();
    this.doctorService.addClinicsToDoctor(this.data?.id, clincs).subscribe(
      (data) => {
        this.snackBarService.success('Assigned successfully!', 2000);
        // this.dialogRef.close();
      },
      (error) => {
        this.snackBarService.error('Failed!', 2000);
      }
    );
  }
}
