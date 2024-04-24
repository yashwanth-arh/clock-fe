import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaregiverDashboardService } from '../caregiver-dashboard.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-careprovider-message-dialog',
  templateUrl: './careprovider-message-dialog.component.html',
  styleUrls: ['./careprovider-message-dialog.component.scss']
})
export class CareproviderMessageDialogComponent implements OnInit {
  messageDialog: FormGroup;
  cellNo: any;
  patientId: string;
  submitted = false;
  constructor(public dialogRef: MatDialogRef<CareproviderMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private snackBarService: SnackbarService,
    private service: CaregiverDashboardService) {
    this.cellNo = data;
    // 
    this.patientId = localStorage.getItem('patientId');

  }

  ngOnInit(): void {
    this.messageDialog = this.fb.group({
      message: ['', [Validators.required]],
      to: ['+91' + this.cellNo, [Validators.required]],
    });
  }

  getErrorName(): string {
    return this.messageDialog.get('message').hasError('required')
      ? 'Message is required'
      : this.messageDialog.get('message').hasError('pattern')
        ? 'Only alphabets,space,dot & apostrophe are allowed'
        : '';
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.messageDialog.invalid) {
      return;
    }
    this.service.postMessage(this.messageDialog.value).subscribe(()=>{
      this.snackBarService.success('Message sent successfully!', 2000);
      this.dialogRef.close();
    });
  }
  cancelMessage() {
    this.messageDialog.reset();
  }
}
