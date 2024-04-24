import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CreatesupportticketComponent } from 'src/app/createsupportticket/createsupportticket.component';
import { DeviceModelDialogComponent } from 'src/app/device-management/device-models/device-model-dialog/device-model-dialog.component';
import { DeviceModelService } from 'src/app/device-management/device-models/device-model.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';

import { DiseaseService } from 'src/app/settings-management/services/disease.service';
import { TicketService } from 'src/app/ticket/ticket.service';
import { TicketTitleDialogComponent } from './ticket-title-dialog/ticket-title-dialog.component';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-ticket-title',
  templateUrl: './ticket-title.component.html',
  styleUrls: ['./ticket-title.component.scss'],
})
export class TicketTitleComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;

  displayedColumns: string[] = ['name', 'user', 'action'];
  dataSource: MatTableDataSource<any>;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  pageSize = 10;

  public deviceModelfilter: FormGroup;

  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;
  questions: any;
  userPermission: any;
  statusFilter: any;
  defaultsearch: any;
  lengths: any;
  userRole: any;
  leavingComponent: boolean =false;

  constructor(
    private router: Router,
    public entityModalPopup: MatDialog,
    public deviceModelservice: DeviceModelService,
    private snackBarService: SnackbarService,
    public diseaseService: DiseaseService,
    private fb: FormBuilder,
    private filterService: FilterSharedService,
    public authService: AuthService
  ) {
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
    // this.getDeviceModels();
    this.getTitles();
  }
  ngOnDestroy(): void {
    this.leavingComponent =true;
   }

  ngOnInit(): void {
    
    this.leavingComponent =false;
    this.filterService.defaultSearch.subscribe((res) => {
      this.defaultsearch = res.searchQuery;
      //  this.paginator.pageIndex = 0;
      if (this.defaultsearch?.length > 1) {
        this.isEnableGlobalSearch = true;
        this.ticketTilteFilter();
      } else if (!this.defaultsearch) {
        this.getTitles();
        this.isEnableGlobalSearch = false;
        localStorage.removeItem('searchDataLength');
        this.showValidTextMessage = false;
      }

      // this.defaultsearch = res.searchQuery;
      // //  this.paginator.pageIndex = 0;
      // if (this.defaultsearch?.length) {
      //   this.onDeviceModelFilter();
      //   this.isEnableGlobalSearch = true;
      // } else if (!this.defaultsearch) {
      //   this.getTitles();
      //   this.isEnableGlobalSearch = false;
      //   localStorage.removeItem('searchDataLength');
      //   this.showValidTextMessage = false;
      // }
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {}

  getSupportTicket1(statusFilter) {
    this.statusFilter = statusFilter?.tab?.textLabel;
    if (this.statusFilter == 'Support Tickets') {
      this.statusFilter = 'ASSIGNED';
      this.router.navigate(['/home/tickets']);
    }
    if (this.statusFilter == 'Inprogress') {
      this.statusFilter = 'INPROGRESS';
    }
    if (this.statusFilter == 'Defalut Issues') {
      // this.statusFilter = 'CLOSED';
      this.router.navigate(['home/tickets/ticket-title']);
    }
  }

  handlePageEvent(event: PageEvent): void {
    if (this.defaultsearch?.length > 1) {
      this.pageIndex=event.pageIndex; 
      this.pageSize=event.pageSize;
      this.ticketTilteFilter();
    }
    else{
    
    this.table.nativeElement.scrollIntoView();

    this.length = event.length;
    this.diseaseService.getTitles(event.pageIndex, event.pageSize).subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res?.['questions']?.content);
        this.questions = res?.['questions']?.content?.supportTicketQuestions;
        
        this.userPermission = res?.['questions']?.content?.userPermission;
        this.length = res?.['questions']?.totalElements;
        this.lengths = res?.['questions']?.content?.length;
      },
      (error) => {}
    );
    }
  }

  ticketTilteFilter(): void {
    this.paginator.pageIndex=0;
    this.diseaseService
      .getTitlesSearch(this.pageIndex, this.pageSize, this.defaultsearch)
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data?.['questions']?.content);
        this.questions = data?.['questions']?.content?.supportTicketQuestions;

        this.userPermission = data?.['questions']?.content?.userPermission;
        this.length = data?.['questions']?.totalElements;
        this.lengths = data?.['questions']?.content?.length;
      });
  }
  // global Search

  addeditTicketTitle(data) {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '42.5%'),
      (createEntityModalConfig.data = data);
    this.entityModalPopup
      .open(TicketTitleDialogComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.getTitles();
        }
      });
  }
  editTicketTitle(data, ques, user) {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '42.5%'),
      ((createEntityModalConfig.data = data), ques, user);
    this.entityModalPopup
      .open(TicketTitleDialogComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.getTitles();
        }
      });
  }

  ticketTiltle() {
    this.router.navigate(['/home/tickets/ticket-title']);
  }
  getTitles() {
    this.pageIndex=0;
    if(this.leavingComponent ){
      return;
    }
    this.diseaseService.getTitles(this.pageIndex, this.pageSize).subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res?.['questions']?.content);
        this.questions = res?.['questions']?.content?.supportTicketQuestions;
        
        this.userPermission = res?.['questions']?.content?.userPermission;
        this.length = res?.['questions']?.totalElements;
        this.lengths = res?.['questions']?.content?.length;
      },
      (error) => {}
    );
  }
  goToTickets() {
    this.router.navigate(['/home/tickets']);
  }
}
