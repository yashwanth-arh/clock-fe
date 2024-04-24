import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { CreatesupportticketComponent } from 'src/app/createsupportticket/createsupportticket.component';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-user-support',
  templateUrl: './user-support.component.html',
  styleUrls: ['./user-support.component.scss'],
})
export class UserSupportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('mydiv') mydiv: ElementRef;
  // @ViewChild('table', { read: ElementRef }) table: ElementRef;
  supportTicketResopnse: any;
  ticketId: any;
  status: any;
  title: any;
  description: any;
  changeStatus: any;
  statusGroup: FormGroup;
  commentGroup: FormGroup;
  selIndex: any;
  searchGroup: FormGroup;
  statusFilter: any = 'OPEN';
  patientName: any;
  patiendId: any;
  searchSupport: any;
  searchValue: any;
  isEnableGlobalSearch: boolean;
  selectedIndex: number;
  selectedItem: any;
  createdDate: any;
  showTabBoolean = true;
  pageSizeOptions = [10, 25, 100];
  pageIndex = 0;
  length = -1;
  pageSize = 10;
  userRole: any;
  url: any;
  basePath = environment.imagePathUrl;
  titleList: any = [];
  scopeId: any;
  attachment: any;
  selectedTabName: any = 'Support Tickets';
  tabSelected: any;
  activity: any;
  searchStatus: any;
  raisedBy: any;
  organizationList: FormGroup;
  constructor(
    public hospitalService: HospitalManagementService,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    public entityModalPopup: MatDialog,
    private patientService: PatientManagementService,
    private filterService: FilterSharedService,
    private elementRef: ElementRef,
    protected dialog: MatDialog,
    private caregiverSharedService: CaregiverSharedService,
    private titlecasePipe: TitleCasePipe
  ) {
    // this.basePath =
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.scopeId = authDetails?.userDetails.scopeId;
    this.userRole = authDetails?.userDetails?.userRole;
  }
  ngAfterViewInit(): void {
    this.filterService.supportTicketCall('');
    this.filterService.supportTicketSearch('');
    this.filterService.defaultTicketSearch('');
    this.filterService.TicketSearch.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      this.searchValue = res.searchQuery;
      this.statusSearch();
      // if (this.searchValue?.length == 0) {
      //   this.searchGroup.reset();
      //   this.getSupportTicket();
      //   this.isEnableGlobalSearch = false;
      //   this.showTabBoolean = true;
      // }
      // if (this.searchValue?.length > 2) {
      //   this.isEnableGlobalSearch = true;
      //   this.searchSupportTickets(this.pageIndex, this.pageSize);
      // }
    });

    this.filterService.statusSupport.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      this.searchStatus = res.status;
      this.statusSearch();
    });

    this.filterService.triggeredSupportTicket.subscribe((res) => {
      if (res) {
        this.getSupportTicket();
      }
    });
    this.filterService.subModuleCall(this.selectedTabName);
    // this.filterService.TicketStatus.subscribe((res) => {

    // });

    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.statusGroup = this.fb?.group({
      status: [''],
    });
    this.searchGroup = this.fb?.group({
      searchSupport: [''],
    });
    this.commentGroup = this.fb?.group({
      comment: [''],
    });
    // this.statusFilter = 'ASSIGNED';
    // this.getSupportTicket(this.statusFilter);
  }

  ngOnInit(): void {
    this.organizationList = this.fb.group({
      status: ['Open'],
    });
  }

  isEnableHospitalStatusFunc() {
    this.organizationList.get('status').value;
    this.searchStatus = this.organizationList.get('status').value;
    this.statusSearch();
  }
  goBack() {
    this.router.navigate(['careproviderDashboard/careprovider-patient-list']);
    this.caregiverSharedService.changeHeaderTitle('Dashboard');
  }

  isEnableGlobalSearchFunc1(e) {
    this.paginator.pageIndex = 0;
    this.searchValue = e.target.value;
    if (this.searchValue.length == 0) {
      this.searchGroup.reset();
      this.getSupportTicket();
      this.isEnableGlobalSearch = false;
      this.showTabBoolean = true;
    }
    if (this.searchValue.length) {
      this.isEnableGlobalSearch = true;
      this.searchSupportTickets(this.pageIndex, this.pageSize);
    }
  }
  searchSupportTickets(pageIndex, pageSize) {
    this.hospitalService
      .searchStatus(this.searchValue, pageIndex, pageSize, this.statusFilter)
      .subscribe((res) => {
        this.showTabBoolean = false;
        this.supportTicketResopnse = res.content;
        this.selectedItem = res.content[0];
        this.ticketId = res.content[0]?.id;
        if (res.content[0]?.applicationTicketStatus == 'REASSIGNED') {
          this.status = 'ASSIGNED';
        } else {
          this.status = res.content[0]?.applicationTicketStatus;
        }
        this.url = res?.content[0]?.attachmentUrl;
        this.createdDate = res.content[0]?.createdAt;
        this.title = res.content[0]?.ticketSummary;
        this.description = res.content[0]?.ticketDescription;
        this.patientName = res.content[0]?.raisedByName;
        this.patiendId = res.content[0]?.raisedBy;
        this.length = res.totalElements;
      });
  }
  getFullName(value) {
    return (
      this.titlecasePipe.transform(value.firstName) +
      ' ' +
      this.titlecasePipe.transform(value.middleName ? value.middleName : '') +
      ' ' +
      this.titlecasePipe.transform(value.lastName)
    );
  }
  unselectGlobalSearch(): void {
    // this.searchGroup?.get('searchSupport').setValue('');
    this.paginator.pageIndex = 0;
    this.showTabBoolean = true;
    this.searchGroup.reset();
    this.getSupportTicket();
    this.isEnableGlobalSearch = false;
    this.searchValue = '';
  }
  ngOnDestroy() {
    // this.filterService.statusSupportCall({ status: null });
  }
  statusSearch() {
    if (this.searchValue) {
      if (this.searchStatus === 'Open') {
        this.statusFilter = 'OPEN';
        // if (this.paginator) {
        this.pageIndex = 0;
        // }
        this.searchSupportTickets(this.pageIndex, this.pageSize);
      } else if (this.searchStatus === 'Closed') {
        this.statusFilter = 'CLOSED';

        // if (this.paginator) {
        this.pageIndex = 0;
        // }
        this.searchSupportTickets(this.pageIndex, this.pageSize);
      } else {
        this.statusFilter = 'OPEN';
        this.searchSupportTickets(this.pageIndex, this.pageSize);
      }
    } else {
      if (this.searchStatus == 'Open') {
        this.statusFilter = 'OPEN';
        // if (this.paginator) {
        this.pageIndex = 0;
        // }
        this.getSupportTicket();
      } else if (this.searchStatus == 'Closed') {
        this.statusFilter = 'CLOSED';

        // if (this.paginator) {
        this.pageIndex = 0;
        // }
        this.getSupportTicket();
      } else {
        this.statusFilter = 'OPEN';
        this.getSupportTicket();
      }
    }
  }

  scrollToTop() {
    const divElement: HTMLElement = this.myDiv.nativeElement;
    divElement.scrollTop = 0;
  }

  scrollTotop() {
    const divelement: HTMLElement = this.mydiv.nativeElement;
    divelement.scrollTop = 0;
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();
    this.scrollTotop();
    this.length = event.length;
    // this.getSupportTicket(this.statusFilter,event.pageIndex,
    //   event.pageSize,
    //   this.sort.active,
    //   this.sort.direction);
    if (this.searchValue) {
      this.searchSupportTickets(event.pageIndex, event.pageSize);
    } else {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;

      this.getSupportTicket();
    }
  }

  getSupportTicket1(statusFilter) {
    this.selectedTabName = statusFilter.tab.textLabel;

    this.filterService.subModuleCall(this.selectedTabName);
    // this.statusFilter = statusFilter?.tab?.textLabel;
    this.tabSelected = statusFilter?.tab?.textLabel;
    if (this.tabSelected == 'Support Ticket') {
      this.statusFilter = 'OPEN';
      this.router.navigate(['/home/tickets']);
      this.selIndex = 0;
    }
    if (this.statusFilter == 'Inprogress') {
      this.statusFilter = 'INPROGRESS';
    }
    if (this.tabSelected == 'Default Issues') {
      // this.statusFilter = 'CLOSED';
      this.router.navigate(['home/tickets/ticket-title']);
      this.selIndex = 1;
    }
    this.hospitalService
      .getSupportTicketsp(this.statusFilter, this.pageIndex, this.pageSize)
      .subscribe((res) => {
        this.paginator.pageIndex = 0;
        this.length = res.totalElements;
        this.selectedItem = res.content[0];
        this.ticketId = res?.content[0]?.id;
        if (res?.content[0]?.applicationTicketStatus == 'REASSIGNED') {
          this.status = 'ASSIGNED';
        } else {
          this.status = res?.content[0]?.applicationTicketStatus;
        }
        // this.status = res?.content[0]?.applicationTicketStatus;
        this.url = res?.content[0]?.attachmentUrl;
        this.title = res?.content[0]?.ticketSummary;
        this.description = res?.content[0]?.ticketDescription;
        this.patientName = res?.content[0]?.raisedByName;
        this.patiendId = res?.content[0]?.raisedBy;
        this.createdDate = res?.content[0]?.createdAt;

        if (res?.content?.length) {
          this.hospitalService
            .getSupportTicketsId(this.ticketId)
            .subscribe((resp) => {
              this.attachment = resp?.Attachments;

              // this.url =this.attachment.documentPath
            });
          this.hospitalService
            .getSupportTicketsActivity(this.ticketId)
            .subscribe((res) => {
              this.activity = res.ticketLogsDetails;

              // this.url =this.attachment.documentPath
            });
        }
        if (this?.status == 'ASSIGNED' && this.userRole !== 'RPM_ADMIN') {
          this.changeStatus = [
            'CLOSED',
            //  'REASSIGN'
          ];
        }

        if (this?.status == 'ASSIGNED' && this.userRole == 'RPM_ADMIN') {
          this.changeStatus = ['CLOSED'];
        }
        // if (this?.status == 'INPROGRESS') {
        //   this.changeStatus = ['COMPLETED'];
        // }
        if (this?.status == 'CLOSED') {
          this.changeStatus = ['REOPEN'];
        }
        if (this?.status == 'REOPEN' && this.userRole !== 'RPM_ADMIN') {
          this.changeStatus = [
            'CLOSED',
            //  'REASSIGN'
          ];
        }

        if (this?.status == 'REOPEN' && this.userRole == 'RPM_ADMIN') {
          this.changeStatus = ['CLOSED'];
        }
        this.supportTicketResopnse = res?.content;

        this.length = res?.totalElements;
      });
  }
  imagePreview(img) {
    this.downloadProfileIcon(img);
  }
  downloadProfileIcon(img) {
    this.patientService.downloadPatientConsentForm(img);
  }
  addeditTicket() {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;

    (createEntityModalConfig.width = '128vh'),
      (createEntityModalConfig.data = 'add');
    this.entityModalPopup
      .open(CreatesupportticketComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getSupportTicket();
      });
  }
  editTicket() {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '600px'),
      (createEntityModalConfig.data = this.selectedItem);
    this.entityModalPopup
      .open(CreatesupportticketComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getSupportTicket();
      });
  }
  ticketTiltle(e) {
    // if (this.userRole == 'RPM_ADMIN') {
    //   this.router.navigate(['/home/support-ticket/ticket-title']);
    // } else {
    //   this.addeditTicket();
    // }
  }
  getSupportTicket() {
    this.hospitalService
      .getSupportTicketsp(this.statusFilter, this.pageIndex, this.pageSize)
      .subscribe((res) => {
        this.selectedItem = res.content[0];
        this.ticketId = res?.content[0]?.id;
        // this.status = res?.content[0]?.applicationTicketStatus;
        if (res.content[0]?.applicationTicketStatus == 'REASSIGNED') {
          this.status = 'ASSIGNED';
        } else {
          this.status = res.content[0]?.applicationTicketStatus;
        }
        this.url = res?.content[0]?.attachmentUrl;
        this.title = res?.content[0]?.ticketSummary;
        this.description = res?.content[0]?.ticketDescription;
        this.patientName = res?.content[0]?.raisedByName;
        this.url = res?.content[0]?.attachmentUrl;
        this.patiendId = res?.content[0]?.raisedBy;
        this.createdDate = res?.content[0]?.createdAt;

        if (this.ticketId) {
          this.hospitalService
            .getSupportTicketsId(this.ticketId)
            .subscribe((data) => {
              this.attachment = data?.Attachments;
              // this.url =this.attachment.documentPath
            });
          this.hospitalService
            .getSupportTicketsActivity(this.ticketId)
            .subscribe((res) => {
              this.activity = res.ticketLogsDetails;

              // this.url =this.attachment.documentPath
            });
        }

        if (this?.status == 'ASSIGNED' && this.userRole !== 'RPM_ADMIN') {
          this.changeStatus = [
            'CLOSED',
            //  'REASSIGN'
          ];
        }

        if (this?.status == 'ASSIGNED' && this.userRole == 'RPM_ADMIN') {
          this.changeStatus = ['CLOSED'];
        }
        // if (this?.status == 'INPROGRESS') {
        //   this.changeStatus = ['COMPLETED'];
        // }
        if (this?.status == 'CLOSED') {
          this.changeStatus = ['REOPEN'];
        }
        if (this?.status == 'REOPEN' && this.userRole !== 'RPM_ADMIN') {
          this.changeStatus = [
            'CLOSED',
            // 'REASSIGN'
          ];
        }

        if (this?.status == 'REOPEN' && this.userRole == 'RPM_ADMIN') {
          this.changeStatus = ['CLOSED'];
        }
        this.supportTicketResopnse = res.content;

        this.length = res.totalElements;
      });
  }
  ticketdetails(element) {
    this.hospitalService
      .getSupportTicketsActivity(element.id)
      .subscribe((res) => {
        this.activity = res.ticketLogsDetails;

        // this.url =this.attachment.documentPath
      });
    this.hospitalService.getSupportTicketsId(element.id).subscribe((res) => {
      this.attachment = res?.Attachments;

      // this.url =this.attachment.documentPath
    });
    this.selectedItem = element;
    this.ticketId = element.id;
    // this.status = element.applicationTicketStatus;
    if (element.applicationTicketStatus == 'REASSIGNED') {
      this.status = 'ASSIGNED';
    } else {
      this.status = element.applicationTicketStatus;
    }
    this.title = element.ticketSummary;
    this.description = element.ticketDescription;
    this.patientName = element.raisedByName;
    this.patiendId = element.raisedBy;
    this.createdDate = element.createdAt;

    if (this?.status == 'ASSIGNED' && this.userRole !== 'RPM_ADMIN') {
      this.changeStatus = [
        'CLOSED',
        // 'REASSIGN'
      ];
    }

    if (this?.status == 'ASSIGNED' && this.userRole == 'RPM_ADMIN') {
      this.changeStatus = ['CLOSED'];
    }
    // if (this?.status == 'INPROGRESS') {
    //   this.changeStatus = ['COMPLETED'];
    // }
    if (this?.status == 'CLOSED') {
      this.changeStatus = ['REOPEN'];
    }
    if (this?.status == 'REOPEN' && this.userRole !== 'RPM_ADMIN') {
      this.changeStatus = [
        'CLOSED',
        //  'REASSIGN'
      ];
    }

    if (this?.status == 'REOPEN' && this.userRole == 'RPM_ADMIN') {
      this.changeStatus = ['CLOSED'];
    }
  }

  closeTicket(id) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '382px',
      height: '182px',
      data: {
        title: 'Close Ticket',
        content: `Are you sure you want to close the ticket?`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.hospitalService.closeSupportTicket(id).subscribe((res) => {
            this.snackbar.success('Status changed successfully');
            this.getSupportTicket();
            this.ticketId = res?.content[0].id;
            this.supportTicketResopnse = res;
            // this.statusGroup.reset();
            // this.statusGroup.get('status').setValue('')
          });
        } else {
        }
      });
  }

  escalateTicket(id) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '382px',
      height: '182px',
      data: {
        title: 'Escalate Ticket',
        content: `Are you sure you want to escalate the ticket?`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.hospitalService.reassignSupportTicket(id).subscribe((res) => {
            this.snackbar.success('Status changed successfully');
            this.getSupportTicket();
            this.ticketId = res?.content[0].id;
            this.supportTicketResopnse = res;
            // this.statusGroup.reset();
            // this.statusGroup.get('status').setValue('')
          });
        } else {
        }
      });
  }

  reOpenTicket(id) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '382px',
      height: '182px',
      data: {
        title: 'Re-open Ticket',
        content: `Are you sure you want to Re-open the ticket?`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.hospitalService.reopenSupportTicket(id).subscribe((res) => {
            this.snackbar.success('Status changed successfully');
            this.getSupportTicket();
            this.ticketId = res?.content[0].id;
            this.supportTicketResopnse = res;
            // this.statusGroup.reset();
            // this.statusGroup.get('status').setValue('')
          });
        } else {
        }
      });
  }

  getStatus(ele: any) {
    if (ele.applicationTicketStatus === 'REASSIGNED') {
      return 'ASSIGNED';
    } else {
      return ele.applicationTicketStatus;
    }
  }

  statusChange(e, ticketId) {
    if (e.value == 'CLOSED') {
      this.hospitalService.closeSupportTicket(ticketId).subscribe((res) => {
        this.snackbar.success('Status changed successfully');
        this.statusGroup.get('status').reset();
        this.statusGroup.get('status').clearValidators();
        this.getSupportTicket();
        this.ticketId = res?.content[0].id;
        this.supportTicketResopnse = res;
        // this.statusGroup.reset();
        // this.statusGroup.get('status').setValue('')
      });
    }
    if (e.value == 'REOPEN') {
      this.hospitalService.reopenSupportTicket(ticketId).subscribe(
        (res) => {
          this.snackbar.success('Status changed successfully');
          this.statusGroup.get('status').reset();
          this.statusGroup.get('status').clearValidators();
          this.getSupportTicket();
          this.ticketId = res?.content[0].id;
          this.supportTicketResopnse = res;
        },
        (err) => {
          this.statusGroup.get('status').reset();
          this.statusGroup.get('status').clearValidators();
        }
      );
    }

    if (e.value == 'REASSIGN') {
      this.hospitalService.reassignSupportTicket(ticketId).subscribe(
        (res) => {
          this.snackbar.success('Status changed successfully');
          this.statusGroup.get('status').reset();
          this.statusGroup.get('status').clearValidators();
          this.getSupportTicket();
          this.ticketId = res?.content[0].id;
          this.supportTicketResopnse = res;
          // this.statusGroup.reset();
          // this.statusGroup.get('status').setValue('')
        },
        (err) => {
          this.statusGroup.get('status').reset();
          this.statusGroup.get('status').clearValidators();
        }
      );
    }

    // this.hospitalService.changeStatus(e.value, ticketId).subscribe((res) => {
    //   this.snackbar.success('Status changed sucessfully')
    //   this.statusGroup.get('status').reset();
    //   this.statusGroup.get('status').clearValidators();
    //   this.getSupportTicket(res.applicationTicketStatus)
    //   this.ticketId = res?.content[0].id
    //   this.supportTicketResopnse = res;
    //   // this.statusGroup.reset();
    //   // this.statusGroup.get('status').setValue('')

    // });
  }
}
