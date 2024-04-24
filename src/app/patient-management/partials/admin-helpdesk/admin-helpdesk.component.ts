import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { TicketService } from 'src/app/ticket/ticket.service';

@Component({
  selector: 'app-admin-helpdesk',
  templateUrl: './admin-helpdesk.component.html',
  styleUrls: ['./admin-helpdesk.component.scss']
})
export class AdminHelpdeskComponent implements OnInit {
  public patientId: string;
  public addRequestForm: FormGroup;
  public dataSource: MatTableDataSource<any>;
  public requestId: string;
  public requestRecord: any;
  public requestPatientRecord: any;
    public loggedinUser: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ticketservice: TicketService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<AdminHelpdeskComponent>,

  ) {
    this.patientId = this.data.patientId;
    const userDetails = JSON.parse(localStorage.getItem('auth'));
    this.loggedinUser = userDetails.userDetails?.id;
  }

  ngOnInit(): void {
    this.viewRequestById();
    this.addRequestForm = this.fb.group({
      text: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(2)])],
      closedCheckbox: [false, Validators.compose([Validators.nullValidator])]
    });
  }

  viewRequestById(): void {
    this.ticketservice.getRequestByPatientId(this.patientId).subscribe(
      (res) => {
        this.requestPatientRecord = res;
        if (this.requestPatientRecord.length === 0) {
          const body = {
            title: '',
            description: '',
            adminCanClose: false,
            patient: {
              id: this.patientId
            }
          };
          this.ticketservice.addRequestChat(body).subscribe(
            (resData) => {
              this.requestId = resData.id;
            },
          );
        }
        else {
          this.requestId = this.requestPatientRecord[0].id;
          this.viewRequestBypatientId();
        }
      },
      () => {
        // this.snackBarService.error('No Records Found!!', 2000);
      }
    );
  }

  viewRequestBypatientId(): void {

    this.ticketservice.getRequestById(this.requestId, 50).subscribe(
      (data) => {
        this.requestRecord = data;
      },
      () => {
        // this.snackBarService.error('No Records Found!!', 2000);
      }
    );
  }

  submitRequest(): void {
    if (this.addRequestForm.valid) {
      const body = {
        message: this.addRequestForm.get('text').value,
        request: {
          id: this.requestId
        }
      };
      this.ticketservice.addRequest(body).subscribe(
        () => {
          this.viewRequestBypatientId();
          this.addRequestForm.get('text').reset();
        },
        () => {
          this.snackBarService.error('Failed!', 2000);
        }
      );

    }
  }

  closeLink(): void {
    this.dialogRef.close();

  }
}
