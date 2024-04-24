import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SnackbarService } from '../core/services/snackbar.service';
import { ClockHealthAdminDialogComponent } from '../clock-health-admin-dialog/clock-health-admin-dialog.component';
import { CHAdminService } from './clock-health-admin.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TitleCasePipe, ViewportScroller } from '@angular/common';
import { ActionToggleDialogComponent } from '../CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';

@Component({
  selector: 'app-clock-health-admin',
  templateUrl: './clock-health-admin.component.html',
  styleUrls: ['./clock-health-admin.component.scss'],
})
export class ClockHealthAdminComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  vendorName = new FormControl();
  statusSelected = new FormControl();
  deviceName = new FormControl();
  filteredStatus: Observable<any>;
  filteredVendor: Observable<any>;
  filteredDevice: Observable<any>;
  chAdmins: any;
  isEnableGlobalSearch: boolean;
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = [
    'name',
    'email',
    'mobileNo',
    'status',
    'action',
  ];
  dataSource: MatTableDataSource<any>;
  messageSuccess: boolean;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private chAdminService: CHAdminService,
    private snackBarService: SnackbarService,
    private titlecasePipe: TitleCasePipe,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router?.routerState?.snapshot?.url?.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.getClockHealthAdmins(this.pageIndex, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          // this.table.nativeElement.scrollIntoView();
    this.scrollToTop();
          this.getClockHealthAdmins(
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        })
      )
      .subscribe();
  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();
    // this.table.nativeElement.scrollIntoView();
    this.length = event.length;
    this.getClockHealthAdmins(event.pageIndex, event.pageSize);
  }

  openCHAdmin(data: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      (dialogConfig.width = '65%'),
      (dialogConfig.data = data);
    this.dialog
      .open(ClockHealthAdminDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.paginator.pageIndex = 0;
        this.getClockHealthAdmins(0, 10);
      });
  }
  getName(ele) {
    const firstName = this.titlecasePipe.transform(ele.firstname);
    const middleName = ele.middlename ? ' ' + this.titlecasePipe.transform(ele.middlename) : '';
    const lastName = ' ' +this.titlecasePipe.transform(ele.lastname);
    
    return firstName + middleName + lastName;
  }
  getClockHealthAdmins(pageNumber, pageSize): void {
    this.chAdminService.getCHAdmins(pageNumber, pageSize).subscribe(
      (data) => {
        this.chAdmins = data;
        // if (data['err'] === 403) {
        //   this.snackBarService.error(data['message']);
        // }
        const list = data.content;
        this.dataSource = new MatTableDataSource(list);
        this.length = data.totalElements;
        this.pageIndex = pageNumber;
        // this.snackBarService.openSnackBar("Successfull!", "close", 3000);
      },
      (error) => {
        this.snackBarService.error(error.message);
      }
    );
  }
  statusChange(element) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
          width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status for "${element.firstname} ${
          element.lastname
        }" to "${
          element.status === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.chAdminService
            .CHAdminStatusChange(
              element.id,
              element.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe((res) => {
              this.snackBarService.success('Status changed successfully');
              this.paginator.pageIndex = 0;
              this.getClockHealthAdmins(0, 10);
            });
        } else {
          this.getClockHealthAdmins(0, 10);
        }
      });
  }
}
