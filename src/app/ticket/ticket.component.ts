import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { SnackbarService } from '../core/services/snackbar.service';
import { TicketService } from '../ticket/ticket.service';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'patient.firstName',
    'patient.cellNumber',
    'lastComment',
    'doctor.name',
    'requestedDate'
  ];
  dataSource: MatTableDataSource<any>;
  hospitalName = new FormControl();
  cityName = new FormControl();
  stateName = new FormControl();
  filteredHospital: Observable<any>;
  filteredCity: Observable<any>;
  filteredState: Observable<any>;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  searchquery = new FormControl();
  isEnableGlobalSearch: boolean;
  public ticketfilter: FormGroup;
  applyFilter(event: Event) {
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
    private fb: FormBuilder

  ) {
    this.getRequestList();

  }

  ngOnInit(): void {
    this.ticketfilter = this.fb.group({
      searchQuery: ['', Validators.nullValidator]
    });

  }

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.getRequestList(0, 0, this.sort.active, this.sort.direction))

      ).subscribe();
  }

  addTicket(id: any): void {
    const raiseTicketModalConfig = new MatDialogConfig();

    raiseTicketModalConfig.disableClose = true;
    raiseTicketModalConfig.maxWidth = '100vw',
      raiseTicketModalConfig.maxHeight = '100vh',
      raiseTicketModalConfig.width = '750px',
      raiseTicketModalConfig.data = { id },
      this.ticketModalPopup.open(TicketDialogComponent, raiseTicketModalConfig);
  }

  viewTicket(data: any): void {
    localStorage.setItem('requestId', data.id);
    const raiseTicketModalConfig = new MatDialogConfig();
    raiseTicketModalConfig.disableClose = true;
    raiseTicketModalConfig.maxWidth = '100vw';
    raiseTicketModalConfig.height = '100vh';
    raiseTicketModalConfig.width = '400px';
    raiseTicketModalConfig.position = { bottom: '0px', right: '0px' };
    raiseTicketModalConfig.data = data;
    this.ticketModalPopup.open(TicketDialogComponent, raiseTicketModalConfig).afterClosed()
      .subscribe((e) => {
        this.getRequestList();
      });
  }


  handlePageEvent(event: PageEvent): void {
    this.length = event.length;
    this.getRequestList(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction);
  }

  getRequestList(pageNumber = 0, pageSize = 10, pageSort = 'lastUpdatedAt', direction = 'desc'): void {
    this.ticketservice.getAllRequest(pageNumber, pageSize, pageSort, direction).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.length = data.totalElements;
        this.pageIndex = pageNumber;
      },
      (error) => {
        // this.snackBarService.error('Failed', 2000);
      }
    );
  }

  onRequestFilter(): void {
    const pageNumber = 0;
    const pageSize = 10;
    const pageSort = 'lastUpdatedAt';
    const direction = 'desc';
    this.ticketservice.getAllRequest(
      pageNumber, pageSize, pageSort, direction,
      this.ticketfilter.get('searchQuery').value !== '' ? this.ticketfilter.get('searchQuery').value : null
    ).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.length = data.totalElements;
    });
  }

  unselectGlobalSearch(): void {
    this.ticketfilter.get('searchQuery').reset();
    this.isEnableGlobalSearch = false;
    this.onRequestFilter();
  }

  isEnableGlobalSearchFunc(): any {
    this.isEnableGlobalSearch = true;
  }

}

