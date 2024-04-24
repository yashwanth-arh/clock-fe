import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Environment } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { FilterSharedService } from '../core/services/filter-shared.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { CreatesupportticketComponent } from '../createsupportticket/createsupportticket.component';
import { HospitalManagementService } from '../hospital-management/service/hospital-management.service';
import { PatientManagementService } from '../patient-management/service/patient-management.service';
import { TicketService } from '../ticket/ticket.service';
import { ActionToggleDialogComponent } from '../CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class SupportTicketComponent implements OnInit, AfterViewInit {
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
  leavingComponent: boolean = false;
  raisedBy: any;
  adminAccess: string;
  urls: any;
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
    private titlecasePipe: TitleCasePipe
  ) {
    // this.basePath =
    this.leavingComponent = false;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    // console.log(authDetails.s3BaseUrl);
    this.urls = authDetails.s3BaseUrl;

    this.scopeId = authDetails?.userDetails.scopeId;
    this.userRole = authDetails?.userDetails?.userRole;
    this.adminAccess = localStorage.getItem('adminAccess');
  }
  ngAfterViewInit(): void {
    this.leavingComponent = false;
    this.filterService.supportTicketCall('');
    this.filterService.supportTicketSearch('');
    this.filterService.TicketSearch.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      if (res) {
        this.searchValue = res.searchQuery;
        this.statusSearch();
      } else {
        this.statusSearch();
      }
    });

    this.filterService.statusSupport.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      if (Object.keys(res) && res.status) {
        this.searchStatus = res.status;
        this.statusSearch();
      } else {
        this.statusSearch();
      }
    });

    this.filterService.triggeredSupportTicket.subscribe((res) => {
      if (res) {
        this.getSupportTicket();
      }
    });
    this.filterService.subModuleCall(this.selectedTabName);
    // this.filterService.TicketStatus.subscribe((res) => {

    // });
    // this.statusSearch();
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

  ngOnInit(): void {}

  searchSupportTickets(pageIndex, pageSize) {
    if (this.leavingComponent) {
      return;
    }
    this.hospitalService
      .searchStatus(this.searchValue, pageIndex, pageSize, this.statusFilter)
      .subscribe((res) => {
        this.showTabBoolean = false;
        this.supportTicketResopnse = res.content;
        this.selectedItem = res.content[0];
        this.ticketId = res.content[0]?.id;
        if (res?.content[0]?.applicationTicketStatus === 'REASSIGNED') {
          if (this.userRole === 'FACILITY_USER') {
            if (res?.content[0]?.raisedToFacility === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'HOSPITAL_USER') {
            if (res?.content[0]?.raisedTo === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'RPM_ADMIN') {
            this.status = 'ASSIGNED';
          }
        } else {
          this.status = res?.content[0]?.applicationTicketStatus;
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
  ngOnDestroy() {
    this.leavingComponent = true;
    // this.filterService.statusSupportCall({ status: null });
  }
  statusSearch() {
    if (this.leavingComponent) {
      return;
    }
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

  // getFullName(e) {
  //   return e?.firstName
  //     ? e.firstName
  //     : '' + ' ' + e?.middleName
  //     ? e.middleName
  //     : '' + ' ' + e?.lastName
  //     ? e.lastName
  //     : '';
  // }
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
        this.filterService.statusSupport.next({ status: 'Open' });
        this.paginator.pageIndex = 0;
        this.length = res.totalElements;
        this.selectedItem = res.content[0];
        this.ticketId = res?.content[0]?.id;
        this.url = res?.content[0]?.attachmentUrl;
        this.title = res?.content[0]?.ticketSummary;
        this.description = res?.content[0]?.ticketDescription;
        this.patientName = res?.content[0]?.raisedByName;
        this.patiendId = res?.content[0]?.raisedBy;
        this.createdDate = res?.content[0]?.createdAt;
        if (res?.content[0]?.applicationTicketStatus === 'REASSIGNED') {
          if (this.userRole === 'FACILITY_USER') {
            if (res?.content[0]?.raisedToFacility === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'HOSPITAL_USER') {
            if (res?.content[0]?.raisedTo === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'RPM_ADMIN') {
            this.status = 'ASSIGNED';
          }
        } else {
          this.status = res?.content[0]?.applicationTicketStatus;
        }

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
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '600px'),
      (createEntityModalConfig.data = 'add');
    this.entityModalPopup
      .open(CreatesupportticketComponent, createEntityModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.getSupportTicket();
        }
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
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.getSupportTicket();
        }
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
    if (this.leavingComponent) {
      return;
    }
    this.hospitalService
      .getSupportTicketsp(this.statusFilter, this.pageIndex, this.pageSize)
      .subscribe((res) => {
        this.selectedItem = res.content[0];
        this.ticketId = res?.content[0]?.id;
        if (res?.content[0]?.applicationTicketStatus === 'REASSIGNED') {
          if (this.userRole === 'FACILITY_USER') {
            if (res?.content[0]?.raisedToFacility === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'HOSPITAL_USER') {
            if (res?.content[0]?.raisedTo === null) {
              this.status = 'ASSIGNED';
            } else {
              this.status = res?.content[0]?.applicationTicketStatus;
            }
          }
          if (this.userRole === 'RPM_ADMIN') {
            this.status = 'ASSIGNED';
          }
        } else {
          this.status = res?.content[0]?.applicationTicketStatus;
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
              // this.filterService.statusSupport.next({ status: 'Open' });
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
  getFullName(value) {
    return (
      this.titlecasePipe.transform(value.firstName) +
      ' ' +
      this.titlecasePipe.transform(value.middleName ? value.middleName : '') +
      ' ' +
      this.titlecasePipe.transform(value.lastName)
    );
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
    this.status = element.applicationTicketStatus;
    if (element.applicationTicketStatus === 'REASSIGNED') {
      if (this.userRole === 'FACILITY_USER') {
        if (element.raisedToFacility === null) {
          this.status = 'ASSIGNED';
        } else {
          this.status = element.applicationTicketStatus;
        }
      }
      if (this.userRole === 'HOSPITAL_USER') {
        if (element.raisedTo === null) {
          this.status = 'ASSIGNED';
        } else {
          this.status = element.applicationTicketStatus;
        }
      }
      if (this.userRole === 'RPM_ADMIN') {
        this.status = 'ASSIGNED';
      }
    } else {
      this.status = element.applicationTicketStatus;
    }
    // if( element.applicationTicketStatus === 'REASSIGNED' && this.userRole === 'HOSPITAL_USER'){
    //   if(element.raisedTo === null){
    //     this.status='ASSIGNED'
    //   }

    // }
    // if(element.applicationTicketStatus === 'REASSIGNED' && (this.userRole === 'RPM_ADMIN' || this.userRole === 'FACILITY_USER')){
    //   this.status='ASSIGNED'
    //   console.log(this.status);

    // }
    // else{
    //   this.status = element.applicationTicketStatus;
    // }
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
  getStatus(ele: any) {
    if (ele.applicationTicketStatus === 'REASSIGNED') {
      if (this.userRole === 'FACILITY_USER') {
        if (ele.raisedToFacility === null) {
          return 'ASSIGNED';
        } else {
          return ele.applicationTicketStatus;
        }
      }
      if (this.userRole === 'HOSPITAL_USER') {
        if (ele.raisedTo === null) {
          return 'ASSIGNED';
        } else {
          return ele.applicationTicketStatus;
        }
      }
      if (this.userRole === 'RPM_ADMIN') {
        return 'ASSIGNED';
      }
    } else {
      return ele.applicationTicketStatus;
    }
    // if( ele.applicationTicketStatus === 'REASSIGNED' && this.userRole === 'HOSPITAL_USER'){
    //   if(ele.raisedTo === null){
    //     return 'ASSIGNED'
    //   }

    // }
    // if(ele.applicationTicketStatus === 'REASSIGNED' && (this.userRole === 'RPM_ADMIN' || this.userRole === 'FACILITY_USER')){
    //   return 'ASSIGNED'

    // }
    // else{
    //   return ele.applicationTicketStatus;
    // }
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
