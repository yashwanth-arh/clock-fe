import { CaregiverSharedService } from './../../../CareproviderDashboard/caregiver-shared.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { phoneNumberRx,maskRx } from 'src/app/shared/entities/routes';
// import { maskRx } from 'src/app/shared/entities/routes';
import { BranchService } from '../branch.service';

@Component({
  selector: 'app-clinic-timings',
  templateUrl: './clinic-timings.component.html',
  styleUrls: ['./clinic-timings.component.scss']
})
export class ClinicTimingsComponent implements OnInit {
  clinicTimingForm: FormGroup;
  public mask = maskRx;
  maxDate: Date = new Date();
  isSubmitted = false;
  constructor(public dialogRef: MatDialogRef<ClinicTimingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService, private fb: FormBuilder,
    private branchservice: BranchService, private caregiversharedService: CaregiverSharedService) {
    const phoneNumber: RegExp = phoneNumberRx;
    // 

    this.clinicTimingForm = this.fb.group({
      session1ContactNumber: [this.data.elementData ? this.data.elementData.clinicTiming?.session1ContactNumber : '', [Validators.required]],
      session1From: [this.data.elementData ? this.data.elementData.clinicTiming?.session1From : '', [Validators.required]],
      session1To: [this.data.elementData ? this.data.elementData.clinicTiming?.session1To : '', [Validators.required]],
      session2ContactNumber: [this.data.elementData ? this.data.elementData.clinicTiming?.session2ContactNumber : '', [Validators.required]],
      session2From: [this.data.elementData ? this.data.elementData.clinicTiming?.session2From : '', [Validators.required]],
      session2To: [this.data.elementData ? this.data.elementData.clinicTiming?.session2To : '', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    this.maxDate = new Date(Math.round(date.getTime() / coeff) * coeff);
  }

  get session1ContactNumber(): FormControl {
    return this.clinicTimingForm.get('session1ContactNumber') as FormControl;
  }
  get session2ContactNumber(): FormControl {
    return this.clinicTimingForm.get('session2ContactNumber') as FormControl;
  }
  onSubmit(valid, value) {
    if (this.clinicTimingForm.valid) {
      const sessionOneFromDate = this.caregiversharedService.formatDate(new Date());
      const sessionOneFromTime = new Date(this.clinicTimingForm.get('session1From').value).toTimeString();
      const sessionOneToDate = this.caregiversharedService.formatDate(new Date());
      const sessionOneToTime = new Date(this.clinicTimingForm.get('session1To').value).toTimeString();
      const sessionTwoFromDate = this.caregiversharedService.formatDate(new Date());
      const sessionTwoFromTime = new Date(this.clinicTimingForm.get('session2From').value).toTimeString();
      const sessionTwoToDate = this.caregiversharedService.formatDate(new Date());
      const sessionTwoToTime = new Date(this.clinicTimingForm.get('session2To').value).toTimeString();
      const body = {
        session1ContactNumber: this.clinicTimingForm.get('session1ContactNumber').value,
        session1From: sessionOneFromDate + 'T' + sessionOneFromTime.substring(0, 8),
        session1To: sessionOneToDate + 'T' + sessionOneToTime.substring(0, 8),
        session2ContactNumber: this.clinicTimingForm.get('session2ContactNumber').value,
        session2From: sessionTwoFromDate + 'T' + sessionTwoFromTime.substring(0, 8),
        session2To: sessionTwoToDate + 'T' + sessionTwoToTime.substring(0, 8)
      };

      this.createBranch(body);

    }

  }

  createBranch(body): void {
    this.isSubmitted = true;
    if (!this.data.elementData) {
      this.branchservice.addClinicTiming(body).subscribe(
        (data) => {
          this.isSubmitted = false;
          this.dialogRef.close();
          this.snackBarService.success('Clinic Timing Created successfully!', 2000);
        },
        (error) => {
          this.snackBarService.error('Failed!', 2000);
          this.isSubmitted = false;
        }
      );
    } else {

      this.branchservice.updateClinicTiming(body, this.data.elementData.id).subscribe(
        (data) => {
          this.dialogRef.close();
          this.isSubmitted = false;
          this.snackBarService.success('Clinic Timing updated successfully!', 2000);
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBarService.error('Failed!', 2000);
        });
    }
  }
}
