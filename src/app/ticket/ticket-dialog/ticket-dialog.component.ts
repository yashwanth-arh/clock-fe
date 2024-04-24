import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TicketService } from '../ticket.service';
@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.scss'],
})
export class TicketDialogComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'description',
    'raisedby',
    'closedBy',
    'requestedDate',
    'status',
    'Actions',
  ];
  dataSource: MatTableDataSource<any>;
  requestId: string;
  requestRecord: any;
  addRequestForm: FormGroup;
  public loggedinUser: string;

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  constructor(
    public ticketModalPopup: MatDialog,
    private ticketservice: TicketService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.viewRequestById();

    this.addRequestForm = this.fb.group({
      text: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(2)])],
      closedCheckbox: ['', Validators.compose([Validators.nullValidator])]
    });
    const userDetails = JSON.parse(localStorage.getItem('auth'));
    this.loggedinUser = userDetails?.userDetails?.id;
  }

  addTicket(id: any): void {
    const raiseTicketModalConfig = new MatDialogConfig();
    raiseTicketModalConfig.disableClose = true;
    raiseTicketModalConfig.maxWidth = '100vw';
    raiseTicketModalConfig.maxHeight = '100vh';
    raiseTicketModalConfig.width = '750px';
    raiseTicketModalConfig.position = { bottom: '0px', right: '0px' };
    raiseTicketModalConfig.data = { id },
      this.ticketModalPopup.open(TicketDialogComponent, raiseTicketModalConfig);
  }

  editTicket(data: any): void {
    const raiseTicketModalConfig = new MatDialogConfig();

    raiseTicketModalConfig.disableClose = true;
    raiseTicketModalConfig.maxWidth = '100vw',
      raiseTicketModalConfig.maxHeight = '100vh',
      raiseTicketModalConfig.width = '750px',
      raiseTicketModalConfig.data = data,
      this.ticketModalPopup.open(TicketDialogComponent, raiseTicketModalConfig);
  }

  viewRequestById(): void {
    this.requestId = localStorage.getItem('requestId');
    this.ticketservice.getRequestById(this.requestId).subscribe(
      (data) => {
        this.requestRecord = data;
      },
      (error) => {
       // this.snackBarService.error(error.message, 2000);
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
        (data) => {
          this.viewRequestById();
          this.addRequestForm.get('text').reset();
        },
        (error) => {
          this.snackBarService.error('Request submission failed!', 2000);
        }
      );

    }
  }
  closeRequest(): void {
    this.dialogRef.close();
  }
}
